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
    replacement: "<title>Krojnia bez animacji — projekt demonstracyjny strony własnej marki odzieży</title>",
  },
  {
    label: "opis meta",
    pattern: /content="Krojnia — projekt demonstracyjny strony własnej marki odzieży\. Marka fikcyjna, wszystkie dane na stronie są przykładowe\."/,
    replacement: 'content="Krojnia bez animacji wejścia — projekt demonstracyjny strony własnej marki odzieży. Marka fikcyjna, wszystkie dane na stronie są przykładowe."',
  },
  {
    label: "og:title",
    pattern: /<meta property="og:title" content="[^"]*" \/>/,
    replacement: '<meta property="og:title" content="Krojnia bez animacji — projekt demonstracyjny strony własnej marki odzieży" />',
  },
  {
    label: "przełącznik wersji",
    pattern: /<a class="status-bar__switch" href="\.\/bez-intro\.html">Zobacz wersję bez animacji wejścia<\/a>/,
    replacement: '<a class="status-bar__switch" href="./index.html">Zobacz wersję z animacją wejścia</a>',
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
