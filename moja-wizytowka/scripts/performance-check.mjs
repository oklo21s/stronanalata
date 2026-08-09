import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');

// Budżety. Pierwszy widok liczymy osobno dla każdej indeksowanej strony, bo to
// jest liczba, którą odczuwa użytkownik. Budżet całego builda jest wtórny —
// pilnuje tylko, żeby do repo nie wjechał przypadkiem ciężki zasób.
const FIRST_VIEW_GZIP_LIMIT = 50_000;
const TOTAL_RAW_LIMIT = 280_000;

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const files = await walk(dist);
const rows = [];

for (const file of files) {
  const buffer = await readFile(file);
  rows.push({
    file: path.relative(dist, file).replaceAll('\\', '/'),
    raw: (await stat(file)).size,
    gzip: gzipSync(buffer).length,
    brotli: brotliCompressSync(buffer).length,
  });
}

const failures = [];
const byName = (name) => rows.find((row) => row.file === name);

// Wspólny arkusz i skrypt są jedne dla całej strony — wchodzą do każdego
// pierwszego widoku, bo przy pierwszej wizycie nie ma ich jeszcze w cache.
const sharedAssets = rows.filter((row) => /^assets\/[^/]+\.(css|js)$/.test(row.file));
const sharedGzip = sharedAssets.reduce((sum, row) => sum + row.gzip, 0);

// Strony indeksowane: te, których HTML jest wejściem builda Vite.
const pages = ['index.html', 'oferta/index.html', 'realizacje/index.html'];

console.log('Budżet wydajności builda:');

if (sharedAssets.length < 2) {
  failures.push('Nie znaleziono wspólnego arkusza stylów i skryptu w assets/.');
} else {
  for (const asset of sharedAssets) {
    console.log(`- wspólne ${asset.file}: raw ${asset.raw} B, gzip ${asset.gzip} B, brotli ${asset.brotli} B`);
  }
}

for (const name of pages) {
  const page = byName(name);
  if (!page) {
    failures.push(`Build nie zawiera strony ${name}.`);
    continue;
  }
  const firstView = page.gzip + sharedGzip;
  console.log(`- ${name}: raw ${page.raw} B, gzip ${page.gzip} B → pierwszy widok ${firstView} B / ${FIRST_VIEW_GZIP_LIMIT} B`);
  if (firstView > FIRST_VIEW_GZIP_LIMIT) {
    failures.push(`Pierwszy widok ${name} (${firstView} B gzip) przekracza ${FIRST_VIEW_GZIP_LIMIT} B.`);
  }
}

const totalRaw = rows.reduce((sum, row) => sum + row.raw, 0);
console.log(`- cały dist (raw): ${totalRaw} B / ${TOTAL_RAW_LIMIT} B`);
if (totalRaw > TOTAL_RAW_LIMIT) failures.push(`Cały build ${totalRaw} B przekracza ${TOTAL_RAW_LIMIT} B.`);

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Budżety wydajności: OK');
