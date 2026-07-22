import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const assetDir = join(dist, "assets");
const errors = [];

const pages = ["index.html", "wystawy.html", "wydarzenia.html", "kolekcje.html", "zwiedzanie.html", "kontakt.html"];

if (!existsSync(assetDir)) {
  console.error("Brak katalogu dist/assets. Najpierw uruchom npm run build.");
  process.exit(1);
}

const assetFiles = readdirSync(assetDir).map((name) => join(assetDir, name));
const jsFiles = assetFiles.filter((file) => file.endsWith(".js"));
const cssFiles = assetFiles.filter((file) => file.endsWith(".css"));
const imageFiles = assetFiles.filter((file) => /\.(?:jpe?g|png|webp|avif|svg)$/i.test(file));
const heroFile = imageFiles.find((file) => basename(file).startsWith("hero-"));

if (!jsFiles.length || !cssFiles.length) {
  console.error("Brak zbudowanego pliku JS lub CSS. Najpierw uruchom npm run build.");
  process.exit(1);
}
if (!heroFile) {
  console.error("Brak pliku hero (assets/hero-*). Sprawdź katalog public/assets.");
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

const jsRaw = jsFiles.reduce((sum, file) => sum + statSync(file).size, 0);
const cssRaw = cssFiles.reduce((sum, file) => sum + statSync(file).size, 0);
const jsGzip = gzipSync(Buffer.concat(jsFiles.map((file) => readFileSync(file))), { level: 9 }).length;
const cssGzip = gzipSync(Buffer.concat(cssFiles.map((file) => readFileSync(file))), { level: 9 }).length;
const hero = statSync(heroFile).size;
const allImages = imageFiles.reduce((sum, file) => sum + statSync(file).size, 0);

// Największa podstrona wyznacza budżet HTML.
let maxHtmlRaw = 0;
let maxHtmlGzip = 0;
for (const page of pages) {
  const distPage = join(dist, page);
  if (!existsSync(distPage)) {
    errors.push(`Brak zbudowanej podstrony: dist/${page}`);
    continue;
  }
  const s = sizes(distPage);
  maxHtmlRaw = Math.max(maxHtmlRaw, s.raw);
  maxHtmlGzip = Math.max(maxHtmlGzip, s.gzip);
}

const initialTransfer = maxHtmlGzip + cssGzip + jsGzip + hero;

within("HTML raw (max podstrona)", maxHtmlRaw, 48 * 1024);
within("HTML gzip (max podstrona)", maxHtmlGzip, 12 * 1024);
within("CSS raw", cssRaw, 40 * 1024);
within("CSS gzip", cssGzip, 9 * 1024);
within("JavaScript raw", jsRaw, 60 * 1024);
within("JavaScript gzip", jsGzip, 20 * 1024);
within("Obraz hero", hero, 120 * 1024);
within("Wstępny transfer", initialTransfer, 260 * 1024);
within("Wszystkie obrazy", allImages, 500 * 1024);

for (const file of imageFiles) {
  within(`Obraz ${basename(file)}`, statSync(file).size, 120 * 1024);
}

// Kontrole per-podstrona w źródle: brak zewnętrznych, blokujących zasobów.
for (const page of pages) {
  const sourceHtml = readFileSync(join(root, page), "utf8");
  if (/<(?:script|link)\b[^>]*(?:src|href)="https?:\/\//i.test(sourceHtml)) {
    errors.push(`${page}: wykryto zewnętrzny skrypt lub arkusz blokujący renderowanie`);
  }
}

// Strona główna: hero z priorytetem i co najmniej trzy obrazy ładowane leniwie.
const indexHtml = readFileSync(join(root, "index.html"), "utf8");
if (!/hero-muzeum-koncept\.svg[\s\S]*?fetchpriority="high"/.test(indexHtml)) {
  errors.push("index.html: hero nie ma fetchpriority=high");
}
const lazyImages = [...indexHtml.matchAll(/<img\b[^>]*loading="lazy"[^>]*>/g)].length;
if (lazyImages < 3) {
  errors.push(`index.html: oczekiwano co najmniej 3 obrazów lazy-load, znaleziono ${lazyImages}`);
}

// Brak animacji wejścia: żadnych @keyframes ani śladów nakładki intro.
const styles = readFileSync(join(root, "src/styles.css"), "utf8");
if (/@keyframes/.test(styles)) {
  errors.push("src/styles.css: pojawiła się reguła @keyframes — strona nie powinna nic animować samoczynnie");
}
for (const { where, source } of [
  { where: "index.html", source: indexHtml },
  { where: "src/styles.css", source: styles },
  { where: "src/app.js", source: readFileSync(join(root, "src/app.js"), "utf8") },
]) {
  if (/data-intro|intro-overlay|intro-active|initIntro/.test(source)) {
    errors.push(`${where}: został ślad po animacji wejścia`);
  }
}

console.log("Brak animacji wejścia potwierdzony (brak @keyframes i nakładki intro).");
console.table([
  { zasób: "HTML (max)", raw: maxHtmlRaw, gzip: maxHtmlGzip },
  { zasób: "CSS", raw: cssRaw, gzip: cssGzip },
  { zasób: "JavaScript", raw: jsRaw, gzip: jsGzip },
  { zasób: `Hero (${basename(heroFile)})`, raw: hero, gzip: "-" },
]);
console.log(`Szacowany transfer pierwszego widoku: ${initialTransfer} B.`);
console.log(`Wszystkie obrazy: ${allImages} B; ${lazyImages} obrazów na stronie głównej ładowanych leniwie.`);

if (errors.length) {
  console.error("Budżety wydajności przekroczone:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Budżety wydajności OK.");
