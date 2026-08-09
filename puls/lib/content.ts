/**
 * Cała treść strony. Komponenty nie zawierają hardkodowanego copy —
 * podmiana tekstu odbywa się wyłącznie tutaj.
 */

export type NavLink = { label: string; href: string }
export type Cta = { label: string; href: string }

export type BentoCard = {
  id: string
  eyebrow: string
  title: string
  body: string
  span: 'wide' | 'half' | 'third'
  visual: 'grouping' | 'oncall' | 'replay' | 'baseline' | 'setup'
}

export type FeatureRow = {
  id: string
  eyebrow: string
  title: string
  body: string
  bullets: string[]
  visual: 'trace' | 'routing' | 'budget'
}

export type Metric = { value: number; suffix: string; decimals: number; label: string }

export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  initials: string
}

export type Plan = {
  id: string
  name: string
  pitch: string
  monthly: number | null
  yearly: number | null
  unit: string
  note: string
  cta: string
  featured: boolean
  features: string[]
}

export type FaqItem = { q: string; a: string }

export const site = {
  name: 'Puls',
  domain: 'puls.dev',
  description:
    'Puls składa błędy, metryki i logi w jedno zdarzenie i budzi jedną osobę — tę, która może je naprawić.',
} as const

export const nav = {
  links: [
    { label: 'Funkcje', href: '#funkcje' },
    { label: 'Jak działa', href: '#jak-dziala' },
    { label: 'Liczby', href: '#liczby' },
    { label: 'Cennik', href: '#cennik' },
    { label: 'FAQ', href: '#faq' },
  ] satisfies NavLink[],
  login: { label: 'Zaloguj się', href: '#logowanie' } satisfies Cta,
  cta: { label: 'Zacznij za darmo', href: '#rejestracja' } satisfies Cta,
} as const

export const hero = {
  badge: {
    label: 'Nowe: cisza nocna z regułami eskalacji',
    href: '#zmiany',
  },
  /** Trzy jawne wiersze — łamanie automatyczne zostawiało sieroty. */
  headline: {
    first: 'Awarię widzisz',
    secondLead: 'w',
    accent: '40 sekund,',
    third: 'nie w poniedziałek.',
  },
  sub: 'Puls składa błędy, metryki i logi w jedno zdarzenie, sprawdza kto dyżuruje i wysyła jedno powiadomienie — zamiast trzydziestu do kanału, który wszyscy wyciszyli.',
  primary: { label: 'Załóż darmowe konto', href: '#rejestracja' } satisfies Cta,
  secondary: { label: 'Zobacz demo produktu', href: '#demo' } satisfies Cta,
  reassurance: ['14 dni bez karty', 'Wdrożenie w 6 minut', 'Dane w UE'],
} as const

export const logoCloud = {
  eyebrow: 'Czuwa nad produkcją w',
  logos: [
    'Frachtio',
    'Nordkod',
    'Bielik Pay',
    'Atlas Retail',
    'Kolej.io',
    'Vertigo Labs',
    'Marina 24',
    'Sperto',
  ],
} as const

