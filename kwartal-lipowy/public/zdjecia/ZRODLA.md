# Źródła i licencje zdjęć

Wszystkie cztery zdjęcia pochodzą z banków zdjęć na licencjach pozwalających na
użycie komercyjne bez opłat i bez obowiązkowej atrybucji. Autorzy podani z
uprzejmości i dla możliwości weryfikacji.

| Plik | Źródło | Licencja | Adres |
|---|---|---|---|
| `hero.jpg` | Pexels | [Pexels License](https://www.pexels.com/license/) | `pexels.com/photo/32194032` |
| `panorama.jpg`, `panorama-mala.jpg` | Poly Haven | [CC0](https://polyhaven.com/license) | `polyhaven.com/a/ballawley_park` |
| `dziedziniec.jpg` | Unsplash | [Unsplash License](https://unsplash.com/license) | `unsplash.com/photos/1776066361467-f70a25cf0dc8` |
| `elewacja.jpg` | Pexels | [Pexels License](https://www.pexels.com/license/) | `pexels.com/photo/18153132` |
| `wnetrze.jpg` | Unsplash | [Unsplash License](https://unsplash.com/license) | `unsplash.com/photos/1781249144411-e6495e75e889` |
| `taras.jpg` | Unsplash | [Unsplash License](https://unsplash.com/license) | `unsplash.com/photos/1762195804066-2fece9b24496` |

Pobrane 28 lipca 2026. Kadry galerii: 1200×1500 (4:5). Hero: 2400×1500 (16:10),
bo rozciąga się na całą szerokość ekranu. Kadrowanie wykonane po stronie CDN-u.

**Panorama** to zdjęcie sferyczne (equirectangular, proporcja dokładnie 2:1) —
tylko taki format da się nałożyć na kulę bez zniekształceń. Oryginał z Poly Haven
ma 8192×4096 i waży ~49 MB, więc jest przeskalowany do dwóch wariantów: 3072×1536
(~808 kB, desktop) i 1536×768 (~168 kB, mały ekran). Powód podziału jest pamięciowy,
nie transferowy: tekstura trafia do GPU nieskompresowana, więc oryginał zająłby
~134 MB pamięci karty, warianty zajmują ~18 MB i ~4,5 MB.

Skalowanie: `sharp(oryginal).resize({ width, height: width / 2 }).jpeg({ quality, mozjpeg: true })`.
Przy podmianie zachowaj proporcję 2:1.

## Ważne przy oddawaniu klientowi

**Te zdjęcia nie przedstawiają żadnej realnej inwestycji.** Na stronie
deweloperskiej mają status materiału ilustrującego zamysł, nie dokumentacji —
i tak są podpisane w [lib/content.ts](../../lib/content.ts) oraz w zastrzeżeniu
pod galerią.

Podpisanie zdjęcia stockowego jako „elewacja południowa budynku B" byłoby
wprowadzaniem kupującego w błąd. Przy wdrożeniu dla realnego klienta zastąp je
fotografiami z budowy albo wizualizacjami od architekta — dopiero wtedy podpisy
mogą wskazywać konkretne miejsca, a zastrzeżenie o „zdjęciach poglądowych"
można zawęzić do standardowej formuły z art. 66 §1 KC.

Obie licencje zabraniają m.in. odsprzedaży samych zdjęć jako produktu oraz
sugerowania, że osoby widoczne na zdjęciach popierają produkt lub usługę.
