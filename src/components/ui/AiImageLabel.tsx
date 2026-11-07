import { useTranslations } from 'next-intl';

type Props = {
  /**
   * `dot` - mala kropka "AI" na miniaturach bloga (karty wpisow).
   * `label` - napis "Informacja o SI" na duzych zdjeciach, pelna tresc po najechaniu/fokusie.
   */
  variant: 'dot' | 'label';
  /** Pozycja w rogu zdjecia, np. `absolute bottom-4 right-4`. Rodzic musi miec `relative`. */
  className?: string;
  /** Strona, w ktora otwiera sie dymek wariantu `label` - tak, by zmiescil sie w kadrze. */
  tooltipSide?: 'top' | 'bottom';
};

/**
 * Oznaczenie zdjec wygenerowanych przez AI. Dotyczy wszystkich zdjec poza
 * screenami aplikacji - te sa prawdziwe i nie dostaja etykiety.
 */
export function AiImageLabel({ variant, className = '', tooltipSide = 'top' }: Props) {
  const t = useTranslations('Common.aiImage');

  if (variant === 'dot') {
    // Kropka siedzi wewnatrz linku karty - bez fokusu i bez tresci dla czytnikow,
    // zeby nie doklejac sie do nazwy linku. Pelne wyjasnienie daje `title`.
    return (
      <span
        aria-hidden="true"
        title={t('tooltip')}
        className={`z-10 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black/60 px-1.5 text-[10px] font-semibold leading-none tracking-wide text-white backdrop-blur-sm ${className}`}
      >
        {t('dot')}
      </span>
    );
  }

  return (
    // tabIndex: dymek ma sie otwierac takze z klawiatury i po tapnieciu na telefonie
    <span
      tabIndex={0}
      className={`group/ai z-20 inline-flex cursor-help items-center rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${className}`}
    >
      {t('label')}
      {/* Zostaje w drzewie dostepnosci (opacity, nie visibility) - czytnik odczyta pelna informacje */}
      <span
        className={`pointer-events-none absolute right-0 w-56 rounded-xl bg-black/85 px-3 py-2 text-left text-xs font-normal leading-snug text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/ai:opacity-100 group-focus/ai:opacity-100 ${
          tooltipSide === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
      >
        {t('tooltip')}
      </span>
    </span>
  );
}
