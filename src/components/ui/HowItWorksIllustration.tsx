export type HowItWorksStepKind = 'account' | 'expenses' | 'invite';

/** `node` - rysunek w okraglym wezle sciezki krokow, `inline` - maly znacznik w tekscie. */
type Size = 'node' | 'inline';

type Props = {
  kind: HowItWorksStepKind;
  size?: Size;
  className?: string;
};

const SIZE_CLASS: Record<Size, string> = {
  // Wezel ma 64 / 96 px - rysunek wypelnia ok. 60% srednicy, jak w odznace
  node: 'size-10 md:size-14',
  inline: 'size-8 md:size-10',
};

/**
 * Autorskie spot-illustrations dla trzech krokow w HowItWorksSection.
 *
 * Ta sama rodzina rysunku co `PainPointIllustration` - zasady sa wiazace:
 * - siatka 64x64, jedna kreska `currentColor` o grubosci 1.75, zaokraglone konce i laczenia,
 * - kolor kreski dziedziczony z kontenera (`text-dark`) - zero hexow w TSX,
 * - dokladnie JEDEN akcent limonkowy (`--color-accent`) jako plama z obrysem currentColor;
 *   limonka na jasnym tle ma kontrast 1.3:1, wiec obrys jest tu nosnikiem czytelnosci,
 * - podobna masa optyczna: kazdy rysunek zajmuje ~x 5..59 i ~y 7..55, bez wypelnien poza akcentem,
 * - akcent rysowany JAKO OSTATNI - jego nieprzezroczyste wypelnienie ma przykryc kreski pod soba.
 *
 * Grubosc kreski zostaje 1.75 w kazdym rozmiarze: rysunek skaluje sie samopodobnie,
 * wiec w wezle (40 / 56 px) czyta sie jak znak, a nie jak zmniejszona ikona.
 *
 * Dekoracja - `aria-hidden`. Tresc niosa numer, naglowek i opis kroku.
 */
export function HowItWorksIllustration({ kind, size = 'node', className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${SIZE_CLASS[size]} ${className}`}
    >
      {kind === 'account' && <AccountCard />}
      {kind === 'expenses' && <ExpenseReceipt />}
      {kind === 'invite' && <InviteEnvelope />}
    </svg>
  );
}

/** Krok 1 - karta nowego konta z odznaka potwierdzenia. */
function AccountCard() {
  return (
    <>
      {/* karta konta */}
      <rect x="5" y="11" width="54" height="40" rx="6" />

      {/* awatar: glowa + ramiona */}
      <circle cx="21" cy="26" r="5.5" />
      <path d="M13 40 A8 8 0 0 1 29 40" />

      {/* dwa pola formularza - krotsze drugie, zeby karta nie byla symetryczna */}
      <path d="M37 25 H53" />
      <path d="M37 33 H47" />

      {/* AKCENT: odznaka "konto gotowe" na rogu karty */}
      <circle cx="51" cy="47" r="8" fill="var(--color-accent)" />
      <path d="M47.2 47.2 L50 50 L55 44.5" />
    </>
  );
}

/** Krok 2 - paragon z pozycjami i przycisk dodania wydatku. */
function ExpenseReceipt() {
  return (
    <>
      {/* paragon: zaokraglona gora, zabkowany dol */}
      <path d="M8 47 V15 A3 3 0 0 1 11 12 H33 A3 3 0 0 1 36 15 V47 L31.3 50 L26.6 47 L21.9 50 L17.2 47 L12.5 50 Z" />

      {/* pozycje na paragonie */}
      <path d="M14 22 H30" />
      <path d="M14 29 H30" />
      <path d="M14 36 H24" />

      {/* AKCENT: przycisk "dodaj wydatek", wyrownany do srodka paragonu */}
      <rect x="41" y="22" width="18" height="18" rx="5.5" fill="var(--color-accent)" />
      <path d="M50 27.5 V34.5" />
      <path d="M46.5 31 H53.5" />
    </>
  );
}

/** Krok 3 - koperta zaproszenia i wyslane zaproszenie w locie. */
function InviteEnvelope() {
  return (
    <>
      {/* koperta */}
      <rect x="5" y="31" width="30" height="21" rx="3.5" />
      <path d="M6.5 33 L20 42.5 L33.5 33" />

      {/* slad lotu - przerywany, zaproszenie jest juz w drodze */}
      <path d="M36 33 C40 29.5 42 26 43.5 22" strokeDasharray="4 4.5" />

      {/* AKCENT: wyslane zaproszenie */}
      <path d="M56 7 L49.3 26 L45.5 17.4 L37 13.6 Z" fill="var(--color-accent)" />
    </>
  );
}
