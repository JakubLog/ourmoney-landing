type Kind = 'split' | 'argument' | 'plans';

type Props = {
  kind: Kind;
  className?: string;
};

/**
 * Autorskie spot-illustrations dla kart w PainPointsSection.
 *
 * Zasady rysunku (trzymaj je przy kazdej nowej ikonie tej rodziny):
 * - siatka 64x64, jedna kreska `currentColor` o grubosci 1.75, zaokraglone konce i laczenia,
 * - kolor kreski dziedziczony z kontenera (`text-dark`) - zero hexow w TSX,
 * - dokladnie JEDEN akcent limonkowy (`--color-accent`) jako plama z obrysem currentColor;
 *   limonka na jasnym tle ma kontrast 1.3:1, wiec obrys jest tu nosnikiem czytelnosci,
 * - podobna masa optyczna: kazdy rysunek zajmuje ~x 4..60 i ~y 9..57, bez wypelnien poza akcentem.
 *
 * Dekoracja - `aria-hidden`, tresc niosa naglowek i dialog karty.
 */
export function PainPointIllustration({ kind, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={56}
      height={56}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-16 md:size-20 ${className}`}
    >
      {kind === 'split' && <SplitScales />}
      {kind === 'argument' && <ArgumentBubbles />}
      {kind === 'plans' && <PlansFlag />}
    </svg>
  );
}

/** Waga szalkowa z nierownymi szalkami - szalka z moneta opada. */
function SplitScales() {
  return (
    <>
      {/* belka (przechylona) + slupek + stopa */}
      <path d="M6 18 L58 28" />
      <path d="M32 23 V54" />
      <path d="M25 54 H39" />

      {/* lewa szalka - wyzej, pusta */}
      <path d="M9 18.6 V29" />
      <path d="M21 20.9 V29" />
      <path d="M7 29 Q15 35.5 23 29" />

      {/* prawa szalka - nizej, obciazona */}
      <path d="M43 25.1 V38" />
      <path d="M57 27.8 V38" />
      <path d="M41 38 Q50 44.5 59 38" />

      {/* AKCENT: moneta na ciezszej szalce */}
      <circle cx="50" cy="34.4" r="3.5" fill="var(--color-accent)" />
    </>
  );
}

/** Dwie rozminiete dymki czatu, miedzy nimi iskra napiecia. */
function ArgumentBubbles() {
  return (
    <>
      {/* dymka 1 - lewa gora, ogonek w dol-lewo */}
      <rect x="4" y="8" width="26" height="16.5" rx="5.5" />
      <path d="M9.5 24.5 L7 30 L15.5 24.5" />

      {/* dymka 2 - prawa dol, ogonek w dol-prawo */}
      <rect x="34" y="36" width="26" height="16.5" rx="5.5" />
      <path d="M54.5 52.5 L57 58 L48.5 52.5" />

      {/* AKCENT: zygzak napiecia w szczelinie miedzy dymkami */}
      <path
        d="M35 20.5 L27 31.5 H31.8 L29.5 41.5 L37.5 29 H32 Z"
        fill="var(--color-accent)"
      />
    </>
  );
}

/** Flaga celu na wzgorzu, do niej przerywana sciezka - plan „na kiedys". */
function PlansFlag() {
  return (
    <>
      {/* grunt + wzgorze */}
      <path d="M3 56 H61" />
      <path d="M5 56 Q32 20 59 56" />

      {/* sciezka - przerywana, bo droga jeszcze nieprzebyta */}
      <path
        d="M13 56 C18 51.5 21 49 26 45.5 C28.5 43.7 30.5 40.5 32 38"
        strokeDasharray="4 4.5"
      />

      {/* maszt */}
      <path d="M32 38 V14" />

      {/* AKCENT: proporzec */}
      <path d="M32 15 L46 19.5 L32 24 Z" fill="var(--color-accent)" />
    </>
  );
}
