import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { initNavigation, initReveal, initRouting, initStickyCta, initTheme } from '../src/app.js';

// Strona ma trzy adresy z własnym plikiem HTML (/, /oferta/, /realizacje/)
// oraz kilka adresów będących sekcjami strony głównej. Router musi je
// rozróżniać, inaczej odnośnik do podstrony zamienia się w martwy klik.
function createRoutedPage(url) {
  const window = new Window({ url });
  window.document.body.innerHTML = `
    <header class="site-header"></header>
    <nav id="site-nav">
      <a id="do-uslug" href="/uslugi">Usługi</a>
      <a id="do-oferty" href="/oferta/">Oferta</a>
    </nav>
    <section id="uslugi">Usługi</section>
  `;
  initRouting(window.document);
  return window;
}

function clickAndReportDefault(window, id) {
  const event = new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
  window.document.getElementById(id).dispatchEvent(event);
  return event.defaultPrevented;
}

function createThemePage() {
  const window = new Window({ url: 'https://moja-wizytowka.local/' });
  window.document.head.innerHTML = '<meta name="theme-color" content="#faf9f6">';
  window.document.body.innerHTML = `
    <button class="theme-toggle" aria-pressed="false" aria-label="Włącz tryb ciemny">
      <svg class="theme-toggle__moon"></svg><svg class="theme-toggle__sun"></svg>
    </button>
  `;
  initTheme(window.document);
  return window;
}

function createPage() {
  const window = new Window({ url: 'https://moja-wizytowka.local/' });
  window.document.body.innerHTML = `
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav"><a href="#uslugi">Usługi</a><a href="#kontakt">Kontakt</a></nav>
  `;
  initNavigation(window.document);
  return window;
}

test('kliknięcie przycisku otwiera i zamyka menu', () => {
  const window = createPage();
  const button = window.document.querySelector('.menu-toggle');
  const nav = window.document.querySelector('#site-nav');

  button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  assert.equal(nav.classList.contains('is-open'), true);
  assert.equal(window.document.documentElement.classList.contains('menu-open'), true);

  button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(nav.classList.contains('is-open'), false);
});

test('wybór odnośnika zamyka menu', () => {
  const window = createPage();
  const button = window.document.querySelector('.menu-toggle');
  button.click();
  window.document.querySelector('#site-nav a').click();
  assert.equal(button.getAttribute('aria-expanded'), 'false');
});

test('Escape zamyka menu i przywraca fokus na przycisk', () => {
  const window = createPage();
  const button = window.document.querySelector('.menu-toggle');
  button.click();
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(window.document.activeElement, button);
});

test('animacje mają bezpieczny fallback bez IntersectionObserver', () => {
  const window = new Window();
  Object.defineProperty(window, 'IntersectionObserver', { value: undefined, configurable: true });
  window.document.body.innerHTML = '<section data-reveal></section><article data-reveal></article>';
  assert.doesNotThrow(() => initReveal(window.document));
  const elements = [...window.document.querySelectorAll('[data-reveal]')];
  assert.equal(elements.every((element) => element.classList.contains('is-visible')), true);
});

test('inicjalizacja bez wymaganych elementów jest bezpieczna', () => {
  const window = new Window();
  assert.doesNotThrow(() => initNavigation(window.document));
  assert.doesNotThrow(() => initReveal(window.document));
  assert.equal(typeof initNavigation(window.document), 'function');
  assert.equal(typeof initReveal(window.document), 'function');
});

test('przycisk motywu przełącza tryb ciemny i aktualizuje stan dostępności', () => {
  const window = createThemePage();
  const button = window.document.querySelector('.theme-toggle');
  const html = window.document.documentElement;
  const meta = window.document.querySelector('meta[name="theme-color"]');

  assert.equal(button.getAttribute('aria-pressed'), 'false');

  button.click();
  assert.equal(html.dataset.theme, 'dark');
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.equal(button.getAttribute('aria-label'), 'Włącz tryb jasny');
  assert.equal(meta.getAttribute('content'), '#0d0f13');

  button.click();
  assert.equal(html.dataset.theme, undefined);
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  assert.equal(meta.getAttribute('content'), '#faf9f6');
});

test('inicjalizacja motywu bez przycisku jest bezpieczna', () => {
  const window = new Window();
  assert.doesNotThrow(() => initTheme(window.document));
  assert.equal(typeof initTheme(window.document), 'function');
});

test('duża parzysta liczba przełączeń pozostawia menu zamknięte', () => {
  const window = createPage();
  const button = window.document.querySelector('.menu-toggle');
  for (let index = 0; index < 10_000; index += 1) button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(window.document.querySelector('#site-nav').classList.contains('is-open'), false);
});

test('na stronie głównej odnośnik do sekcji jest obsługiwany przez router', () => {
  const window = createRoutedPage('https://stronanalata.pl/');
  assert.equal(clickAndReportDefault(window, 'do-uslug'), true);
});

test('odnośnik do podstrony z własnym plikiem HTML zostaje przy przeglądarce', () => {
  const window = createRoutedPage('https://stronanalata.pl/');
  assert.equal(clickAndReportDefault(window, 'do-oferty'), false);
});

test('na podstronie router nie przechwytuje odnośników do sekcji strony głównej', () => {
  const window = createRoutedPage('https://stronanalata.pl/oferta/');
  assert.equal(clickAndReportDefault(window, 'do-uslug'), false);
});

test('pływający przycisk działa na podstronie bez sekcji kontaktu', () => {
  const window = new Window({ url: 'https://stronanalata.pl/oferta/' });
  window.document.body.innerHTML = '<a class="sticky-cta" href="/kontakt">Napisz</a><footer class="site-footer"></footer>';
  assert.doesNotThrow(() => initStickyCta(window.document));
  assert.equal(typeof initStickyCta(window.document), 'function');
});
