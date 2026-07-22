import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Window } from "happy-dom";

import { bootstrap, easeOutCubic, formatStatValue } from "../src/app.js";

if (typeof global.gc !== "function") {
  console.error("Test pamięci wymaga uruchomienia Node z --expose-gc.");
  process.exit(1);
}

const sourceHtml = readFileSync(resolve(import.meta.dirname, "../index.html"), "utf8");
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

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

windowInstance.IntersectionObserver = MockIntersectionObserver;
Object.assign(globalThis, {
  document: windowInstance.document,
  window: windowInstance,
  sessionStorage: windowInstance.sessionStorage,
  IntersectionObserver: MockIntersectionObserver,
  requestAnimationFrame: (callback) => callback(0),
});

bootstrap();
global.gc();
const baseline = process.memoryUsage().heapUsed;

const counters = [...document.querySelectorAll("[data-count-to]")];
const finalTexts = counters.map((counter) => counter.textContent);
const toggle = document.querySelector(".menu-toggle");
const faqItems = [...document.querySelectorAll(".faq-list details")];
const counterFrames = 50_000;
const menuInteractions = 20_000;
const faqInteractions = 20_000;

// Jedna iteracja odpowiada jednej klatce animacji licznika: policz postęp,
// sformatuj wartość i zapisz ją do dokumentu.
for (let iteration = 0; iteration < counterFrames; iteration += 1) {
  const index = iteration % counters.length;
  const counter = counters[index];
  const target = Number(counter.dataset.countTo);
  const decimals = Number(counter.dataset.countDecimals ?? "0");
  const progress = easeOutCubic((iteration % 900) / 900);

  counter.textContent = formatStatValue(target * progress, decimals) ?? finalTexts[index];
  if (iteration % 2_000 === 0) global.gc();
}

counters.forEach((counter, index) => {
  counter.textContent = finalTexts[index];
});

global.gc();
const afterCounters = process.memoryUsage().heapUsed;

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
const finalHeap = process.memoryUsage().heapUsed;
const growth = finalHeap - baseline;
const limit = 12 * 1024 * 1024;

console.table([{
  interakcje: counterFrames + menuInteractions + faqInteractions,
  liczniki: counterFrames,
  menu: menuInteractions,
  faq: faqInteractions,
  start_heap_B: baseline,
  po_licznikach_B: afterCounters,
  po_menu_B: afterMenu,
  koniec_heap_B: finalHeap,
  wzrost_B: growth,
  limit_B: limit,
}]);

const countersRestored = counters.every((counter) => {
  const target = Number(counter.dataset.countTo);
  const decimals = Number(counter.dataset.countDecimals ?? "0");
  return formatStatValue(target, decimals) === counter.textContent;
});

const stateIsClean = toggle.getAttribute("aria-expanded") === "false"
  && !document.body.classList.contains("menu-open")
  && countersRestored;

windowInstance.close();
delete globalThis.document;
delete globalThis.window;
delete globalThis.sessionStorage;
delete globalThis.IntersectionObserver;
delete globalThis.requestAnimationFrame;

if (!Number.isFinite(growth) || growth > limit) {
  console.error(`Test pamięci nieudany: wzrost sterty ${growth} B przekracza ${limit} B.`);
  process.exit(1);
}
if (!stateIsClean) {
  console.error("Test pamięci nieudany: interfejs nie wrócił do spójnego stanu.");
  process.exit(1);
}

console.log("Test pamięci OK: 90 000 interakcji nie powoduje nieograniczonego wzrostu sterty.");
