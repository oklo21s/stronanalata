import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { Window } from "happy-dom";

import {
  bootstrap,
  easeOutCubic,
  formatStatValue,
  initStatCounters,
  setCurrentYear,
} from "../src/app.js";

let activeWindow;

function installDom(html = "", {
  reducedMotion = true,
  url = "http://localhost/",
  intersecting = false,
} = {}) {
  activeWindow = new Window({ url });
  activeWindow.document.write(html);
  activeWindow.document.close();
  activeWindow.matchMedia = (query) => ({
    matches: reducedMotion && query === "(prefers-reduced-motion: reduce)",
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });

  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe(target) {
      if (intersecting) this.callback([{ isIntersecting: true, target }], this);
    }

    disconnect() {}
    unobserve() {}
  }

  activeWindow.IntersectionObserver = MockIntersectionObserver;

  Object.assign(globalThis, {
    document: activeWindow.document,
    window: activeWindow,
    sessionStorage: activeWindow.sessionStorage,
    IntersectionObserver: MockIntersectionObserver,
    requestAnimationFrame: (callback) => activeWindow.setTimeout(callback, 0),
  });
}

afterEach(() => {
  activeWindow?.close();
  activeWindow = undefined;
  delete globalThis.document;
  delete globalThis.window;
  delete globalThis.sessionStorage;
  delete globalThis.IntersectionObserver;
  delete globalThis.requestAnimationFrame;
});

test("easeOutCubic rejects values that are not finite numbers", () => {
  assert.equal(easeOutCubic(Number.NaN), null);
  assert.equal(easeOutCubic(Number.POSITIVE_INFINITY), null);
  assert.equal(easeOutCubic(Number.NEGATIVE_INFINITY), null);
  assert.equal(easeOutCubic("0.5"), null);
  assert.equal(easeOutCubic(undefined), null);
});

test("easeOutCubic clamps to the closed range from zero to one", () => {
  assert.equal(easeOutCubic(-4), 0);
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(easeOutCubic(9), 1);

  const midpoint = easeOutCubic(0.5);
  assert.equal(midpoint > 0.5 && midpoint < 1, true);
});

const NBSP = "\u00a0";

test("formatStatValue groups thousands and uses a Polish decimal comma", () => {
  assert.equal(formatStatValue(0, 0), "0");
  assert.equal(formatStatValue(46, 0), "46");
  assert.equal(formatStatValue(1850, 0), `1${NBSP}850`);
  assert.equal(formatStatValue(1234567, 0), `1${NBSP}234${NBSP}567`);
  assert.equal(formatStatValue(2.1, 1), "2,1");
  assert.equal(formatStatValue(-12, 0), "-12");
});

test("formatStatValue fails closed on invalid input instead of throwing", () => {
  assert.equal(formatStatValue(Number.NaN, 0), null);
  assert.equal(formatStatValue(Number.POSITIVE_INFINITY, 0), null);
  assert.equal(formatStatValue(10, 1.5), null);
  assert.equal(formatStatValue(10, -1), null);
  assert.equal(formatStatValue(10, 9), null);
  assert.equal(formatStatValue(10, "1"), null);
});

test("counters with no elements return safely", () => {
  installDom("<div></div>");
  assert.doesNotThrow(() => initStatCounters());
});

test("reduced motion leaves the printed value untouched", () => {
  installDom('<span data-count-to="1850">1 850</span>', { reducedMotion: true, intersecting: true });

  initStatCounters();

  assert.equal(document.querySelector("[data-count-to]").textContent, "1 850");
});

test("a counter that scrolls into view starts at zero and lands on the final value", async () => {
  installDom('<span data-count-to="1850">1 850</span>', {
    reducedMotion: false,
    intersecting: true,
  });

  initStatCounters();
  const counter = document.querySelector("[data-count-to]");
  assert.equal(counter.textContent, "0");

  await new Promise((resolvePromise) => window.setTimeout(resolvePromise, 1000));

  assert.equal(counter.textContent, "1 850");
});

test("a counter with an unusable target keeps its printed value", () => {
  installDom('<span data-count-to="nie-liczba">brak</span>', {
    reducedMotion: false,
    intersecting: true,
  });

  initStatCounters();

  assert.equal(document.querySelector("[data-count-to]").textContent, "brak");
});

test("current year is inserted without an invalid numeric value", () => {
  installDom("<span data-current-year></span>");
  setCurrentYear();

  const value = document.querySelector("[data-current-year]").textContent;
  assert.equal(value, String(new Date().getFullYear()));
  assert.equal(Number.isFinite(Number(value)), true);
});

test("the complete HTML bootstraps without a synchronous runtime error", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  installDom(html, { reducedMotion: true });

  assert.doesNotThrow(() => bootstrap());
  assert.equal(document.querySelectorAll("svg.lucide").length > 0, true);
  assert.equal(document.querySelector("[data-intro]"), null);
});

test("all six activity cards stay open, with no tab widget left behind", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  installDom(html, { reducedMotion: true });

  const cards = [...document.querySelectorAll(".area-card")];
  assert.equal(cards.length, 6);
  assert.equal(cards.every((card) => !card.hidden), true);
  assert.equal(document.querySelectorAll("[role='tab']").length, 0);
  assert.equal(document.querySelectorAll("[data-tabs]").length, 0);
});

test("the fictional brand ships no dialable number and no external target", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  installDom(html, { reducedMotion: true });

  const targets = [...document.querySelectorAll("[href], [src]")]
    .map((element) => element.getAttribute("href") ?? element.getAttribute("src"));

  assert.equal(targets.some((target) => target?.startsWith("tel:")), false);
  assert.equal(targets.some((target) => /^https?:\/\//.test(target ?? "")), false);
});

test("nothing on the page starts an entry animation", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const source = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  // To jest cecha odrozniajaca te wersje od buddem, wiec pilnuje jej test,
  // a nie tylko komentarz. .intro__* to sekcja "o firmie" i zostaje.
  assert.equal(/data-intro|intro-overlay|intro-skip/.test(html), false);
  assert.equal(/\.intro-(?:overlay|panel|rule|wordmark|skip)|intro-active/.test(styles), false);
  assert.equal(/rule-draw|wordmark-in|intro-fade-out|panel-up|panel-down|skip-out/.test(styles), false);
  assert.equal(/initIntro|intro-active|sessionStorage/.test(source), false);
});

test("the page bootstraps with motion enabled and never blocks scrolling", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  installDom(html, { reducedMotion: false });

  assert.doesNotThrow(() => bootstrap());
  assert.equal(document.querySelectorAll("svg.lucide").length > 0, true);
  assert.equal(document.body.className.includes("intro-active"), false);
});

test("every printed statistic matches its machine-readable target", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  installDom(html, { reducedMotion: true });

  const counters = [...document.querySelectorAll("[data-count-to]")];
  assert.equal(counters.length, 8);

  for (const counter of counters) {
    const target = Number(counter.dataset.countTo);
    const decimals = Number(counter.dataset.countDecimals ?? "0");

    assert.equal(Number.isFinite(target), true);
    assert.equal(formatStatValue(target, decimals), counter.textContent);
  }
});
