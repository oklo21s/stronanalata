#!/usr/bin/env node
/*
  Kontrola przed buildem. Sprawdza rzeczy, których nie złapie ani linter,
  ani przeglądarka - a które w tym projekcie są ustaleniami, nie preferencją.

  Kod wyjścia 1 przy pierwszym naruszeniu.
*/
import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const KORZEN = fileURLToPath(new URL('..', import.meta.url))
const ROZSZERZENIA = new Set(['.js', '.jsx', '.css', '.html', '.md'])
const POMIN = new Set(['node_modules', 'dist', '.git', '.vite'])

const REGULY = [
  {
    // Wzorzec budowany z kodow znakow, zeby sam plik kontroli go nie wyzwalal.
    nazwa: 'dlugi mysnik (U+2014 / U+2013)',
    wzorzec: new RegExp('[\\u2014\\u2013]'),
    powod: 'Ustalenie typograficzne projektu: jedyny dozwolony dywiz to "-".',
  },
  {
    nazwa: 'h-screen zamiast 100dvh',
    wzorzec: /\bh-screen\b/,
    powod: 'Na iOS pasek adresu zmienia 100vh w trakcie scrolla, układ skacze.',
    tylkoKod: true,
  },
  {
    nazwa: 'nasłuch zdarzenia scroll',
    wzorzec: /addEventListener\(\s*['"]scroll['"]/,
    powod: 'Postęp scrolla prowadzi ScrollTrigger, widoczność IntersectionObserver.',
    tylkoKod: true,
  },
]

// Reguly `tylkoKod` opisuja sposob pisania kodu, wiec nie moga wybuchac na
// dokumentacji, ktora te zakazy po prostu cytuje.
const KOD = new Set(['.js', '.jsx', '.css', '.html'])

async function zbierzPliki(katalog) {
  const wpisy = await readdir(katalog, { withFileTypes: true })
  const wynik = []
  for (const wpis of wpisy) {
    if (POMIN.has(wpis.name)) continue
    const sciezka = join(katalog, wpis.name)
    if (wpis.isDirectory()) {
      wynik.push(...(await zbierzPliki(sciezka)))
    } else if (ROZSZERZENIA.has(extname(wpis.name))) {
      wynik.push(sciezka)
    }
  }
  return wynik
}

const pliki = await zbierzPliki(KORZEN)
const naruszenia = []

for (const plik of pliki) {
  const kod = KOD.has(extname(plik))
  const linie = readFileSync(plik, 'utf8').split(/\r?\n/)
  linie.forEach((linia, indeks) => {
    for (const regula of REGULY) {
      if (regula.tylkoKod && !kod) continue
      if (regula.wzorzec.test(linia)) {
        naruszenia.push({
          plik: plik.replace(KORZEN, ''),
          linia: indeks + 1,
          regula: regula.nazwa,
          powod: regula.powod,
          tresc: linia.trim().slice(0, 110),
        })
      }
    }
  })
}

if (naruszenia.length > 0) {
  console.error(`Kontrola: ${naruszenia.length} naruszen.\n`)
  for (const n of naruszenia) {
    console.error(`  ${n.plik}:${n.linia}  [${n.regula}]`)
    console.error(`    ${n.tresc}`)
    console.error(`    ${n.powod}\n`)
  }
  process.exit(1)
}

console.log(`Kontrola: ${pliki.length} plikow, 0 naruszen.`)
