import type { LucideIcon } from 'lucide-react';

type Props = {
  children: React.ReactNode;
  /** Delikatna ikona przed tekstem - dobrana do tematu sekcji */
  icon: LucideIcon;
  /** Kolor tekstu (i ikony, przez currentColor) - zalezy od tla sekcji */
  className?: string;
};

/**
 * Jednolity nadtytul (eyebrow) nad H2 sekcji landingu: mala ikona + tekst
 * kapitalikami. Wysrodkowany, bo wszystkie naglowki sekcji stoja na srodku.
 */
export function SectionEyebrow({ children, icon: Icon, className = 'text-dark/60' }: Props) {
  return (
    <p className={`mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] ${className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} aria-hidden="true" />
      {children}
    </p>
  );
}
