import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Camera,
  Clock,
  Footprints,
  Frame,
  GraduationCap,
  Info,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Palette,
  Share2,
  Sparkles,
  Ticket,
  Users,
  X,
  createIcons,
} from "lucide";

// Tylko ikony faktycznie użyte w markupie. Nieużyta ikona to martwy kod
// w pakiecie, a literówka w nazwie wysypałaby import przy budowaniu.
const iconSet = {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Camera,
  Clock,
  Footprints,
  Frame,
  GraduationCap,
  Info,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Palette,
  Share2,
  Sparkles,
  Ticket,
  Users,
  X,
};

export function renderIcons(root = document) {
  createIcons({ icons: iconSet, root });
}

export function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

// Nawigacja mobilna. Menu jest w pełni dostępne bez JavaScriptu (linki są
// zwykłymi <a>), a ten kod dokłada tylko rozwijanie na wąskich ekranach.
export function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-mobilne");

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

// Cień pod nagłówkiem pojawia się dopiero po przewinięciu — to zmiana klasy,
// nie animacja wejścia, i nie rusza układu strony.
export function initHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// Akordeon FAQ: naraz otwarta jest najwyżej jedna pozycja. Bez JS <details>
// i tak działają — tu dokładamy tylko zwijanie sąsiadów.
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

// Filtr kalendarza wydarzeń. Domyślnie (bez JS) widać wszystkie grupy — ta
// funkcja dokłada przełączanie kategorii jako progresywne ulepszenie.
export function applyMenuFilter(groups, filter) {
  let visible = 0;
  groups.forEach((group) => {
    const matches = filter === "wszystko" || group.dataset.course === filter;
    group.classList.toggle("is-filtered-out", !matches);
    if (matches) visible += 1;
  });
  return visible;
}

export function initMenuFilter() {
  const panel = document.querySelector("[data-menu-filter]");
  if (!panel) return;

  const buttons = [...panel.querySelectorAll("[data-filter]")];
  const groups = [...document.querySelectorAll("[data-course]")];
  if (!buttons.length || !groups.length) return;

  const select = (active) => {
    buttons.forEach((button) => {
      const isActive = button === active;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.classList.toggle("is-active", isActive);
    });
    applyMenuFilter(groups, active.dataset.filter);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => select(button));
  });
}

export function initTheme() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  const html = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const themeColor = { dark: "#14131f", light: "#1d1b39" };

  const apply = (theme, persist) => {
    const dark = theme === "dark";
    if (dark) html.dataset.theme = "dark";
    else delete html.dataset.theme;
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "Włącz tryb jasny" : "Włącz tryb ciemny");
    if (meta) meta.setAttribute("content", dark ? themeColor.dark : themeColor.light);
    // localStorage to nie plik cookie — wybór przenosi się między podstronami
    // bez śledzenia. Klucz jest wspólny dla całego serwisu muzeum.
    if (persist) {
      try {
        localStorage.setItem("muzeum-theme", dark ? "dark" : "light");
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

export function bootstrap() {
  // Brak nakładki wejściowej: pierwszą rzeczą na ekranie jest treść strony.
  // renderIcons() idzie na początek, bo podmienia znaczniki na SVG.
  renderIcons();
  initTheme();
  setCurrentYear();
  initMobileMenu();
  initHeader();
  initFaq();
  initMenuFilter();
}
