export function initNavigation(root = document) {
  const button = root.querySelector('.menu-toggle');
  const nav = root.querySelector('#site-nav');

  if (!button || !nav) return () => {};

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    root.documentElement?.classList.toggle('menu-open', open);
  };

  const close = () => setOpen(false);
  const toggle = () => setOpen(button.getAttribute('aria-expanded') !== 'true');

  button.addEventListener('click', toggle);
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close();
      button.focus();
    }
  });

  return close;
}

export function initTheme(root = document) {
  const button = root.querySelector('.theme-toggle');
  if (!button) return () => {};

  const html = root.documentElement;
  const meta = root.querySelector('meta[name="theme-color"]');
  const colors = { dark: '#0d0f13', light: '#faf9f6' };

  const apply = (theme) => {
    const dark = theme === 'dark';
    if (dark) html.dataset.theme = 'dark';
    else delete html.dataset.theme;
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny');
    if (meta) meta.setAttribute('content', dark ? colors.dark : colors.light);
  };

  apply(html.dataset.theme === 'dark' ? 'dark' : 'light');

  // Motyw przełączamy tylko w obrębie sesji — bez zapisu w przeglądarce,
  // zgodnie z zasadą braku pamięci przeglądarki i trackerów na tej stronie.
  const onClick = () => apply(html.dataset.theme === 'dark' ? 'light' : 'dark');
  button.addEventListener('click', onClick);

  return () => button.removeEventListener('click', onClick);
}

export function initRouting(root = document) {
  const view = root.defaultView ?? globalThis.window;
  if (!view) return () => {};

  // Czyste adresy sekcji zamiast kotwic #. Serwer (.htaccess) serwuje na nich
  // index.html, a poniższy kod przewija do właściwej sekcji i aktualizuje adres.
  const routes = {
    '/': 'top',
    '/o-mnie': 'o-mnie',
    '/uslugi': 'uslugi',
    '/proces': 'proces',
    '/realizacje': 'realizacje',
    '/faq': 'faq',
    '/kontakt': 'kontakt',
  };

  const header = root.querySelector('.site-header');
  const reduced = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const scrollToPath = (path, smooth) => {
    const id = routes[path];
    if (!id) return;
    const behavior = smooth && !reduced ? 'smooth' : 'auto';
    if (id === 'top') {
      view.scrollTo({ top: 0, behavior });
      return;
    }
    const target = root.getElementById(id);
    if (!target) return;
    const offset = (header?.offsetHeight ?? 0) + 12;
    const top = target.getBoundingClientRect().top + view.scrollY - offset;
    view.scrollTo({ top: Math.max(top, 0), behavior });
  };

  const onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

    let url;
    try { url = new view.URL(anchor.href); } catch { return; }
    // Kotwice w obrębie strony (np. skip-link #main) zostawiamy przeglądarce.
    if (url.hash || url.origin !== view.location.origin) return;
    if (!(url.pathname in routes)) return;

    event.preventDefault();
    if (url.pathname !== view.location.pathname) view.history.pushState({}, '', url.pathname);
    scrollToPath(url.pathname, true);
  };

  const onPopState = () => scrollToPath(view.location.pathname, false);

  root.addEventListener('click', onClick);
  view.addEventListener('popstate', onPopState);

  // Wejście wprost lub odświeżenie na /faq, /uslugi itd. — przewiń po ułożeniu layoutu.
  if (view.location.pathname !== '/' && view.location.pathname in routes) {
    view.requestAnimationFrame?.(() => scrollToPath(view.location.pathname, false));
  }

  return () => {
    root.removeEventListener('click', onClick);
    view.removeEventListener('popstate', onPopState);
  };
}

export function initStickyCta(root = document) {
  const cta = root.querySelector('.sticky-cta');
  const contact = root.querySelector('#kontakt');
  if (!cta || !contact) return () => {};

  const view = root.defaultView ?? globalThis.window;
  if (typeof view?.IntersectionObserver !== 'function') return () => {};

  // Chowamy pływający przycisk, gdy widać sekcję kontaktu lub stopkę —
  // żeby nie zasłaniał formularza ani treści na dole strony.
  const footer = root.querySelector('.site-footer');
  const visible = new Set();
  const observer = new view.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    cta.classList.toggle('is-hidden', visible.size > 0);
  }, { rootMargin: '0px 0px -35% 0px' });

  observer.observe(contact);
  if (footer) observer.observe(footer);
  return () => observer.disconnect();
}

export function initReveal(root = document) {
  const elements = [...root.querySelectorAll('[data-reveal]')];
  if (!elements.length) return () => {};

  const view = root.defaultView ?? globalThis.window;
  const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || typeof view?.IntersectionObserver !== 'function') {
    elements.forEach((element) => element.classList.add('is-visible'));
    return () => {};
  }

  root.documentElement?.classList.add('reveal-ready');
  const observer = new view.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}
