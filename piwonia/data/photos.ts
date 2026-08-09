/**
 * Rejestr zdjec. Wymiary, blurDataURL i podpis autora sa generowane razem
 * z plikami w public/img — patrz README, sekcja "Zdjecia".
 *
 * PLIK GENEROWANY. Recznie edytuje sie tylko opisy alt (w skrypcie generujacym)
 * oraz blok z BASE_PATH na koncu pliku — po regeneracji trzeba go przywrocic,
 * inaczej zdjecia znikna z dema stojacego pod podscieżką.
 */

export type Photo = {
  readonly src: string
  readonly width: number
  readonly height: number
  readonly alt: string
  readonly blurDataURL: string
  readonly credit: { readonly author: string; readonly href: string }
}

const zdjeciaBezPrefiksu = {
  'bar': {
    src: '/img/bar.jpg',
    width: 1600,
    height: 2400,
    alt: "Pusta sala restauracji o zmierzchu, krzesła zdjęte na stoły, kafelkowa podłoga",
    blurDataURL:
      'data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAADwAwCdASoQABgAPu1iqU2ppaQiMAgBMB2JbACdMoAKRqclSOs/vt1AAP794EMl5i8ABFWoaYm3sfGTzrJdwj3kD8bnbTu8XD8sCQ2C94Yfni+qDpUH+vJaMHk1N4OK6Q2o4Vi1Be5okOPzKLPkKeZFTy1A35/eM6QAAA==',
    credit: { author: "Robert | Visual Diary", href: "https://unsplash.com/photos/restaurant-tables-and-chairs-with-warm-lighting-Pgu0wF6EOOE" },
  },
  'barszcz': {
    src: '/img/barszcz.jpg',
    width: 1400,
    height: 933,
    alt: "Talerz czerwonego barszczu z kwaśną śmietaną i kromką razowca",
    blurDataURL:
      'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAwAgCdASoQAAsAA4BaJQBdgMWW1fvZ29bEAAD+75ECOXbF8Mz3m2YdOWpk18RKtXOEEjWz1poRAd1Gc+PphrN+ngvh/SL+j0JE7QVAI2Q72oOeGi1vSGpFHU8AAA==',
    credit: { author: "Max Nayman", href: "https://unsplash.com/photos/red-and-white-ceramic-bowl-with-red-sauce-NkGhmwAw7hQ" },
  },
  'chleb': {
    src: '/img/chleb.jpg',
    width: 1400,
    height: 1050,
    alt: "Bochenek chleba na zakwasie przekrojony na drewnianej desce",
    blurDataURL:
      'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABQAgCdASoQAAwAA4BaJZACdAYwnqiU5pAcxgAA/tUVHRvijOuMdYqws1Y18AvWoYY3gOhrW6IpE6xWCmTJpytjNe9Mdan5NWusuIvb6t3FsQZsodZeD6SBFiUwUVJCS96AAA==',
    credit: { author: "Debbie Widjaja", href: "https://unsplash.com/photos/brown-bread-on-brown-wooden-chopping-board-H_PXix_4Bwc" },
  },
  'ciasto': {
    src: '/img/ciasto.jpg',
    width: 1400,
    height: 933,
    alt: "Dłonie wyrabiające ciasto na obsypanym mąką blacie",
    blurDataURL:
      'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAgCdASoQAAsAA4BaJYwCdAEWjo70oaFkAADiRcvyMVilw/JLDFFDoW9tmeP/1J+zDy+QdWtqA6eS9O3vnAFMXwnc2XBNR9/vAvoZxWeKkiPGCyiA0ycYrgA=',
    credit: { author: "Theme Photos", href: "https://unsplash.com/photos/person-standing-and-making-dough-Hx7xdwhj2AY" },
  },
  'goscie': {
    src: '/img/goscie.jpg',
    width: 1800,
    height: 2250,
    alt: "Goście przy stole wznoszą toast w sali z portretami i świecznikiem",
    blurDataURL:
      'data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAACQBACdASoQABQAPu1iqU2ppaOiMAgBMB2JbACdMoAlsBWmGUvK8M6fxgjaogAA/tHhtXsNPLefqYfe5LwvlyFJKuFfsmmKFU2gaHC/v9KzH2dizvAMKPBRnJSXX6QbeblxBERC9TLBxXV+ueULllhOZMFGz3c//mk5MYVUclfD5KpF5+PGMme0cYMmYU0xkmCEKKEn266pzmbZFyaNp8t/PT9iJNUISNkGCKj/M8TlfikPMAAAAA==',
    credit: { author: "Sebastian Coman Photography", href: "https://unsplash.com/photos/group-of-people-sitting-on-chair-in-front-of-table-with-plates-and-drinking-glasses-nQqNjfOVvrs" },
  },
  'grzyby': {
    src: '/img/grzyby.jpg',
    width: 1400,
    height: 933,
    alt: "Wiklinowy kosz pełen borowików",
    blurDataURL:
      'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQAgCdASoQAAsAA4BaJYgCdAYtpwhiq/SLHsAA/vMwL/eiWWljoU3iL+fRYIfwlZ/2a2cHMvHTILKOecFT5qUyxetv4NRNJke6PEmWv6DbJ/++IhYsvi2LaOXRsVkxBGrx8yegmIvUIYYAAAA=',
    credit: { author: "Barbara Krysztofiak", href: "https://unsplash.com/photos/a-basket-filled-with-lots-of-different-types-of-mushrooms-TYqb66Jlkww" },
  },
  'kaczka': {
    src: '/img/kaczka.jpg',
    width: 1400,
    height: 933,
    alt: "Pierś kaczki w ciemnym sosie z kaszą, podana na jasnym talerzu",
    blurDataURL:
      'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACQAgCdASoQAAsAA4BaJbACdAYuvlKPK9whYX/MAAD+0c1zJFkFioVQH0noYQ1LOqRv84m2chdwmISLw0NCviHd6Wa0mxD31bv+kR+dYENC68Tb0Rxn7L5EsgsFPDlQGQnW3M7eAAA=',
    credit: { author: "Brett Wharton", href: "https://unsplash.com/photos/a-white-plate-topped-with-a-piece-of-meat-covered-in-sauce-S8ZTfuHE0M8" },
  },
  'kieliszki': {
    src: '/img/kieliszki.jpg',
    width: 1400,
    height: 1750,
    alt: "Nakryty stolik z kieliszkami w ciepłym świetle lampy",
    blurDataURL:
      'data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAABQBACdASoQABQAPu1iqU2ppaOiMAgBMB2JYgCdMoAC2HshYGcETiKIoEYAAP7Q7D54frMgjJ+Fr7X+JqW7ll6r849FPpNOpgV9SbTG3PbKm6Zpbdl8E0FcoHA/f/cOzIuCbWGPXZY5kfTD8cel4I3FFT4omqY3nCuAAA==',
    credit: { author: "Max Griss", href: "https://unsplash.com/photos/a-set-of-tables-with-glasses-and-plates-on-them-uX1tJgpDJqs" },
  },
  'obsluga': {
    src: '/img/obsluga.jpg',
    width: 1600,
    height: 1067,
    alt: "Kelner stawia talerz na stole ze świecą i kieliszkiem wina",
    blurDataURL:
      'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAwAgCdASoQAAsAA4BaJYgCdAYwTGaEKNkMAAD+T2INEWq1/fH4c5FGleHLjGAV4xF1Rw7eI8Rql0vgl/g8LxXotXsamzktsbNbKSxFYyAX6l1aksfXgVwfycy2f57yUvEAAE4oIV5bAuMZksoAAA==',
    credit: { author: "Louis Hansel", href: "https://unsplash.com/photos/person-holding-plate-Pcq4akUeU68" },
  },
  'ogien': {
    src: '/img/ogien.jpg',
    width: 1400,
    height: 1750,
    alt: "Płomień buchający z patelni na kuchni restauracyjnej",
    blurDataURL:
      'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAACQAwCdASoQABQAPu1iqU2ppaOiMAgBMB2JbACdACHQiGZLVjtgAP7uhlbpk8NwOz3oQCtx1raif05Kftuq2+oyLqS35+bdes1H9Uolo6qEoBO8+txpAxKhKF2rNVvTqBc/LVgDMf2sn+6ydbs5WN5KbypcIXYESOde46qvKtO8IqwAQAA=',
    credit: { author: "Max Griss", href: "https://unsplash.com/photos/a-large-pot-on-a-stove-with-flames-in-it-TwGTnEwSawI" },
  },
  'pierogi': {
    src: '/img/pierogi.jpg',
    width: 1400,
    height: 788,
    alt: "Pierogi ze skwarkami i sosem czosnkowym na białym talerzu",
    blurDataURL:
      'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAQCdASoQAAkAA4BaJbACdAEO54cHcRAAzI07fLXT/eWIncXHP6w36Uu+XyvccsqzYLGRcsGvmJQXzylkSUpXKEOy5UM43s40VOWwUey/RTCkEJ1S9vDnRXS7GxQAAAA=',
    credit: { author: "Eugene Kucheruk", href: "https://unsplash.com/photos/a-plate-of-food-z9JWq7pr5QE" },
  },
  'piwonie': {
    src: '/img/piwonie.jpg',
    width: 1400,
    height: 933,
    alt: "Bukiet różowych piwonii z gałązkami eukaliptusa",
    blurDataURL:
      'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQAgCdASoQAAsAA4BaJYgCdAEJ7fma59YIAP7CTyUma9j0zvKjCM+FlROsP35SAoDgiDR//8br3YgrCqu5uOtnbwq4YEluXbQPhJeLlzXYUSUcCAA=',
    credit: { author: "Bonnie Kittle", href: "https://unsplash.com/photos/close-up-photo-of-pink-petaled-flowers-bouquet-BjvINSPxoOc" },
  },
  'sala-glowna': {
    src: '/img/sala-glowna.jpg',
    width: 2400,
    height: 3600,
    alt: "Główna sala restauracji: kryształowy żyrandol i bukiet lilii pośrodku",
    blurDataURL:
      'data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAADQBACdASoQABgAPu1iqU2ppaOiMAgBMB2JbACdMoMrZ0k925pB04CJA0P16Gl2IAD+fhUy7Ej1xUENLNK47COihcAhqwkV99ycIoUDj6L+8WkHn3mdYLwav9R6yaKquCbzR6ZPI1eunZURwvKBDzHrgOv2DAkVnFzfxJK6WoF+Dvb/V/xmoBKK/bknT669f1mUwkmd7c3t/deh10l4d+cowEfFsQYC6CS+g9q/dgb+HwAA',
    credit: { author: "Doon _MUC", href: "https://unsplash.com/photos/elegant-chandelier-lights-a-luxurious-interior-with-floral-centerpiece--ubCiSPFlYM" },
  },
  'stol-dlugi': {
    src: '/img/stol-dlugi.jpg',
    width: 1800,
    height: 1200,
    alt: "Długi stół nakryty do przyjęcia, świece i kwiaty w jednej linii",
    blurDataURL:
      'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAABQAgCdASoQAAsAA4BaJYgCdH8AGBwT5rdg0wAA/vhVAtaS7JaxbqjOXys3HFhJZTt8atR+L6vfFbBcGm/dJy4Uigkr13SRGOcpnOdQzuAAAA==',
    credit: { author: "M F", href: "https://unsplash.com/photos/white-and-green-ceramic-plates-on-brown-wooden-dining-table-fb0_wj2MZk4" },
  },
  'stol-kwiaty': {
    src: '/img/stol-kwiaty.jpg',
    width: 1600,
    height: 2400,
    alt: "Stolik z białym obrusem, kieliszkami i różowymi daliami",
    blurDataURL:
      'data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAACQBACdASoQABgAPu1iqU2ppaOiMAgBMB2JQBOmUAS4AvULWsDio3v/NmvAdYAA/vQqDNPo92W6qcJVAciLuZZLsPUmfhmjIloznqFlVCSm74UOymd4ctt+r9hkCmMMmpEv44z+DJ+1oZP5jpIT/4IrYpBWXCAzUAsrY3f6+nNfVpjn13B3H4SWcfKN1JX1Dbw6Ko5gQgGqB0ax0s/ACjzY5eYM2UJ7RghD2zAagAA=',
    credit: { author: "Adam Tamasi", href: "https://unsplash.com/photos/restaurant-tables-set-with-flowers-and-wine-glasses-oUWWqr0PRVg" },
  },
  'szarlotka': {
    src: '/img/szarlotka.jpg',
    width: 1400,
    height: 2101,
    alt: "Domowe ciasto z jabłkami obsypane cukrem pudrem",
    blurDataURL:
      'data:image/webp;base64,UklGRsoAAABXRUJQVlA4IL4AAACwBACdASoQABgAPu1iqU2ppaQiMAgBMB2JZACdMoMYA0b5WZdsTnh2slfbFL+8AP6e7orm2ecMPBppQa8/OJ81ii2MzULkbS4SyFqrxf5GTxgRXO7vt8ZAePXnIrGfUY7q8BVEJfSr3CQgdsi84VQXv7f84FzqUqHea1KOfedScRKLVmvLBxqeuSsGE1Z9SscoGu2mYpxN2Gg45zz9pKfKzOr8tQPl8c2PHmD+LwhMzFBGDApQbBrBt582TgAA',
    credit: { author: "Julia Peretiatko", href: "https://unsplash.com/photos/baked-bread-platter-RlAJf1o9z3E" },
  },
  'szefowa': {
    src: '/img/szefowa.jpg',
    width: 1200,
    height: 1800,
    alt: "Kucharka polewa sosem pieczeń leżącą na drewnianej desce",
    blurDataURL:
      'data:image/webp;base64,UklGRq4AAABXRUJQVlA4IKIAAAAQBACdASoQABgAPu1iqU2ppaOiMAgBMB2JYwC2yBDh4w1g+4wxSWzcAAD0WpGE0+Ud4q03PKxsHl1dFJfzvlnftYrbYRLGDpnWxVFPpzkDgYxYCjw6upVYb7nLoRZgdjmfhUGDydNQOGIlki4h4sfeGKN/Dm9BVRraE0JWNy/gKzkebBi2sNaYmJ/8d3MOSJ8U45MZxUaRQHCEbRw6OloAAAA=',
    credit: { author: "Vitor Monthay", href: "https://unsplash.com/photos/woman-in-white-long-sleeve-shirt-holding-silver-fork-673jcnrm8bM" },
  },
  'wino': {
    src: '/img/wino.jpg',
    width: 1400,
    height: 2100,
    alt: "Rząd kieliszków na długim stole, w tle ciemna róża",
    blurDataURL:
      'data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAABwBACdASoQABgAPu1iqU2ppaQiMAgBMB2JYwCdMoAlxRf6GA9wYSeGy6nw4AD+8MaGqWJPivFi4Q8SqCsi5w3VO6KKerRZlTfbAZmQH4x5RIdlMyUckDa77tr6SzV2yED32meZibdHNY4W4Eyx4+97tDZ+QzOQeob3pnhmigzaLAFOMD/lcenTndhJE/4fZX7CXzK9gL52uDrSCVzFwAAA',
    credit: { author: "Fabio Sangregorio", href: "https://unsplash.com/photos/clear-wine-glasses-on-table-ARIBGQwxwwc" },
  },
  'wnetrze': {
    src: '/img/wnetrze.jpg',
    width: 1800,
    height: 2700,
    alt: "Wnętrze restauracji z ciemnego drewna, nakryte stoliki",
    blurDataURL:
      'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAwBACdASoQABgAPu1iqU2ppaOiMAgBMB2JQBOl65Azo6Yau3TMxs9eOAAA/vF66ermDZBeKrba4UB0rxqJbf4QyG3oyDQdDn3ymapliMF84CqItFgXAzi6K9hOjyP81w38pCv2ueekxDVaPnhUNj6/arW06Th48H0kDTqPXajoemxjgAA=',
    credit: { author: "Miguel Joya", href: "https://unsplash.com/photos/a-wooden-table-with-a-white-plate-on-top-of-it-GJzCc1IfP5g" },
  },
  'wydawka': {
    src: '/img/wydawka.jpg',
    width: 2000,
    height: 1173,
    alt: "Ręce kucharzy układające dania na talerzach przy wydawce",
    blurDataURL:
      'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQAgCdASoQAAkAA4BaJQBOkCYwUhOem7y7agAA/vd9n78RZOXd2kZ+aN1Jnk8WMXQz4MqK/5sQ11dNnVReRXT149fPMQ2e1ooNNkXQVMV/o8M2QQBYVa/1iPOHZ1YsgAA=',
    credit: { author: "Fabrizio Magoni", href: "https://unsplash.com/photos/person-preparing-cooked-dish-boaDpmC-_Xo" },
  },
} as const satisfies Record<string, Photo>

/**
 * Next dokleja `basePath` do stron i do /_next/, ale NIE do plikow z public/ —
 * to trzeba zrobic recznie. Bez prefiksu optymalizator next/image dostaje
 * `/img/cos.jpg`, szuka tego w korzeniu domeny (gdzie stoi wizytowka, nie demo)
 * i zwraca 400 "The requested resource isn't a valid image".
 * Wartosc musi byc taka sama jak `basePath` w next.config.ts.
 */
const BASE_PATH = '/piwonia'

export const photos = Object.fromEntries(
  Object.entries(zdjeciaBezPrefiksu).map(([klucz, zdjecie]) => [
    klucz,
    { ...zdjecie, src: `${BASE_PATH}${zdjecie.src}` },
  ]),
) as { readonly [K in keyof typeof zdjeciaBezPrefiksu]: Photo }

export type PhotoKey = keyof typeof photos
