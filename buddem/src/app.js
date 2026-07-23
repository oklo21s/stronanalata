import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Cable,
  ChevronDown,
  Factory,
  GraduationCap,
  Handshake,
  HardHat,
  ImageOff,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Route,
  ShieldCheck,
  TrainFront,
  Wrench,
  X,
  createIcons,
} from "lucide";

const iconSet = {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Cable,
  ChevronDown,
  Factory,
  GraduationCap,
  Handshake,
  HardHat,
  ImageOff,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Route,
  ShieldCheck,
  TrainFront,
  Wrench,
  X,
};

export function easeOutCubic(progress) {
  if (!Number.isFinite(progress)) return null;
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const remaining = 1 - progress;
  return 1 - remaining * remaining * remaining;
}

export function formatStatValue(value, decimals) {
  if (!Number.isFinite(value)) return null;
  if (!Number.isSafeInteger(decimals) || decimals < 0 || decimals > 2) return null;

  const fixed = Math.abs(value).toFixed(decimals);
  const [whole, fraction] = fixed.split(".");
  // Twarda spacja trzyma liczbę w jednym kawałku na końcu wiersza.
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  const sign = value < 0 ? "-" : "";

  return fraction ? `${sign}${grouped},${fraction}` : `${sign}${grouped}`;
}

export function renderIcons(root = document) {
  createIcons({ icons: iconSet, root });
}

export function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");

  if (!toggle || !menu) return;

  const closeMenu = ({ returnFocus = false } = {}) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Otwórz menu");
    menu.hidden = true;
    document.body.classList.remove("menu-open");
    if (returnFocus) toggle.focus();
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Zamknij menu");
    menu.hidden = false;
    document.body.classList.add("menu-open");
    menu.querySelector("a")?.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else openMenu();
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ returnFocus: true });
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 901px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

export function initStatCounters() {
  const counters = [...document.querySelectorAll("[data-count-to]")];
  if (!counters.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Without motion or an observer the markup already carries the final value.
  if (reduceMotion || typeof window.IntersectionObserver !== "function") return;

  const countUp = (element) => {
    const target = Number(element.dataset.countTo);
    const decimals = Number(element.dataset.countDecimals ?? "0");
    const finalText = element.textContent;

    if (!Number.isFinite(target) || formatStatValue(target, decimals) === null) return;

    const started = Date.now();

    const step = () => {
      // The divisor stays a literal: scripts/code-safety.mjs rejects dynamic ones.
      const progress = easeOutCubic((Date.now() - started) / 900);

      if (progress === null || progress >= 1) {
        element.textContent = finalText;
        return;
      }

      element.textContent = formatStatValue(target * progress, decimals) ?? finalText;
      requestAnimationFrame(step);
    };

    element.textContent = formatStatValue(0, decimals) ?? finalText;
    requestAnimationFrame(step);
  };

  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        countUp(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

export function initFaq() {
  const items = [...document.querySelectorAll(".faq-list details")];

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((otherItem) => {
        if (otherItem !== item) otherItem.open = false;
      });
    });
  });
}

export function initHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

export function initMobileCallBar() {
  const callBar = document.querySelector("[data-mobile-call]");
  const footer = document.querySelector("[data-site-footer]");

  if (!callBar || !footer || typeof window.IntersectionObserver !== "function") return;

  const observer = new window.IntersectionObserver(
    ([entry]) => callBar.classList.toggle("is-hidden", entry.isIntersecting),
    { threshold: 0.05 },
  );

  observer.observe(footer);
}

export function initScrollReveal() {
  const sections = [...document.querySelectorAll("[data-reveal]")];
  if (!sections.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof window.IntersectionObserver !== "function") {
    sections.forEach((section) => section.classList.add("is-revealed"));
    return;
  }

  sections.forEach((section) => section.classList.add("reveal-ready"));

  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );

  sections.forEach((section) => observer.observe(section));
}

