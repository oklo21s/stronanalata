// Motyw domyślny to jasny — nie nadpisujemy go przed renderem. Skrypt zostaje
// wczytany jako zewnętrzny plik z tej samej domeny (zgodny z CSP, script-src
// 'self'), żeby ewentualna zmiana domyślnego motywu miała gdzie zamieszkać bez
// migotania. Przełączanie w obrębie strony obsługuje initTheme() w app.js.
(function () {
  // Celowo pusto: strona startuje w trybie jasnym.
})();
