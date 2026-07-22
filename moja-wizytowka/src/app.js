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
