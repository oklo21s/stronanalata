import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { Window } from "happy-dom";

import {
  bootstrap,
  easeOutCubic,
  formatStatValue,
  initContactForm,
  initIntro,
  initStatCounters,
  setCurrentYear,
} from "../src/app.js";
import { makeVariant } from "../scripts/variant.mjs";

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

test("reduced-motion setting removes the intro before it starts", () => {
  installDom('<div data-intro hidden><button data-intro-skip></button></div>', {
    reducedMotion: true,
  });

  initIntro();

  assert.equal(document.querySelector("[data-intro]"), null);
  assert.equal(document.body.classList.contains("intro-active"), false);
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

test("the no-intro version carries the same content without the overlay", () => {
  const variant = readFileSync(new URL("../bez-intro.html", import.meta.url), "utf8");
  installDom(variant, { reducedMotion: true });

  assert.equal(document.querySelector("[data-intro]"), null);
  assert.equal(document.querySelectorAll(".area-card").length, 6);
  assert.equal(document.querySelectorAll("[data-count-to]").length, 8);
  assert.equal(document.querySelectorAll("h1").length, 1);
  assert.equal(document.querySelector(".status-bar__switch").getAttribute("href"), "/buddem/");
});

test("the no-intro version bootstraps and skips the intro cleanly", () => {
  const variant = readFileSync(new URL("../bez-intro.html", import.meta.url), "utf8");
  installDom(variant, { reducedMotion: false });

  assert.doesNotThrow(() => bootstrap());
  assert.equal(document.body.classList.contains("intro-active"), false);
  assert.equal(document.querySelectorAll("svg.lucide").length > 0, true);
});

test("both versions stay in sync with the generator", () => {
  const source = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const onDisk = readFileSync(new URL("../bez-intro.html", import.meta.url), "utf8");
  const { variant, problems } = makeVariant(source);

  assert.deepEqual(problems, []);
  assert.equal(variant, onDisk);
});

test("the intro animation touches only compositor-friendly properties", () => {
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const frames = [...styles.matchAll(/@keyframes\s+(rule-draw|wordmark-in|intro-fade-out|panel-up|panel-down|skip-out)\b([\s\S]*?)\n\}/g)];

  assert.equal(frames.length, 6);

  // visibility jest dozwolona: przełącza się skokowo i nie wymusza przeliczenia
  // układu, a bez niej przycisk pominięcia zostaje klikalny mimo opacity: 0.
  const allowed = ["transform", "opacity", "visibility"];

  for (const [, name, body] of frames) {
    const declarations = [...body.matchAll(/^\s{4}([a-z-]+)\s*:/gm)].map((match) => match[1]);
    assert.notEqual(declarations.length, 0, `${name} nie ma deklaracji`);

    for (const property of declarations) {
      assert.equal(
        allowed.includes(property),
        true,
        `@keyframes ${name} animuje „${property}" zamiast transform/opacity`,
      );
    }
  }
});

test("the skip button stops catching clicks once it fades out", () => {
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const skipFrame = styles.match(/@keyframes\s+skip-out\b([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.equal(skipFrame.includes("opacity: 0"), true);
  assert.equal(skipFrame.includes("visibility: hidden"), true);
});

test("skipping keeps the panels moving instead of snapping them back", () => {
  const source = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const skipBody = source.match(/const skip = \(\) => \{([\s\S]*?)\n  \};/)?.[1] ?? "";

  assert.notEqual(skipBody.length, 0);
  assert.equal(skipBody.includes('classList.add("is-skipped")'), true);
  assert.equal(skipBody.includes('classList.remove("is-playing")'), false);
});

test("the intro clears the screen well before the hard limit", () => {
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const source = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  const ends = [...styles.matchAll(/\.intro-overlay\.is-playing[^{]*\{([\s\S]*?)\n\}/g)]
    .flatMap(([, body]) => {
      const shorthand = body.match(/animation:\s*([\s\S]*?);/)?.[1] ?? "";
      // cubic-bezier(...) ma własne przecinki — bez tego split rozcina je
      // w środku i gubi opóźnienie animacji.
      return shorthand.replace(/\([^)]*\)/g, "()").split(",").flatMap((entry) => {
        const times = [...entry.matchAll(/([\d.]+)s/g)].map((match) => Number(match[1]));
        return times.length ? [times[0] + (times[1] ?? 0)] : [];
      });
    });

  assert.notEqual(ends.length, 0);

  const lastEndMs = Math.round(Math.max(...ends) * 1000);
  // Konkretnie limit sprzątający, nie krótszy timer pominięcia.
  const hardLimit = Number(source.match(/cleanupTimer = window\.setTimeout\(cleanup,\s*(\d+)\)/)?.[1]);

  assert.equal(lastEndMs <= 1_400, true, `animacja trwa ${lastEndMs} ms`);
  assert.equal(hardLimit > lastEndMs, true, `limit ${hardLimit} ms nie jest po ${lastEndMs} ms`);
  assert.equal(hardLimit - lastEndMs <= 250, true, `martwy czas ${hardLimit - lastEndMs} ms`);
});

const CONTACT_FORM_HTML = `
  <form data-contact-form method="POST" action="/kontakt.php">
    <input name="bot-field" type="text">
    <input name="firma" type="text">
    <input name="email" type="email">
    <textarea name="wiadomosc"></textarea>
    <p data-form-status hidden></p>
    <button type="submit">Wyślij wiadomość</button>
  </form>`;

function fillContactForm(form) {
  form.elements.namedItem("firma").value = "Pracownia Testowa";
  form.elements.namedItem("email").value = "test@example.com";
  form.elements.namedItem("wiadomosc").value = "Wiadomość testowa, która ma ponad dwadzieścia znaków.";
}

async function submitContactForm(form) {
  form.dispatchEvent(new activeWindow.Event("submit", { bubbles: true, cancelable: true }));
  // Handler jest asynchroniczny — czekamy aż łańcuch promise się rozliczy.
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 0));
}

test("a delivered submission is confirmed inline and the form is cleared", async () => {
  installDom(CONTACT_FORM_HTML);
  const requests = [];
  activeWindow.fetch = async (url, options) => {
    requests.push({ url, options });
    return { ok: true, status: 200 };
  };

  initContactForm();
  const form = document.querySelector("[data-contact-form]");
  fillContactForm(form);
  await submitContactForm(form);

  assert.equal(requests.length, 1);
  assert.equal(String(requests[0].url).endsWith("/kontakt.php"), true);
  assert.equal(requests[0].options.method, "POST");
  const body = requests[0].options.body;
  assert.equal(body.get("firma"), "Pracownia Testowa");
  assert.equal(body.get("email"), "test@example.com");
  assert.equal(body.get("bot-field"), "");

  const status = form.querySelector("[data-form-status]");
  assert.equal(status.hidden, false);
  assert.equal(status.textContent.includes("wysłana"), true);
  assert.equal(status.classList.contains("is-error"), false);
  assert.equal(form.elements.namedItem("firma").value, "");
  assert.equal(form.querySelector("button").disabled, false);
});

test("a rejected submission shows an error and keeps the typed message", async () => {
  installDom(CONTACT_FORM_HTML);
  activeWindow.fetch = async () => ({ ok: false, status: 422 });

  initContactForm();
  const form = document.querySelector("[data-contact-form]");
  fillContactForm(form);
  await submitContactForm(form);

  const status = form.querySelector("[data-form-status]");
  assert.equal(status.classList.contains("is-error"), true);
  assert.equal(status.textContent.includes("od 20 do 3000"), true);
  // Treść zostaje w polach, żeby dało się ją poprawić bez przepisywania.
  assert.notEqual(form.elements.namedItem("wiadomosc").value, "");
  assert.equal(form.querySelector("button").disabled, false);
});

test("a network failure fails closed with a retry message", async () => {
  installDom(CONTACT_FORM_HTML);
  activeWindow.fetch = async () => {
    throw new Error("offline");
  };

  initContactForm();
  const form = document.querySelector("[data-contact-form]");
  fillContactForm(form);
  await submitContactForm(form);

  const status = form.querySelector("[data-form-status]");
  assert.equal(status.classList.contains("is-error"), true);
  assert.equal(status.textContent.includes("Brak połączenia"), true);
  assert.equal(form.querySelector("button").disabled, false);
});

test("without fetch the handler steps aside for the native submit", () => {
  installDom(CONTACT_FORM_HTML);
  activeWindow.fetch = undefined;

  assert.doesNotThrow(() => initContactForm());
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
