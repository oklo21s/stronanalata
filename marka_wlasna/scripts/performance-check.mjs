import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const assetDir = join(dist, "assets");
const errors = [];

const files = readdirSync(assetDir).map((name) => join(assetDir, name));
const jsFile = files.find((file) => file.endsWith(".js"));
const cssFile = files.find((file) => file.endsWith(".css"));
const imageFiles = files.filter((file) => /\.(?:jpe?g|png|webp|avif|svg)$/i.test(file));
const heroFile = imageFiles.find((file) => basename(file).startsWith("hero-"));
const htmlFile = join(dist, "index.html");

if (!heroFile) {
  console.error("Brak pliku hero (assets/hero-*). Sprawdź katalog public/assets.");
  process.exit(1);
}

if (!jsFile || !cssFile) {
  console.error("Brak zbudowanego pliku JS lub CSS. Najpierw uruchom npm run build.");
  process.exit(1);
}

function sizes(file) {
  const content = readFileSync(file);
  return {
    raw: content.length,
    gzip: gzipSync(content, { level: 9 }).length,
    brotli: brotliCompressSync(content).length,
  };
}

function within(label, actual, limit) {
  if (actual > limit) errors.push(`${label}: ${actual} B przekracza budżet ${limit} B`);
}

const html = sizes(htmlFile);
const variantHtml = sizes(join(dist, "bez-intro.html"));
const css = sizes(cssFile);
const js = sizes(jsFile);
const hero = statSync(heroFile).size;
const allImages = imageFiles.reduce((sum, file) => sum + statSync(file).size, 0);
const initialTransfer = html.gzip + css.gzip + js.gzip + hero;

within("HTML raw", html.raw, 40 * 1024);
within("HTML gzip", html.gzip, 8 * 1024);
within("HTML bez-intro raw", variantHtml.raw, 40 * 1024);
within("HTML bez-intro gzip", variantHtml.gzip, 8 * 1024);
within("CSS raw", css.raw, 32 * 1024);
within("CSS gzip", css.gzip, 8 * 1024);
within("JavaScript raw", js.raw, 15 * 1024);
within("JavaScript gzip", js.gzip, 6 * 1024);
within("Obraz hero", hero, 250 * 1024);
within("Wstępny transfer", initialTransfer, 280 * 1024);
within("Wszystkie obrazy", allImages, 1050 * 1024);

for (const file of imageFiles) {
  within(`Obraz ${basename(file)}`, statSync(file).size, 320 * 1024);
}

// Obie wersje strony muszą trzymać ten sam reżim ładowania obrazów.
for (const page of ["index.html", "bez-intro.html"]) {
  const sourceHtml = readFileSync(join(root, page), "utf8");
  const lazyImages = [...sourceHtml.matchAll(/<img\b[^>]*loading="lazy"[^>]*>/g)].length;

  if (lazyImages !== 3) {
    errors.push(`${page}: oczekiwano 3 obrazów lazy-load, znaleziono ${lazyImages}`);
  }
  if (!/hero-odziez-koncept\.svg[\s\S]*fetchpriority="high"/.test(sourceHtml)) {
    errors.push(`${page}: hero nie ma fetchpriority=high`);
  }
  if (/<(?:script|link)\b[^>]*(?:src|href)="https?:\/\//i.test(sourceHtml)) {
    errors.push(`${page}: wykryto zewnętrzny skrypt lub arkusz blokujący renderowanie`);
  }
}

// Animacja wejścia nie może przechodzić przez właściwości wymuszające układ.
const styles = readFileSync(join(root, "src/styles.css"), "utf8");
const introKeyframes = [...styles.matchAll(/@keyframes\s+(rule-draw|wordmark-in|intro-fade-out|panel-up|panel-down|skip-out)\b([\s\S]*?)\n\}/g)];

if (introKeyframes.length !== 6) {
  errors.push(`Oczekiwano 6 klatek kluczowych animacji wejścia, znaleziono ${introKeyframes.length}`);
}

