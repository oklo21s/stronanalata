// Ustawia tryb ciemny z preferencji systemu jeszcze przed renderem strony —
// bez migotania i bez pamięci przeglądarki. Wczytywany jako zewnętrzny plik
// z tej samej domeny, więc jest zgodny z CSP (script-src 'self').
(function () {
  try {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.dataset.theme = "dark";
    }
  } catch (e) {}
})();
