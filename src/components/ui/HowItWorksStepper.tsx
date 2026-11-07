'use client';

import { useEffect, useRef, useState } from 'react';
import { HowItWorksIllustration, type HowItWorksStepKind } from '@/components/ui/HowItWorksIllustration';
import { trackStepSelect } from '@/lib/analytics';

export type HowItWorksStep = {
  kind: HowItWorksStepKind;
  title: string;
  description: string;
};

type Props = {
  steps: HowItWorksStep[];
  stepsLabel: string;
  locale: string;
};

/**
 * Sciezka trzech krokow: wezly z ilustracjami spiete linia, zegar auto-przejscia
 * to pierscien rysowany wokol wezla aktywnego kroku (jedna animacja CSS mierzy czas
 * i pokazuje postep naraz - patrz blok "HowItWorks" w globals.css).
 *
 * Uklad jest celowo POZIOMY (md+) / pionowa os czasu (mobile), a nie "lista + panel":
 * sekcja stoi bezposrednio nad FeaturesSection, ktora jest akordeonem z paskiem postepu
 * po lewej i makieta telefonu po prawej. Dwie takie same kompozycje pod rzad czytaja sie
 * jak jedna rozciagnieta sekcja.
 */
export function HowItWorksStepper({ steps, stepsLabel, locale }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [active, setActive] = useState(0);
  // Pierwszy reczny wybor konczy petle na reszte odslony (wzorem FeaturesSection)
  const [auto, setAuto] = useState(true);

  // Pauza poza viewportem i w ukrytej karcie. Klasa na roocie, nie stan: setState
  // przy kazdym przecieciu viewportu przerysowywalby liste i zerowal pierscien.
  // className roota jest stala, wiec React nigdy nie nadpisze tej klasy.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sync = () => {
      root.classList.toggle('hiw--paused', !visibleRef.current || document.hidden);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(root);
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  // Oba setState siedza w callbackach zdarzen (klik, animationend), nigdy w ciele
  // efektu - regula react-hooks/set-state-in-effect jest w tym repo bledem.
  const goToNext = () => setActive((current) => (current + 1) % steps.length);

  const selectStep = (index: number) => {
    setActive(index);
    setAuto(false);
    trackStepSelect('how_it_works', index + 1, locale);
  };

  return (
    <div ref={rootRef} className="hiw hiw--paused">
      <ol
        role="list"
        aria-label={stepsLabel}
        className="hiw-list m-0 grid list-none gap-0 p-0 md:grid-cols-3"
      >
        {steps.map((step, index) => {
          const isActive = index === active;
          // "Przebyty" liczymy w obrebie biezacego cyklu - powrot do kroku 1 gasi sciezke
          const isVisited = index < active;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.kind} className="group/step flex gap-4 md:flex-col md:gap-0">
              {/* Wezel na sciezce. Mobile: kolumna po lewej, kreska ponizej wezla.
                  Od md: rzad na pelnej szerokosci karty, kreska w bok.
                  Miedzy wezlami stoi krotka kreska odsunieta od obu kol, nie ciagla linia:
                  od md wysrodkowana na granicy kolumn (translate-x-1/2 wchodzi w sasiednia
                  kolumne), na mobile na srodku odstepu do nastepnego wezla. Lewy odstep
                  istnieje tylko po to, zeby wezel stal w srodku kolumny. */}
              <div className="flex shrink-0 flex-col items-center md:w-full md:flex-row">
                <span aria-hidden="true" className="hidden flex-1 md:block" />

                {/* Skalowanie siedzi na kontenerze, nie na samym kole - pierscien
                    musi rosnac razem z wezlem, inaczej odstep miedzy nimi zniknie. */}
                <div className={`hiw-node relative ${isActive ? 'hiw-node--active' : ''}`}>
                  <div
                    className={`hiw-node grid size-16 place-items-center rounded-full border bg-white md:size-24 ${
                      isActive
                        ? 'border-accent-deep/40 shadow-md'
                        : isVisited
                          ? 'border-accent-deep/30'
                          : 'border-dark/8 group-hover/step:border-dark/20'
                    }`}
                  >
                    <HowItWorksIllustration kind={step.kind} size="node" className="text-dark" />
                  </div>

                  {/* Zegar: pierscien jest pod kazdym wezlem, widoczny tylko pod aktywnym.
                      Zmiana kroku nie odmontowuje go, tylko wygasza (opacity w hiw-ring-wrap),
                      wiec domkniety pierscien nie znika skokowo. Animacje restartuje dopiero
                      ponowne dodanie klasy hiw-ring przy nastepnej aktywacji wezla.
                      pathLength=100 normalizuje obwod, wiec ten sam keyframe dziala
                      w obu rozmiarach wezla. */}
                  <svg
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    focusable="false"
                    className={`hiw-ring-wrap pointer-events-none absolute -inset-2 -rotate-90 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="47"
                      pathLength={100}
                      fill="none"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      className={isActive && auto ? 'hiw-ring stroke-accent-deep' : 'stroke-accent-deep'}
                      onAnimationEnd={isActive && auto ? goToNext : undefined}
                    />
                  </svg>
                </div>

                <span
                  aria-hidden="true"
                  className="relative flex w-[1.5px] flex-1 flex-col items-center justify-center md:h-[1.5px] md:w-auto"
                >
                  {!isLast && (
                    <span
                      className={`hiw-seg block h-12 w-[1.5px] rounded-full md:absolute md:top-0 md:right-0 md:h-[1.5px] md:w-20 md:translate-x-1/2 ${
                        isVisited ? 'bg-accent-deep/60' : 'bg-dark/10'
                      }`}
                    />
                  )}
                </span>
              </div>

              {/* Opisy wszystkich krokow sa zawsze widoczne (D1 planu): przelaczenie
                  kroku zmienia wylacznie kolory i transform, wiec CLS jest strukturalnie zero. */}
              <div
                className={`min-w-0 flex-1 text-left md:w-full md:flex-none md:px-4 md:pt-6 md:text-center ${
                  isLast ? '' : 'pb-10 md:pb-0'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`font-display block text-2xl leading-none tabular-nums transition-colors duration-500 ease-out ${
                    isActive ? 'text-accent-deep' : 'text-dark/60'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* h3 opakowuje przycisk, nie odwrotnie - <button> przyjmuje tylko
                    tresc frazowa (ten sam uklad co FeaturesSection) */}
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => selectStep(index)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-describedby={`hiw-step-${index}`}
                    className={`mt-2 w-full cursor-pointer rounded-card text-left text-lg leading-snug font-medium transition-colors duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep md:text-center md:text-xl ${
                      isActive ? 'text-dark' : 'text-dark/60'
                    }`}
                  >
                    {step.title}
                  </button>
                </h3>

                <p
                  id={`hiw-step-${index}`}
                  className={`mt-3 text-sm leading-relaxed transition-colors duration-500 ease-out md:mx-auto md:max-w-xs ${
                    isActive ? 'text-dark/80' : 'text-dark/60'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