for (const [, name, body] of introKeyframes) {
  const layoutProperties = [...body.matchAll(/^\s{4}(width|height|top|left|right|bottom|margin|padding)\s*:/gm)]
    .map((match) => match[1]);
  if (layoutProperties.length) {
    errors.push(`@keyframes ${name} animuje właściwość układu: ${[...new Set(layoutProperties)].join(", ")}`);
  }
}

// Animacja musi kończyć się przed twardym limitem w JS, który usuwa nakładkę.
// Limit ustawiony za wcześnie ucina obraz, ustawiony za późno trzyma
// zablokowany scroll po zakończeniu animacji.
const playingBlocks = [...styles.matchAll(/\.intro-overlay\.is-playing[^{]*\{([\s\S]*?)\n\}/g)];
const animationEnds = [];

for (const [, body] of playingBlocks) {
  const shorthand = body.match(/animation:\s*([\s\S]*?);/)?.[1];
  if (!shorthand) continue;

  // cubic-bezier(...) zawiera przecinki, więc funkcje trzeba najpierw wyciąć —
  // inaczej podział listy animacji rozcina je w środku i gubi opóźnienie.
  for (const entry of shorthand.replace(/\([^)]*\)/g, "()").split(",")) {
    const times = [...entry.matchAll(/([\d.]+)s/g)].map((match) => Number(match[1]));
    if (!times.length) continue;
    // W skrócie `animation` pierwszy czas to długość, drugi to opóźnienie.
    animationEnds.push({ entry: entry.trim().split(/\s+/)[0], end: times[0] + (times[1] ?? 0) });
  }
}

if (!animationEnds.length) {
  errors.push("Nie znaleziono żadnej animacji wejścia w regułach .intro-overlay.is-playing");
} else {
  const appSource = readFileSync(join(root, "src/app.js"), "utf8");
  // Konkretnie limit sprzątający, nie krótszy timer pominięcia animacji.
  const hardLimit = Number(appSource.match(/cleanupTimer = window\.setTimeout\(cleanup,\s*(\d+)\)/)?.[1]);
  const last = animationEnds.reduce((slowest, item) => (item.end > slowest.end ? item : slowest));
  const lastEndMs = Math.round(last.end * 1000);

  if (!Number.isFinite(hardLimit)) {
    errors.push("Nie znaleziono twardego limitu animacji (setTimeout(cleanup, ...)) w src/app.js");
  } else if (hardLimit <= lastEndMs) {
    errors.push(`Twardy limit ${hardLimit} ms nie jest późniejszy niż koniec animacji „${last.entry}" (${lastEndMs} ms)`);
  } else if (hardLimit - lastEndMs > 250) {
    errors.push(`Martwy czas ${hardLimit - lastEndMs} ms między końcem animacji a usunięciem nakładki przekracza 250 ms`);
  }

  if (lastEndMs > 1_400) {
    errors.push(`Animacja wejścia trwa ${lastEndMs} ms, próg to 1400 ms`);
  }

  console.log(`Animacja wejścia: koniec ${lastEndMs} ms, twardy limit ${hardLimit} ms.`);
}

console.table([
  { zasób: "HTML", raw: html.raw, gzip: html.gzip, brotli: html.brotli },
  { zasób: "HTML bez-intro", raw: variantHtml.raw, gzip: variantHtml.gzip, brotli: variantHtml.brotli },
  { zasób: "CSS", raw: css.raw, gzip: css.gzip, brotli: css.brotli },
  { zasób: "JavaScript", raw: js.raw, gzip: js.gzip, brotli: js.brotli },
  { zasób: `Hero (${basename(heroFile)})`, raw: hero, gzip: "-", brotli: "-" },
]);
console.log(`Szacowany transfer pierwszego widoku: ${initialTransfer} B.`);
console.log(`Wszystkie obrazy: ${allImages} B; pozostałe 3 są ładowane leniwie.`);

if (errors.length) {
  console.error("Budżety wydajności przekroczone:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Budżety wydajności OK.");
