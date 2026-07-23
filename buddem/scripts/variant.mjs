// Jedno źródło prawdy o różnicach między wersją z animacją a wersją bez niej.
// Korzysta z tego generator (build-variant.mjs) i walidator, który dzięki temu
// wykrywa, że ktoś zmienił index.html i zapomniał przegenerować wariant.

const rules = [
  {
    label: "usunięcie nakładki animacji",
    pattern: /\n    <div class="intro-overlay"[\s\S]*?\n    <\/div>\n/,
    replacement: "\n",
  },
  {
    label: "tytuł",
    pattern: /<title>[^<]*<\/title>/,
    replacement: "<title>BudDem bez animacji — projekt demonstracyjny strony firmy budowlanej</title>",
  },
  {
    label: "opis meta",
    pattern: /content="BudDem — projekt demonstracyjny strony generalnego wykonawcy\. Marka fikcyjna, wszystkie dane na stronie są przykładowe\."/,
    replacement: 'content="BudDem bez animacji wejścia — projekt demonstracyjny strony generalnego wykonawcy. Marka fikcyjna, wszystkie dane na stronie są przykładowe."',
  },
  {
    label: "og:title",
    pattern: /<meta property="og:title" content="[^"]*" \/>/,
    replacement: '<meta property="og:title" content="BudDem bez animacji — projekt demonstracyjny strony firmy budowlanej" />',
  },
  {
    label: "przełącznik wersji",
    // Ścieżki są absolutne (/buddem/...), bo strona bywa otwierana pod adresem
    // bez końcowego ukośnika (stronanalata.pl/buddem) — wtedy linki względne
    // rozwiązywałyby się do katalogu głównego domeny.
    pattern: /<a class="status-bar__switch" href="\/buddem\/bez-intro\.html">Zobacz wersję bez animacji wejścia<\/a>/,
    replacement: '<a class="status-bar__switch" href="/buddem/">Zobacz wersję z animacją wejścia</a>',
  },
];

export function makeVariant(source) {
  const problems = [];
  const applied = [];
  let variant = source;

  for (const rule of rules) {
    const found = [...variant.matchAll(new RegExp(rule.pattern, "g"))].length;
    if (found !== 1) {
      problems.push(`reguła „${rule.label}": oczekiwano 1 dopasowania, znaleziono ${found}`);
      continue;
    }
    variant = variant.replace(rule.pattern, rule.replacement);
    applied.push(rule.label);
  }

  if (variant.includes("data-intro")) {
    problems.push("w wariancie został ślad po animacji (data-intro)");
  }

  return { variant, applied, problems };
}