export function initIntro() {
  const intro = document.querySelector("[data-intro]");
  if (!intro) return;

  const storageKey = "buddem-intro-seen";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const forceReplay = new URLSearchParams(window.location.search).get("intro") === "1";
  let wasSeen = false;

  try {
    wasSeen = sessionStorage.getItem(storageKey) === "true";
  } catch {
    wasSeen = false;
  }

  if (reduceMotion || (wasSeen && !forceReplay)) {
    intro.remove();
    return;
  }

  let cleanupTimer;
  let hasFinished = false;

  const rememberIntro = () => {
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {
      // The animation still works when storage is unavailable.
    }
  };

  const cleanup = () => {
    if (hasFinished) return;
    hasFinished = true;
    window.clearTimeout(cleanupTimer);
    document.body.classList.remove("intro-active");
    intro.remove();
    document.removeEventListener("keydown", handleKeydown);
    rememberIntro();
  };

  const skip = () => {
    if (hasFinished) return;
    // is-playing zostaje: zdjęcie go kasuje trwające animacje i panele wracają
    // skokiem na cały ekran, zamiast zniknąć razem z gasnącą nakładką.
    intro.classList.add("is-skipped");
    window.setTimeout(cleanup, 150);
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") skip();
  };

  intro.hidden = false;
  document.body.classList.add("intro-active");
  intro.querySelector("[data-intro-skip]")?.addEventListener("click", skip);
  document.addEventListener("keydown", handleKeydown);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => intro.classList.add("is-playing"));
  });

  // Ostatnia animacja kończy się w 0,82 s (opóźnienie 0,44 + czas 0,38).
  // Limit musi być późniejszy, ale bez martwego czasu — przez ten moment
  // scroll jest jeszcze zablokowany.
  cleanupTimer = window.setTimeout(cleanup, 900);
}

export function initTheme() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  const html = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const themeColor = { dark: "#0c1114", light: "#12181d" };

  const apply = (theme, persist) => {
    const dark = theme === "dark";
    if (dark) html.dataset.theme = "dark";
    else delete html.dataset.theme;
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "Włącz tryb jasny" : "Włącz tryb ciemny");
    if (meta) meta.setAttribute("content", dark ? themeColor.dark : themeColor.light);
    // localStorage to nie plik cookie — zapamiętujemy wybór bez śledzenia.
    if (persist) {
      try {
        localStorage.setItem("buddem-theme", dark ? "dark" : "light");
      } catch {
        // Motyw działa też, gdy pamięć jest niedostępna.
      }
    }
  };

  apply(html.dataset.theme === "dark" ? "dark" : "light", false);

  button.addEventListener("click", () => {
    apply(html.dataset.theme === "dark" ? "light" : "dark", true);
  });
}

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form || typeof window.fetch !== "function") return;

  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector('button[type="submit"]');

  const showStatus = (text, isError) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = text;
    status.classList.toggle("is-error", Boolean(isError));
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton) submitButton.disabled = true;
    showStatus("Wysyłanie wiadomości…", false);

    // Body budujemy z pól po nazwach, nie przez FormData(form) — działa tak samo
    // w przeglądarce i w testach na happy-dom.
    const body = new URLSearchParams();
    for (const name of ["bot-field", "firma", "email", "wiadomosc"]) {
      const field = form.elements.namedItem(name);
      if (field) body.set(name, field.value);
    }

    try {
      const response = await window.fetch(form.action, {
        method: "POST",
        body,
        headers: { Accept: "text/html" },
      });

      if (response.ok) {
        form.reset();
        showStatus("Dziękuję! Wiadomość została wysłana — odpowiem na podany e-mail.", false);
      } else if (response.status === 422) {
        showStatus(
          "Serwer odrzucił formularz — sprawdź, czy e-mail jest poprawny, a wiadomość ma od 20 do 3000 znaków.",
          true,
        );
      } else {
        showStatus("Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.", true);
      }
    } catch {
      showStatus("Brak połączenia z serwerem — spróbuj ponownie za chwilę.", true);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

export function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

export function bootstrap() {
  // Nakładka musi zasłonić stronę przed renderIcons(), które synchronicznie
  // tworzy kilkadziesiąt SVG. Klasa is-playing i tak dochodzi dopiero
  // w requestAnimationFrame, więc animacja rusza po tej pracy, nie w jej trakcie.
  initIntro();
  renderIcons();
  initTheme();
  setCurrentYear();
  initMobileMenu();
  initFaq();
  initHeader();
  initMobileCallBar();
  initScrollReveal();
  initStatCounters();
  initContactForm();
}
