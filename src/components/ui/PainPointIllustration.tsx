import type { CSSProperties } from 'react';

type Kind = 'split' | 'argument' | 'plans';

type Props = {
  kind: Kind;
  className?: string;
};

/** Opoznienie danego elementu w choreografii draw-in (globals.css, `--d`). */
function at(ms: number): CSSProperties {
  return { '--d': `${ms}ms` } as CSSProperties;
}

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
 * Animacje (CSS w globals.css, sekcja "PainPoints - karty + ilustracje"):
 * - `.il-line` + `pathLength={1}`: kreska rysuje sie po wejsciu karty w viewport
 *   (stroke-dashoffset 1 -> 0), kolejnosc wg `--d` (helper `at`),
 * - `.il-pop`: akcent wyskakuje na koncu sekwencji,
 * - `.il-fade`: elementy, ktorych nie da sie "narysowac" (przerywana sciezka) - tylko fade,
 * - grupy `.il-*` z hoverem karty: waga sie kolysze, dymki sie rozchodza, proporzec faluje.
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
      className={`pain-illo pain-illo--${kind} size-16 md:size-20 ${className}`}
    >
      {kind === 'split' && <SplitScales />}
      {kind === 'argument' && <ArgumentBubbles />}
      {kind === 'plans' && <PlansFlag />}
    </svg>
  );
}

/** Waga szalkowa z nierownymi szalkami - szalka z moneta opada. Hover: kolysanie belki. */
function SplitScales() {
  return (
    <>
      {/* slupek + stopa + galka osi (statyczne) */}
      <path className="il-line" pathLength={1} d="M32 25.5 V54" style={at(300)} />
      <path className="il-line" pathLength={1} d="M23 54 H41" style={at(380)} />
      <circle className="il-line" pathLength={1} cx="32" cy="23" r="2.4" style={at(440)} />

      {/* belka + szalki obracaja sie wokol osi (32,23) na hover */}
      <g className="il-scales__beam">
        <path className="il-line" pathLength={1} d="M6 18 L58 28" style={at(0)} />

        {/* lewa szalka - wyzej, pusta */}
        <path className="il-line" pathLength={1} d="M9 18.6 V29" style={at(140)} />
        <path className="il-line" pathLength={1} d="M21 20.9 V29" style={at(140)} />
        <path className="il-line" pathLength={1} d="M7 29 Q15 35.5 23 29" style={at(220)} />

        {/* prawa szalka - nizej, obciazona */}
        <path className="il-line" pathLength={1} d="M43 25.1 V38" style={at(140)} />
        <path className="il-line" pathLength={1} d="M57 27.8 V38" style={at(140)} />
        <path className="il-line" pathLength={1} d="M41 38 Q50 44.5 59 38" style={at(220)} />

        {/* AKCENT: moneta na ciezszej szalce */}
        <circle className="il-pop" cx="50" cy="34.4" r="3.6" fill="var(--color-accent)" style={at(560)} />
      </g>
    </>
  );
}

/** Dwie rozminiete dymki czatu z liniami tekstu, miedzy nimi iskra napiecia. Hover: dymki sie rozchodza. */
function ArgumentBubbles() {
  return (
    <>
      {/* dymka 1 - lewa gora, ogonek w dol-lewo */}
      <g className="il-bubble il-bubble--a">
        <rect className="il-line" pathLength={1} x="4" y="8" width="26" height="16.5" rx="5.5" style={at(0)} />
        <path className="il-line" pathLength={1} d="M9.5 24.5 L7 30 L15.5 24.5" style={at(160)} />
        <path className="il-line" pathLength={1} d="M10 14 H24" style={at(220)} />
        <path className="il-line" pathLength={1} d="M10 19 H19" style={at(280)} />
      </g>

      {/* dymka 2 - prawa dol, ogonek w dol-prawo */}
      <g className="il-bubble il-bubble--b">
        <rect className="il-line" pathLength={1} x="34" y="36" width="26" height="16.5" rx="5.5" style={at(240)} />
        <path className="il-line" pathLength={1} d="M54.5 52.5 L57 58 L48.5 52.5" style={at(400)} />
        <path className="il-line" pathLength={1} d="M40 42 H54" style={at(460)} />
        <path className="il-line" pathLength={1} d="M40 47 H49" style={at(520)} />
      </g>

      {/* AKCENT: zygzak napiecia w szczelinie miedzy dymkami */}
      <g className="il-zap">
        <path
          className="il-pop"
          d="M35 20.5 L27 31.5 H31.8 L29.5 41.5 L37.5 29 H32 Z"
          fill="var(--color-accent)"
          style={at(640)}
        />
      </g>
    </>
  );
}

/** Flaga celu na wzgorzu, do niej przerywana sciezka od pinezki „tu jestescie". Hover: proporzec faluje, kreski sciezki ida do przodu. */
function PlansFlag() {
  return (
    <>
      {/* grunt + wzgorze */}
      <path className="il-line" pathLength={1} d="M3 56 H61" style={at(0)} />
      <path className="il-line" pathLength={1} d="M5 56 Q32 20 59 56" style={at(120)} />

      {/* pinezka startu - „tu jestescie" */}
      <circle className="il-line" pathLength={1} cx="12.5" cy="50.5" r="2.4" style={at(300)} />
      <path className="il-line" pathLength={1} d="M12.5 52.9 V56" style={at(340)} />

      {/* sciezka - przerywana, bo droga jeszcze nieprzebyta; dasharray w jednostkach pathLength */}
      <path
        className="il-fade il-dash"
        pathLength={1}
        d="M16 55 C20 51.5 22 49 26 45.5 C28.5 43.7 30.5 40.5 32 38"
        strokeDasharray="0.14 0.16"
        style={at(420)}
      />

      {/* maszt */}
      <path className="il-line" pathLength={1} d="M32 38 V14" style={at(480)} />

      {/* AKCENT: proporzec - faluje wokol masztu */}
      <g className="il-pennant">
        <path className="il-pop" d="M32 15 L46 19.5 L32 24 Z" fill="var(--color-accent)" style={at(680)} />
      </g>
    </>
  );
}
