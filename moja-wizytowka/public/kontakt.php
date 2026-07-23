<?php
/**
 * Backend formularza kontaktowego (Hostinger, PHP + PHPMailer + SMTP).
 *
 * Przepływ:
 *  - przyjmuje wyłącznie POST z formularza na stronie głównej,
 *  - honeypot: wypełnione pole "bot-field" kończy się pozornym sukcesem bez wysyłki,
 *  - walidacja serwerowa z tymi samymi limitami co w HTML
 *    (firma 2–120, e-mail ≤ 254, wiadomość 20–3000),
 *  - wysyłka przez uwierzytelniony SMTP (PHPMailer), dane z pliku konfiguracyjnego
 *    przechowywanego POZA katalogiem publicznym (zob. kontakt.config.example.php),
 *  - gdy konfiguracji SMTP/PHPMailera brak lub wysyłka SMTP się nie powiedzie,
 *    zgłoszenie idzie transportem zapasowym przez funkcję mail() serwera,
 *  - sukces → przekierowanie 303 na /dziekuje.html,
 *  - odrzucenie → strona z komunikatem i linkiem powrotnym do formularza.
 *
 * Treść zgłoszeń nie jest zapisywana w logach ani plikach serwera.
 */

declare(strict_types=1);

const ODBIORCA = 'mikolajoczkowski42@gmail.com';
const LIMIT_FIRMA_MIN = 2;
const LIMIT_FIRMA_MAX = 120;
const LIMIT_EMAIL_MAX = 254;
const LIMIT_WIADOMOSC_MIN = 20;
const LIMIT_WIADOMOSC_MAX = 3000;

/** Neutralna strona komunikatu — bez echa danych użytkownika, style zgodne z CSP. */
function pokaz_komunikat(int $statusHttp, string $tytul, array $punkty, string $opis = ''): void
{
    http_response_code($statusHttp);
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Robots-Tag: noindex, nofollow');
    $lista = '';
    foreach ($punkty as $punkt) {
        $lista .= '<li>' . htmlspecialchars($punkt, ENT_QUOTES, 'UTF-8') . '</li>';
    }
    if ($lista !== '') {
        $lista = '<ul class="static-list">' . $lista . '</ul>';
    }
    $opisHtml = $opis === '' ? '' : '<p>' . htmlspecialchars($opis, ENT_QUOTES, 'UTF-8') . '</p>';
    $tytulHtml = htmlspecialchars($tytul, ENT_QUOTES, 'UTF-8');
    echo <<<HTML
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,nofollow">
    <title>{$tytulHtml} — Mikołaj Oczkowski</title>
    <link rel="icon" href="/assets/logo-mark.png" type="image/png" sizes="256x256">
    <link rel="stylesheet" href="/static-pages.css">
  </head>
  <body class="static-page">
    <main class="static-card">
      <img class="static-mark" src="/assets/logo-mark.png" width="256" height="256" alt="">
      <h1>{$tytulHtml}</h1>
      {$opisHtml}
      {$lista}
      <a class="static-button" href="/index.html#kontakt">Wróć do formularza</a>
      <p class="meta">Możesz też napisać bezpośrednio na <a href="mailto:mikolajoczkowski42@gmail.com">mikolajoczkowski42@gmail.com</a>.</p>
    </main>
  </body>
</html>
HTML;
    exit;
}

function przekieruj_303(string $adres): void
{
    header('Location: ' . $adres, true, 303);
    exit;
}

/** Usuwa znaki nowej linii i znaki sterujące — ochrona przed wstrzyknięciem nagłówków. */
function oczysc_linie(string $tekst): string
{
    $bezSterujacych = preg_replace('/[\r\n\t\x00-\x1F\x7F]+/u', ' ', $tekst) ?? '';
    return trim($bezSterujacych);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    przekieruj_303('/index.html#kontakt');
}

// Honeypot: boty wypełniają ukryte pole. Pozorny sukces bez wysyłki maila.
$botField = (string) ($_POST['bot-field'] ?? '');
if ($botField !== '') {
    przekieruj_303('/dziekuje.html');
}

$firma = oczysc_linie((string) ($_POST['firma'] ?? ''));
$email = oczysc_linie((string) ($_POST['email'] ?? ''));
$wiadomosc = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', (string) ($_POST['wiadomosc'] ?? '')) ?? '');

$bledy = [];
$dlFirma = mb_strlen($firma, 'UTF-8');
if ($dlFirma < LIMIT_FIRMA_MIN || $dlFirma > LIMIT_FIRMA_MAX) {
    $bledy[] = 'Imię lub nazwa firmy musi mieć od 2 do 120 znaków.';
}
if (mb_strlen($email, 'UTF-8') > LIMIT_EMAIL_MAX || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $bledy[] = 'Adres e-mail musi być prawidłowy i mieć najwyżej 254 znaki.';
}
$dlWiadomosc = mb_strlen($wiadomosc, 'UTF-8');
if ($dlWiadomosc < LIMIT_WIADOMOSC_MIN || $dlWiadomosc > LIMIT_WIADOMOSC_MAX) {
    $bledy[] = 'Wiadomość musi mieć od 20 do 3000 znaków.';
}

