// Generuje bez-intro.html z index.html. Uruchom po każdej zmianie treści:
//   node scripts/build-variant.mjs
// Walidator w bramce sprawdza, czy o tym nie zapomniano.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { makeVariant } from "./variant.mjs";

const root = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(root, "index.html"), "utf8");
const { variant, applied, problems } = makeVariant(source);

if (problems.length) {
  console.error("Nie udało się wygenerować wariantu:\n- " + problems.join("\n- "));
  process.exit(1);
}

writeFileSync(resolve(root, "bez-intro.html"), variant);

console.log(`Wygenerowano bez-intro.html. Zastosowane reguły: ${applied.join(", ")}.`);
console.log(`Rozmiar: ${source.length} B → ${variant.length} B.`);
