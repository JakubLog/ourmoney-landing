type Props = {
  children: React.ReactNode;
  /** Ton tla sekcji - decyduje o kolorze tekstu */
  tone?: 'light' | 'dark';
  /** Wysrodkowany lead (naglowek nad kolumnami) vs wyrownany do lewej (naglowek w kolumnie) */
  align?: 'center' | 'left';
  className?: string;
};

/**
 * Jednolity subheader (lead) pod kazdym H2 na landingu.
 * Trzyma spojna typografie i szerokosc miary - nie duplikujemy klas po sekcjach.
 */
export function SectionLead({ children, tone = 'light', align = 'center', className = '' }: Props) {
  const toneClass = tone === 'dark' ? 'text-white/60' : 'text-dark/60';
  const alignClass = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl';

  return (
    <p className={`text-base leading-relaxed ${toneClass} ${alignClass} ${className}`}>
      {children}
    </p>
  );
}
