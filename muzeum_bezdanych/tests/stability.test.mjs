import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { Window } from "happy-dom";

import { applyMenuFilter, initFaq, initMenuFilter, initMobileMenu } from "../src/app.js";

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

  Object.assign(globalThis, {
    document: activeWindow.document,
    window: activeWindow,
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
});

test("30,000 deterministic filter switches stay internally consistent", () => {
  installDom(`
    <div data-course="przystawki"></div>
    <div data-course="glowne"></div>
    <div data-course="desery"></div>
  `);
  const groups = [...document.querySelectorAll("[data-course]")];
  const filters = ["wszystko", "przystawki", "glowne", "desery", "nieistniejaca"];
  const random = createGenerator();

  for (let iteration = 0; iteration < 30_000; iteration += 1) {
    const filter = filters[random() % filters.length];
    const visible = applyMenuFilter(groups, filter);
    const shown = groups.filter((group) => !group.classList.contains("is-filtered-out")).length;

    assert.equal(Number.isFinite(visible), true);
    assert.equal(visible, shown);
    if (filter === "wszystko") assert.equal(visible, groups.length);
    if (filter === "nieistniejaca") assert.equal(visible, 0);
  }
});

test("2,000 mobile-menu state changes return to a clean closed state", () => {
  installDom(`
    <button class="menu-toggle" aria-expanded="false">
      <span class="menu-toggle__open"><i data-lucide="menu"></i></span>
      <span class="menu-toggle__close"><i data-lucide="x"></i></span>
    </button>
    <nav id="menu-mobilne" hidden><a href="./index.html">Start</a></nav>
    <main id="tresc"></main>
  `);

  initMobileMenu();
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-mobilne");

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
      <details><summary>A</summary></details>
      <details><summary>B</summary></details>
      <details><summary>C</summary></details>
      <details><summary>D</summary></details>
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

test("2,000 filter-button clicks keep exactly one button pressed", () => {
  installDom(`
    <div data-menu-filter>
      <button data-filter="wszystko" aria-pressed="true" class="is-active">Wszystko</button>
      <button data-filter="przystawki" aria-pressed="false">Przystawki</button>
      <button data-filter="glowne" aria-pressed="false">Dania główne</button>
      <button data-filter="desery" aria-pressed="false">Desery</button>
    </div>
    <div data-course="przystawki"></div>
    <div data-course="glowne"></div>
    <div data-course="desery"></div>
  `);

  initMenuFilter();
  const buttons = [...document.querySelectorAll("[data-filter]")];

  for (let iteration = 0; iteration < 2_000; iteration += 1) {
    buttons[iteration % buttons.length].click();
    const pressed = buttons.filter((button) => button.getAttribute("aria-pressed") === "true").length;
    assert.equal(pressed, 1);
  }
});

test("1,000 Escape presses leave the page untouched and nothing in storage", async () => {
  installDom(`
    <button class="menu-toggle" aria-expanded="false"></button>
    <nav id="menu-mobilne" hidden><a href="./index.html">Start</a></nav>
    <main id="tresc"><p>Treść strony</p></main>
  `, { reducedMotion: false });

  const runtimeErrors = [];
  window.addEventListener("error", (event) => runtimeErrors.push(event.error ?? event.message));
  initMobileMenu();

  for (let iteration = 0; iteration < 1_000; iteration += 1) {
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  }

  await new Promise((resolvePromise) => window.setTimeout(resolvePromise, 50));

  assert.deepEqual(runtimeErrors, []);
  assert.equal(document.querySelector("#tresc").textContent, "Treść strony");
  assert.equal(document.body.classList.contains("menu-open"), false);
  assert.equal(activeWindow.sessionStorage.length, 0);
});
