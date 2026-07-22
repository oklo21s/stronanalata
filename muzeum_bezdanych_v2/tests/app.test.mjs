import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { Window } from "happy-dom";

import {
  applyMenuFilter,
  bootstrap,
  initFaq,
  initMenuFilter,
  initMobileMenu,
  setCurrentYear,
} from "../src/app.js";

const pages = ["index.html", "wystawy.html", "wydarzenia.html", "kolekcje.html", "zwiedzanie.html", "kontakt.html"];

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

afterEach(() => {
  activeWindow?.close();
  activeWindow = undefined;
  delete globalThis.document;
  delete globalThis.window;
});

test("applyMenuFilter shows only the matching course, or everything for wszystko", () => {
  installDom(`
    <div data-course="przystawki"></div>
    <div data-course="glowne"></div>
    <div data-course="desery"></div>
  `);
  const groups = [...document.querySelectorAll("[data-course]")];

  assert.equal(applyMenuFilter(groups, "wszystko"), 3);
  assert.equal(groups.every((group) => !group.classList.contains("is-filtered-out")), true);

  assert.equal(applyMenuFilter(groups, "glowne"), 1);
  assert.equal(document.querySelector('[data-course="glowne"]').classList.contains("is-filtered-out"), false);
  assert.equal(document.querySelector('[data-course="przystawki"]').classList.contains("is-filtered-out"), true);
});

test("initMenuFilter wires buttons to aria-pressed and group visibility", () => {
  installDom(`
    <div data-menu-filter>
      <button data-filter="wszystko" aria-pressed="true" class="is-active">Wszystko</button>
      <button data-filter="desery" aria-pressed="false">Desery</button>
    </div>
    <div data-course="przystawki"></div>
    <div data-course="desery"></div>
  `);

  initMenuFilter();
  document.querySelector('[data-filter="desery"]').click();

  assert.equal(document.querySelector('[data-filter="desery"]').getAttribute("aria-pressed"), "true");
  assert.equal(document.querySelector('[data-filter="wszystko"]').getAttribute("aria-pressed"), "false");
  assert.equal(document.querySelector('[data-course="przystawki"]').classList.contains("is-filtered-out"), true);
  assert.equal(document.querySelector('[data-course="desery"]').classList.contains("is-filtered-out"), false);
});

test("initMenuFilter is a no-op when there is no filter panel", () => {
  installDom("<main><p>Bez filtra</p></main>");
  assert.doesNotThrow(() => initMenuFilter());
});

test("mobile menu opens and closes and cleans up body state", () => {
  installDom(`
    <button class="menu-toggle" aria-expanded="false"></button>
    <nav id="menu-mobilne" hidden><a href="./index.html">Start</a></nav>
    <main id="tresc"></main>
  `);

  initMobileMenu();
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-mobilne");

  toggle.click();
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.equal(menu.hidden, false);
  assert.equal(document.body.classList.contains("menu-open"), true);

  toggle.click();
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(menu.hidden, true);
  assert.equal(document.body.classList.contains("menu-open"), false);
});

test("FAQ keeps at most one item open at a time", () => {
  installDom(`
    <div class="faq-list">
      <details open><summary>A</summary></details>
      <details><summary>B</summary></details>
    </div>
  `);

  initFaq();
  const [a, b] = [...document.querySelectorAll("details")];
  b.open = true;
  b.dispatchEvent(new window.Event("toggle"));

  assert.equal(a.open, false);
  assert.equal(b.open, true);
});

test("current year is inserted as a valid number", () => {
  installDom("<span data-current-year></span>");
  setCurrentYear();

  const value = document.querySelector("[data-current-year]").textContent;
  assert.equal(value, String(new Date().getFullYear()));
  assert.equal(Number.isFinite(Number(value)), true);
});

for (const page of pages) {
  test(`${page} bootstraps without a synchronous error and renders icons`, () => {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    installDom(html, { reducedMotion: true });

    assert.doesNotThrow(() => bootstrap());
    assert.equal(document.querySelectorAll("svg.lucide").length > 0, true);
    assert.equal(document.querySelectorAll("h1").length, 1);
    assert.equal(document.querySelector("[data-intro]"), null);
  });

  test(`${page} ships no dialable number and no external target`, () => {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    installDom(html, { reducedMotion: true });

    const targets = [...document.querySelectorAll("[href], [src]")]
      .map((element) => element.getAttribute("href") ?? element.getAttribute("src"));

    assert.equal(targets.some((target) => target?.startsWith("tel:")), false);
    assert.equal(targets.some((target) => /^https?:\/\//.test(target ?? "")), false);
  });
}

test("some tiles animate on hover and some do not", () => {
  let hover = 0;
  let plain = 0;

  for (const page of pages) {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    for (const match of html.matchAll(/class="([^"]*\btile\b[^"]*)"/g)) {
      const tokens = match[1].split(/\s+/);
      if (tokens.includes("tile--hover")) hover += 1;
      else if (tokens.includes("tile")) plain += 1;
    }
  }

  assert.equal(hover > 0, true);
  assert.equal(plain > 0, true);
});

test("nothing on the site starts an entry animation", () => {
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const source = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  assert.equal(/@keyframes/.test(styles), false);
  assert.equal(/intro-overlay|intro-active|data-intro/.test(styles), false);
  assert.equal(/initIntro|intro-active|sessionStorage/.test(source), false);
  assert.equal(/\.tile--hover:hover/.test(styles), true);
  assert.equal(/prefers-reduced-motion/.test(styles), true);

  for (const page of pages) {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    assert.equal(/data-intro|intro-overlay|intro-skip/.test(html), false);
  }
});