if ($bledy !== []) {
    pokaz_komunikat(
        422,
        'Popraw formularz',
        $bledy,
        'Wiadomość nie została wysłana. Sprawdź poniższe punkty i spróbuj ponownie.'
    );
}

// Wspólny temat i treść wiadomości — niezależne od wybranego transportu.
$temat = 'Nowe zapytanie ze strony — ' . mb_substr($firma, 0, 80, 'UTF-8');
$tresc = "Imię lub nazwa firmy:\n{$firma}\n\nE-mail do odpowiedzi:\n{$email}\n\nWiadomość:\n{$wiadomosc}\n";

// Domena serwera jako podstawa adresu nadawcy zapasowej wysyłki — poprawia
// zgodność z SPF (mail wychodzi z adresu w domenie, na której działa strona).
$domenaNadawcy = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$domenaNadawcy = (string) preg_replace('/:\d+$/', '', $domenaNadawcy);
$domenaNadawcy = (string) preg_replace('/^www\./', '', $domenaNadawcy);
if ($domenaNadawcy === '') {
    $domenaNadawcy = 'stronanalata.pl';
}

// Transport preferowany: uwierzytelniony SMTP przez PHPMailer. Wymaga pliku
// konfiguracyjnego spoza katalogu publicznego (poziom wyżej niż public_html)
// oraz biblioteki PHPMailer wgranej razem z nim.
$sciezkaKonfiguracji = dirname(__DIR__) . '/kontakt.config.php';
$konfiguracja = is_file($sciezkaKonfiguracji) ? require $sciezkaKonfiguracji : null;

$phpmailerGotowy = false;
if (is_array($konfiguracja)) {
    $katalogPhpmailer = rtrim((string) ($konfiguracja['phpmailer_dir'] ?? ''), '/\\');
    $phpmailerGotowy = $katalogPhpmailer !== '';
    foreach (['Exception.php', 'PHPMailer.php', 'SMTP.php'] as $plik) {
        if (!$phpmailerGotowy || !is_file($katalogPhpmailer . '/' . $plik)) {
            $phpmailerGotowy = false;
            break;
        }
        require_once $katalogPhpmailer . '/' . $plik;
    }
}

$wyslano = false;

if ($phpmailerGotowy) {
    $mailer = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mailer->isSMTP();
        $mailer->Host = (string) $konfiguracja['smtp_host'];
        $mailer->Port = (int) $konfiguracja['smtp_port'];
        $mailer->SMTPAuth = true;
        $mailer->Username = (string) $konfiguracja['smtp_user'];
        $mailer->Password = (string) $konfiguracja['smtp_pass'];
        $mailer->SMTPSecure = (string) ($konfiguracja['smtp_secure'] ?? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS);
        $mailer->CharSet = PHPMailer\PHPMailer\PHPMailer::CHARSET_UTF8;

        $nadawca = (string) ($konfiguracja['from_email'] ?? $konfiguracja['smtp_user']);
        $mailer->setFrom($nadawca, 'Formularz — stronanalata.pl');
        $mailer->addAddress(ODBIORCA);
        $mailer->addReplyTo($email, $firma);

        $mailer->Subject = $temat;
        $mailer->Body = $tresc;
        $mailer->isHTML(false);

        $mailer->send();
        $wyslano = true;
    } catch (Throwable $wyjatek) {
        // Bez logowania treści zgłoszenia i szczegółów SMTP — spróbujemy transportem zapasowym.
        $wyslano = false;
    }
}

// Transport zapasowy: funkcja mail() serwera. Działa bez konfiguracji SMTP,
// dzięki czemu formularz dostarcza zgłoszenia od razu po wgraniu na hosting.
if (!$wyslano) {
    $nadawcaZapasowy = 'formularz@' . $domenaNadawcy;
    $naglowki = implode("\r\n", [
        'From: Formularz strony <' . $nadawcaZapasowy . '>',
        'Reply-To: ' . $email,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: kontakt.php',
    ]);
    $tematZakodowany = '=?UTF-8?B?' . base64_encode($temat) . '?=';
    $wyslano = @mail(ODBIORCA, $tematZakodowany, $tresc, $naglowki, '-f' . $nadawcaZapasowy);
}

if (!$wyslano) {
    pokaz_komunikat(
        500,
        'Nie udało się wysłać wiadomości',
        [],
        'Spróbuj ponownie za chwilę albo napisz bezpośrednio na e-mail.'
    );
}

przekieruj_303('/dziekuje.html');
