import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { Window } from "happy-dom";

import {
  easeOutCubic,
  formatStatValue,
  initFaq,
  initMobileMenu,
  initStatCounters,
} from "../src/app.js";

let activeWindow;

function installDom(html = "", { reducedMotion = true, url = "http://localhost/" } = {}) {
  activeWindow = new Window({ url });
  activeWindow.document.write(html);
  activeWindow.document.close();
  activeWindow.matchMedia = (query) => ({
    matches: reducedMotion && query === "(prefers-reduced-motion: reduce)",
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });

  // Celowo bez IntersectionObserver: te testy pilnują zachowania awaryjnego.
  activeWindow.IntersectionObserver = undefined;

  Object.assign(globalThis, {
    document: activeWindow.document,
    window: activeWindow,
    sessionStorage: activeWindow.sessionStorage,
    requestAnimationFrame: (callback) => activeWindow.setTimeout(callback, 0),
  });
}

function createGenerator(seed = 0x9e3779b9) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };
}

afterEach(() => {
  activeWindow?.close();
  activeWindow = undefined;
  delete globalThis.document;
  delete globalThis.window;
  delete globalThis.sessionStorage;
  delete globalThis.requestAnimationFrame;
});

test("50,000 deterministic easing samples stay inside the unit interval", () => {
  const random = createGenerator();

  for (let iteration = 0; iteration < 50_000; iteration += 1) {
    const signed = random() % 2 === 0 ? 1 : -1;
    const progress = (signed * random()) / 0x7fffffff;
    const eased = easeOutCubic(progress);

    assert.equal(Number.isFinite(eased), true);
    assert.equal(eased >= 0 && eased <= 1, true);
  }
});

test("easing is monotonic across the animated range", () => {
  let previous = easeOutCubic(0);

  for (let step = 1; step <= 1_000; step += 1) {
    const current = easeOutCubic(step / 1_000);
    assert.equal(Number.isFinite(current), true);
    assert.equal(current >= previous, true);
    previous = current;
  }

  assert.equal(previous, 1);
});

test("invalid and hostile values fail closed without throwing", () => {
  const invalidValues = [
    undefined,
    null,
    true,
    false,
    "1",
    "",
    {},
    [],
    () => 1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    BigInt(1),
    Symbol("progress"),
  ];

  for (const value of invalidValues) {
    assert.doesNotThrow(() => easeOutCubic(value));
    assert.equal(easeOutCubic(value), null);
    assert.doesNotThrow(() => formatStatValue(value, 0));
    assert.equal(formatStatValue(value, 0), null);
    assert.doesNotThrow(() => formatStatValue(10, value));
    assert.equal(formatStatValue(10, value), null);
  }
});

test("20,000 formatted values are always a string or a refusal", () => {
  const random = createGenerator(0x2545f491);

  for (let iteration = 0; iteration < 20_000; iteration += 1) {
    const value = ((random() % 2 === 0 ? 1 : -1) * random()) / 1_000;
    const decimals = random() % 5;
    const formatted = formatStatValue(value, decimals);

    if (decimals > 2) {
      assert.equal(formatted, null);
      continue;
    }

    assert.equal(typeof formatted, "string");
    assert.equal(formatted.includes("NaN"), false);
    assert.equal(formatted.includes("undefined"), false);
  }
});

test("2,000 mobile-menu state changes return to a clean closed state", () => {
  installDom(`
    <button class="menu-toggle" aria-expanded="false">
      <i class="menu-toggle__open" data-lucide="menu"></i>
      <i class="menu-toggle__close" data-lucide="x"></i>
    </button>
    <nav id="mobile-menu" hidden><a href="#content">Treść</a></nav>
    <main id="content"></main>
  `);

  initMobileMenu();
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");

  for (let iteration = 0; iteration < 2_000; iteration += 1) {
    toggle.click();
    const isOpen = iteration % 2 === 0;
    assert.equal(toggle.getAttribute("aria-expanded"), String(isOpen));
    assert.equal(menu.hidden, !isOpen);
    assert.equal(document.body.classList.contains("menu-open"), isOpen);
  }

  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(menu.hidden, true);
  assert.equal(document.body.classList.contains("menu-open"), false);
});

test("repeated FAQ toggling keeps no more than one item open", () => {
  installDom(`
    <div class="faq-list">
      <details><summary>A</summary><p>A</p></details>
      <details><summary>B</summary><p>B</p></details>
      <details><summary>C</summary><p>C</p></details>
      <details><summary>D</summary><p>D</p></details>
    </div>
  `);

  initFaq();
  const items = [...document.querySelectorAll("details")];

  for (let iteration = 0; iteration < 1_000; iteration += 1) {
    const current = items[iteration % items.length];
    current.open = true;
    current.dispatchEvent(new window.Event("toggle"));
    assert.equal(items.filter((item) => item.open).length, 1);
  }
});

// W wersji z animacją Escape pomijał nakładkę. Tutaj nie ma nakładki, więc
// Escape nie może przypadkiem trafić w żaden inny stan — poza zamknięciem menu.
test("1,000 Escape presses leave the page untouched and nothing in storage", async () => {
  installDom(`
    <button class="menu-toggle" aria-expanded="false"></button>
    <nav id="mobile-menu" hidden><a href="#content">Treść</a></nav>
    <main id="content"><p>Treść strony</p></main>
  `, { reducedMotion: false, url: "http://localhost/?intro=1" });

  const runtimeErrors = [];
  window.addEventListener("error", (event) => runtimeErrors.push(event.error ?? event.message));
  initMobileMenu();

  for (let iteration = 0; iteration < 1_000; iteration += 1) {
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  }

  await new Promise((resolvePromise) => window.setTimeout(resolvePromise, 50));

  assert.deepEqual(runtimeErrors, []);
  assert.equal(document.querySelector("#content").textContent, "Treść strony");
  assert.equal(document.body.className.includes("intro-active"), false);
  // ?intro=1 nie ma tu żadnego znaczenia i nie może nic zapisać.
  assert.equal(sessionStorage.length, 0);
});

test("the real document keeps every statistic readable without an observer", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  installDom(html, { reducedMotion: false });

  // No IntersectionObserver in this window: counters must leave the markup alone.
  assert.doesNotThrow(() => initStatCounters());

  const counters = [...document.querySelectorAll("[data-count-to]")];
  assert.equal(counters.length, 8);

  for (const counter of counters) {
    assert.equal(counter.textContent.trim().length > 0, true);
    assert.equal(counter.textContent.includes("NaN"), false);
  }
});
