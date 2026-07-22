import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');

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

const entryFiles = rows.filter((row) => row.file === 'index.html' || /assets\/index-[^/]+\.(css|js)$/.test(row.file));
const firstViewGzip = entryFiles.reduce((sum, row) => sum + row.gzip, 0);
const totalRaw = rows.reduce((sum, row) => sum + row.raw, 0);
const failures = [];

if (firstViewGzip > 50_000) failures.push(`Pierwszy widok gzip ${firstViewGzip} B przekracza 50 000 B.`);
if (totalRaw > 220_000) failures.push(`Cały build ${totalRaw} B przekracza 220 000 B.`);
if (entryFiles.length < 3) failures.push('Nie znaleziono kompletu HTML + CSS + JS dla pierwszego widoku.');

console.log('Budżet wydajności builda:');
for (const row of entryFiles) {
  console.log(`- ${row.file}: raw ${row.raw} B, gzip ${row.gzip} B, brotli ${row.brotli} B`);
}
console.log(`- pierwszy widok (HTML + CSS + JS, gzip): ${firstViewGzip} B / 50 000 B`);
console.log(`- cały dist (raw): ${totalRaw} B / 220 000 B`);

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Budżety wydajności: OK');
