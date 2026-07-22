<?php
/**
 * PRZYKŁADOWA konfiguracja SMTP formularza kontaktowego.
 *
 * NIE wpisuj tu prawdziwych danych i NIE commituj pliku z sekretami.
 *
 * Wdrożenie na Hostingerze:
 *  1. Skopiuj ten plik jako `kontakt.config.php` i umieść go POZA katalogiem
 *     publicznym — jeden poziom nad `public_html`, np.:
 *       /home/UZYTKOWNIK/domains/stronanalata.pl/kontakt.config.php
 *     (kontakt.php szuka pliku dokładnie poziom wyżej niż własny katalog).
 *  2. Wgraj PHPMailer (pliki Exception.php, PHPMailer.php, SMTP.php z katalogu
 *     `src` oficjalnego wydania https://github.com/PHPMailer/PHPMailer) również
 *     poza `public_html`, np.:
 *       /home/UZYTKOWNIK/domains/stronanalata.pl/phpmailer/
 *  3. Uzupełnij poniższe wartości danymi skrzynki z hPanelu
 *     (E-maile → Konta e-mail → Konfiguracja ręczna).
 *  4. Nadaj plikowi możliwie wąskie uprawnienia (np. 600).
 */

return [
    // SMTP Hostingera — typowo smtp.hostinger.com, port 465 (SSL).
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,
    // 'ssl' dla portu 465, 'tls' dla portu 587.
    'smtp_secure' => 'ssl',

    // Pełny adres skrzynki założonej w hPanelu, np. kontakt@stronanalata.pl.
    'smtp_user' => 'kontakt@twoja-domena.pl',
    'smtp_pass' => 'TUTAJ-HASLO-SKRZYNKI',

    // Adres nadawcy widoczny w mailu — musi należeć do własnej domeny,
    // inaczej SPF/DKIM nie przejdą i mail wyląduje w spamie.
    'from_email' => 'kontakt@twoja-domena.pl',

    // Katalog z plikami PHPMailer (Exception.php, PHPMailer.php, SMTP.php).
    'phpmailer_dir' => __DIR__ . '/phpmailer',
];