export const bento = {
  eyebrow: 'Funkcje',
  title: 'Mniej powiadomień, więcej naprawionych awarii',
  lead: 'Każda funkcja Pulsa skraca drogę od chwili, w której coś przestało działać, do chwili, w której ktoś to naprawia.',
  cards: [
    {
      id: 'grupowanie',
      eyebrow: 'Grupowanie',
      title: 'Jedno zdarzenie zamiast trzydziestu alertów',
      body: 'Puls porównuje odcisk stosu wywołań, wersję wydania i treść zapytania. Powtórzenia tego samego błędu trafiają do jednego zdarzenia z licznikiem wystąpień — dostajesz jedno powiadomienie, nie lawinę.',
      span: 'wide',
      visual: 'grouping',
    },
    {
      id: 'dyzur',
      eyebrow: 'Dyżury',
      title: 'Grafik, który wie, kto dziś odbiera',
      body: 'Rotacje tygodniowe, zastępstwa, urlopy i strefy czasowe. Jeśli pierwsza osoba nie potwierdzi w 8 minut, Puls dzwoni do następnej.',
      span: 'half',
      visual: 'oncall',
    },
    {
      id: 'sesja',
      eyebrow: 'Kontekst',
      title: 'Ostatnie 30 sekund sesji użytkownika',
      body: 'Kliknięcia, zapytania sieciowe i stan formularza sprzed błędu. Bez dopytywania klienta, co dokładnie zrobił.',
      span: 'third',
      visual: 'replay',
    },
    {
      id: 'progi',
      eyebrow: 'Progi',
      title: 'Progi liczone z Twojego ruchu',
      body: 'Puls uczy się dobowego rytmu aplikacji. Piątkowy szczyt sprzedaży przestaje być anomalią, a cisza o trzeciej w nocy zaczyna nią być.',
      span: 'third',
      visual: 'baseline',
    },
    {
      id: 'wdrozenie',
      eyebrow: 'Start',
      title: 'Jeden pakiet, sześć minut',
      body: 'Instalacja SDK, klucz projektu, mapy źródeł z Twojego CI. Pierwsze zdarzenie widzisz, zanim skończy się kawa.',
      span: 'third',
      visual: 'setup',
    },
  ] satisfies BentoCard[],
} as const

export const featureRows = {
  eyebrow: 'Jak to działa',
  title: 'Od zgłoszenia do przyczyny w trzech krokach',
  lead: 'Bez przeskakiwania między pięcioma zakładkami i bez zgadywania, która wersja poszła na produkcję.',
  rows: [
    {
      id: 'trace',
      eyebrow: 'Krok 1 — Przyczyna',
      title: 'Linia kodu, nie numer błędu',
      body: 'Puls rozwija zminifikowany stos wywołań przez mapy źródeł wgrane przy budowaniu i pokazuje właściwy plik, linię i commit. Obok — kto ostatnio dotykał tego fragmentu.',
      bullets: [
        'Mapy źródeł pobierane automatycznie z CI',
        'Powiązanie zdarzenia z wydaniem i commitem',
        'Zmienne lokalne z ramki, w której wybuchło',
      ],
      visual: 'trace',
    },
    {
      id: 'routing',
      eyebrow: 'Krok 2 — Adresat',
      title: 'Alert trafia do osoby, nie do kanału',
      body: 'Reguła kierowania patrzy na usługę, środowisko i wagę zdarzenia, a potem na grafik dyżurów. Kanał zespołu dostaje kopię do wiadomości, ale budzimy konkretną osobę.',
      bullets: [
        'Eskalacja po 8 minutach bez potwierdzenia',
        'Cisza nocna dla zdarzeń poniżej progu wagi',
        'Slack, SMS, telefon i webhook w jednej regule',
      ],
      visual: 'routing',
    },
    {
      id: 'budget',
      eyebrow: 'Krok 3 — Kontrola',
      title: 'Budżet błędów zamiast wykresów, których nikt nie czyta',
      body: 'Ustalasz, ile awarii miesięcznie mieści się w umowie. Puls pokazuje, ile z tego zostało — i sam wycisza alerty niskiej wagi, dopóki budżet jest bezpieczny.',
      bullets: [
        'Cel dostępności na usługę, nie na całą aplikację',
        'Raport tygodniowy w formacie, który idzie do zarządu',
        'Historia zmian progów z autorem i datą',
      ],
      visual: 'budget',
    },
  ] satisfies FeatureRow[],
} as const

export const metrics = {
  eyebrow: 'Liczby z produkcji',
  items: [
    { value: 41, suffix: ' s', decimals: 0, label: 'Mediana czasu do alertu' },
    { value: 92, suffix: '%', decimals: 0, label: 'Mniej powtórzonych powiadomień' },
    { value: 1240, suffix: '', decimals: 0, label: 'Zespołów na planie płatnym' },
    { value: 99.98, suffix: '%', decimals: 2, label: 'Dostępność przyjmowania zdarzeń' },
  ] satisfies Metric[],
  footnote:
    'Dane za okres 2026-01-01 – 2026-06-30, mierzone na wszystkich projektach produkcyjnych.',
} as const

