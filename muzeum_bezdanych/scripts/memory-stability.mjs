import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Window } from "happy-dom";

import { applyMenuFilter, bootstrap } from "../src/app.js";

if (typeof global.gc !== "function") {
  console.error("Test pamięci wymaga uruchomienia Node z --expose-gc.");
  process.exit(1);
}

// Strona z pełnym zestawem interaktywnych elementów (menu, akordeon FAQ) — na
// niej obciążamy pamięć. Na muzealnej stronie głównej nie ma FAQ, dlatego
// bierzemy podstronę „Zwiedzanie”, gdzie akordeon faktycznie występuje.
const sourceHtml = readFileSync(resolve(import.meta.dirname, "../zwiedzanie.html"), "utf8");
const html = sourceHtml.replace(/<script\b[\s\S]*?<\/script>/gi, "");
const windowInstance = new Window({ url: "http://localhost/" });
windowInstance.document.write(html);
windowInstance.document.close();
windowInstance.matchMedia = (query) => ({
  matches: query === "(prefers-reduced-motion: reduce)",
  media: query,
  addEventListener() {},
  removeEventListener() {},
});

Object.assign(globalThis, {
  document: windowInstance.document,
  window: windowInstance,
});

bootstrap();
global.gc();
const baseline = process.memoryUsage().heapUsed;

const toggle = document.querySelector(".menu-toggle");
const faqItems = [...document.querySelectorAll(".faq-list details")];
const menuInteractions = 40_000;
const faqInteractions = 40_000;
const filterInteractions = 20_000;

// Syntetyczne grupy kalendarza — funkcja filtra działa na dowolnym zbiorze,
// więc możemy ją obciążyć bez ładowania wydarzenia.html.
const courses = ["przystawki", "glowne", "desery"];
const filterGroups = courses.map((course) => {
  const element = document.createElement("div");
  element.dataset.course = course;
  return element;
});
const filterOptions = ["wszystko", ...courses];

for (let iteration = 0; iteration < menuInteractions; iteration += 1) {
  toggle.click();
  if (iteration % 1_000 === 0) global.gc();
}
global.gc();
const afterMenu = process.memoryUsage().heapUsed;

for (let iteration = 0; iteration < faqInteractions; iteration += 1) {
  const item = faqItems[iteration % faqItems.length];
  item.open = true;
  item.dispatchEvent(new window.Event("toggle"));
  if (iteration % 2_000 === 0) global.gc();
}
global.gc();
const afterFaq = process.memoryUsage().heapUsed;

let filterMismatch = false;
for (let iteration = 0; iteration < filterInteractions; iteration += 1) {
  const filter = filterOptions[iteration % filterOptions.length];
  const visible = applyMenuFilter(filterGroups, filter);
  const expected = filter === "wszystko" ? filterGroups.length : 1;
  if (visible !== expected) filterMismatch = true;
  if (iteration % 2_000 === 0) global.gc();
}

global.gc();
const finalHeap = process.memoryUsage().heapUsed;
const growth = finalHeap - baseline;
const limit = 12 * 1024 * 1024;

console.table([{
  interakcje: menuInteractions + faqInteractions + filterInteractions,
  menu: menuInteractions,
  faq: faqInteractions,
  filtr: filterInteractions,
  start_heap_B: baseline,
  po_menu_B: afterMenu,
  po_faq_B: afterFaq,
  koniec_heap_B: finalHeap,
  wzrost_B: growth,
  limit_B: limit,
}]);

const openFaq = faqItems.filter((item) => item.open).length;
const stateIsClean = toggle.getAttribute("aria-expanded") === "false"
  && !document.body.classList.contains("menu-open")
  && openFaq <= 1
  && !filterMismatch;

windowInstance.close();
delete globalThis.document;
delete globalThis.window;

if (!Number.isFinite(growth) || growth > limit) {
  console.error(`Test pamięci nieudany: wzrost sterty ${growth} B przekracza ${limit} B.`);
  process.exit(1);
}
if (!stateIsClean) {
  console.error("Test pamięci nieudany: interfejs nie wrócił do spójnego stanu.");
  process.exit(1);
}

console.log("Test pamięci OK: 100 000 interakcji nie powoduje nieograniczonego wzrostu sterty.");
