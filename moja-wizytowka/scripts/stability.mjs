import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { Window } from 'happy-dom';
import { initNavigation } from '../src/app.js';

const root = process.cwd();
const viteCli = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else files.push(file);
  }
  return files;
}

async function hashes() {
  const files = await walk(path.join(root, 'dist'));
  const result = new Map();
  for (const file of files) {
    const relative = path.relative(path.join(root, 'dist'), file).replaceAll('\\', '/');
    result.set(relative, createHash('sha256').update(await readFile(file)).digest('hex'));
  }
  return result;
}

function build() {
  const result = spawnSync(process.execPath, [viteCli, 'build'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(result.stdout ?? '');
    console.error(result.stderr ?? result.error?.message ?? 'Nieznany błąd procesu builda.');
    process.exit(result.status ?? 1);
  }
}

build();
const first = await hashes();
build();
const second = await hashes();

const deterministic = first.size === second.size && [...first].every(([file, hash]) => second.get(file) === hash);
if (!deterministic) {
  console.error('Dwa kolejne buildy nie są identyczne.');
  process.exit(1);
}

const window = new Window({ url: 'https://moja-wizytowka.local/' });
window.document.body.innerHTML = '<button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav"><a href="#kontakt">Kontakt</a></nav>';
initNavigation(window.document);
const button = window.document.querySelector('.menu-toggle');

for (let index = 0; index < 20_000; index += 1) button.click();

const cleanState = button.getAttribute('aria-expanded') === 'false' && !window.document.querySelector('#site-nav').classList.contains('is-open');
if (!cleanState) {
  console.error('Menu nie wróciło do czystego stanu po 20 000 interakcji.');
  process.exit(1);
}

console.log(`Determinizm builda: OK (${first.size} identycznych plików SHA-256)`);
console.log('Stabilność menu: OK (20 000 przełączeń, stan końcowy zamknięty)');