export const testimonials = {
  eyebrow: 'Opinie',
  title: 'Zespoły, które przestały bać się piątkowego wdrożenia',
  items: [
    {
      quote:
        'Przed Pulsem kanał alertów miał 400 wiadomości dziennie i wszyscy go wyciszyli. Teraz mamy sześć zdarzeń tygodniowo i każde ktoś odbiera.',
      name: 'Marta Zielińska',
      role: 'Head of Engineering',
      company: 'Bielik Pay',
      initials: 'MZ',
    },
    {
      quote:
        'Podgląd sesji sprzed błędu skrócił nam obsługę zgłoszeń z dwóch dni do godziny. Nie musimy już pytać klienta, w co dokładnie kliknął.',
      name: 'Tomasz Wrona',
      role: 'Lider zespołu płatności',
      company: 'Frachtio',
      initials: 'TW',
    },
    {
      quote:
        'Wdrożenie zajęło jedno popołudnie razem z mapami źródeł w CI. Spodziewałem się tygodnia.',
      name: 'Kamil Doroszuk',
      role: 'Platform Engineer',
      company: 'Nordkod',
      initials: 'KD',
    },
    {
      quote:
        'Progi liczone z naszego ruchu to była ta jedna rzecz, której brakowało. Czarny piątek przestał generować fałszywe alarmy.',
      name: 'Aleksandra Bury',
      role: 'CTO',
      company: 'Atlas Retail',
      initials: 'AB',
    },
    {
      quote:
        'Raport z budżetu błędów po raz pierwszy dał się pokazać zarządowi bez tłumaczenia, co znaczy p99.',
      name: 'Grzegorz Lach',
      role: 'Dyrektor technologii',
      company: 'Kolej.io',
      initials: 'GL',
    },
  ] satisfies Testimonial[],
} as const

export const pricing = {
  eyebrow: 'Cennik',
  title: 'Płacisz za zdarzenia, nie za miejsca w panelu',
  lead: 'Każda osoba z zespołu ma dostęp do odczytu za darmo. Rozliczamy tylko przyjęte zdarzenia.',
  toggle: { monthly: 'Miesięcznie', yearly: 'Rocznie', hint: '2 miesiące gratis' },
  plans: [
    {
      id: 'start',
      name: 'Start',
      pitch: 'Dla jednego produktu i małego zespołu.',
      monthly: 0,
      yearly: 0,
      unit: 'zł / miesiąc',
      note: 'Bez karty płatniczej',
      cta: 'Zacznij za darmo',
      featured: false,
      features: [
        '50 tys. zdarzeń miesięcznie',
        '1 projekt, 3 osoby',
        'Powiadomienia e-mail i Slack',
        'Historia 7 dni',
      ],
    },
    {
      id: 'zespol',
      name: 'Zespół',
      pitch: 'Dla zespołów z dyżurem i produkcją pod SLA.',
      monthly: 89,
      yearly: 71,
      unit: 'zł / miesiąc',
      note: 'Rozliczenie za projekt',
      cta: 'Załóż konto zespołu',
      featured: true,
      features: [
        '2 mln zdarzeń miesięcznie',
        'Projekty i osoby bez limitu',
        'Grafik dyżurów i eskalacje',
        'SMS, telefon i webhooki',
        'Podgląd sesji sprzed błędu',
        'Historia 90 dni',
      ],
    },
    {
      id: 'firma',
      name: 'Firma',
      pitch: 'Dla organizacji z wymogami audytu i rezydencji danych.',
      monthly: null,
      yearly: null,
      unit: '',
      note: 'Umowa roczna, faktura',
      cta: 'Porozmawiaj z nami',
      featured: false,
      features: [
        'Zdarzenia bez limitu',
        'Instalacja we własnej chmurze',
        'SSO SAML i dziennik audytu',
        'SLA z czasem odpowiedzi 1 h',
        'Wsparcie wdrożeniowe',
      ],
    },
  ] satisfies Plan[],
} as const

export const faq = {
  eyebrow: 'FAQ',
  title: 'Pytania, które dostajemy najczęściej',
  items: [
    {
      q: 'Ile trwa wdrożenie na istniejącej aplikacji?',
      a: 'Instalacja pakietu i klucz projektu to około sześciu minut. Mapy źródeł wymagają jednego kroku w Twoim CI — mamy gotowe przepisy dla GitHub Actions, GitLab CI i Jenkinsa. Pierwsze zdarzenie zwykle widać przed końcem pierwszego wdrożenia.',
    },
    {
      q: 'Co się dzieje, gdy przekroczę limit zdarzeń?',
      a: 'Nic się nie wyłącza. Puls dalej przyjmuje zdarzenia, oznacza nadwyżkę w panelu i informuje o niej raz — nie przy każdym przekroczeniu. Nadwyżkę rozliczamy po 4 zł za każde 10 tys. zdarzeń albo przenosimy Cię na wyższy plan, jeśli tak wyjdzie taniej.',
    },
    {
      q: 'Gdzie trzymacie dane?',
      a: 'Domyślnie we Frankfurcie, w centrum danych na terenie Unii Europejskiej. Plan Firma pozwala wskazać własny region albo zainstalować Pulsa w Twojej chmurze. Treści zapytań można maskować po stronie SDK, zanim opuszczą Twój serwer.',
    },
    {
      q: 'Czy Puls zastępuje narzędzie do dyżurów?',
      a: 'Tak, jeśli Twoja potrzeba kończy się na grafiku, eskalacji i powiadomieniach głosowych — to jest w planie Zespół. Jeśli masz rozbudowany proces zarządzania incydentami, Puls wpina się w niego przez webhooki i dwustronną synchronizację statusu.',
    },
    {
      q: 'Jak wygląda obsługa języka polskiego?',
      a: 'Panel, powiadomienia, raporty i wsparcie są po polsku. Terminy techniczne zostawiamy w oryginale tam, gdzie tłumaczenie utrudniałoby szukanie w dokumentacji.',
    },
    {
      q: 'Można zrezygnować w trakcie okresu rozliczeniowego?',
      a: 'Tak. Plan miesięczny kończy się z końcem opłaconego miesiąca, bez okresu wypowiedzenia. Przy planie rocznym zwracamy niewykorzystaną część proporcjonalnie. Eksport wszystkich zdarzeń do JSON zostaje dostępny przez 30 dni po rezygnacji.',
    },
  ] satisfies FaqItem[],
} as const

export const ctaFinal = {
  eyebrow: 'Ostatnia rzecz',
  title: 'Następna awaria zdarzy się w nocy. Pytanie, czy się o niej dowiesz.',
  sub: 'Załóż projekt, wklej klucz i zobacz pierwsze zdarzenie jeszcze dziś. Bez karty i bez rozmowy z handlowcem.',
  cta: { label: 'Załóż darmowe konto', href: '#rejestracja' } satisfies Cta,
  note: 'Konfiguracja zajmuje 6 minut. Rezygnacja — jedno kliknięcie.',
} as const

export const footer = {
  tagline: 'Monitoring aplikacji, który budzi tylko wtedy, gdy naprawdę trzeba.',
  columns: [
    {
      title: 'Produkt',
      links: [
        { label: 'Funkcje', href: '#funkcje' },
        { label: 'Cennik', href: '#cennik' },
        { label: 'Zmiany w produkcie', href: '#zmiany' },
        { label: 'Status usługi', href: '#status' },
      ],
    },
    {
      title: 'Materiały',
      links: [
        { label: 'Dokumentacja', href: '#dokumentacja' },
        { label: 'Przepisy dla CI', href: '#ci' },
        { label: 'Przewodnik po dyżurach', href: '#dyzury' },
        { label: 'API', href: '#api' },
      ],
    },
    {
      title: 'Firma',
      links: [
        { label: 'O nas', href: '#o-nas' },
        { label: 'Praca', href: '#praca' },
        { label: 'Kontakt', href: '#kontakt' },
        { label: 'Blog inżynierski', href: '#blog' },
      ],
    },
    {
      title: 'Formalności',
      links: [
        { label: 'Regulamin', href: '#regulamin' },
        { label: 'Prywatność', href: '#prywatnosc' },
        { label: 'Powierzenie danych', href: '#dpa' },
        { label: 'Bezpieczeństwo', href: '#bezpieczenstwo' },
      ],
    },
  ],
  legal: '© 2026 Puls sp. z o.o. Wszystkie prawa zastrzeżone.',
} as const
