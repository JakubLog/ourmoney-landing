'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Feature = { title: string; description: string };
type Props = { locale: string };

const FEATURE_IMAGES = [
  '/app-screens/inteligentny-podzial-wydatkow.JPG',
  '/app-screens/wspolne-cele-finansowe.JPG',
  '/app-screens/moje-twoje-nasze-wydatki.JPG',
];

const CYCLE_DURATION = 5000;

export function FeaturesSection({ locale }: Props) {
  const t = useTranslations('HomePage.features');
  const tCommon = useTranslations('Common');
  const items = t.raw('items') as Feature[];
  const [open, setOpen] = useState<number>(0);
  const [animKey, setAnimKey] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const activeImage = open >= 0 && open < FEATURE_IMAGES.length
    ? FEATURE_IMAGES[open]
    : FEATURE_IMAGES[0];

  const goToNext = useCallback(() => {
    setImagesPreloaded(true);
    setOpen((prev) => (prev + 1) % items.length);
    setAnimKey((k) => k + 1);
  }, [items.length]);

  const handleClick = useCallback((i: number) => {
    setImagesPreloaded(true);
    setOpen(i);
    setAnimKey((k) => k + 1);
  }, []);

  return (
    <section className="group/features bg-white py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Two-column: accordion + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: header + accordion */}
          <div>
            <ScrollReveal className="mb-12 md:mb-16">
              <h2 className="text-4xl md:text-5xl text-dark leading-tight mb-4">
                {t('title')}
              </h2>
              <p className="text-dark/50 text-sm leading-relaxed">
                {t('subtitle')}
              </p>
            </ScrollReveal>
            {items.map((item, i) => (
              <div key={item.title} className="relative">
                {/* Border top */}
                <div className="h-px bg-dark/10" />
                {/* Progress bar — only on active item */}
                {open === i && (
                  <div
                    key={animKey}
                    className="absolute top-0 left-0 h-px bg-accent origin-left group-hover/features:[animation-play-state:paused]"
                    style={{
                      animation: `progressFill ${CYCLE_DURATION}ms linear forwards`,
                      width: '100%',
                    }}
                    onAnimationEnd={goToNext}
                  />
                )}
                <button
                  className="w-full flex items-center gap-4 py-5 text-left group cursor-pointer"
                  onClick={() => handleClick(i)}
                  aria-expanded={open === i}
                >
                  <span className="text-dark/30 text-sm font-medium tabular-nums w-8 shrink-0">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span className={`font-medium text-base flex-1 transition-colors ${open === i ? 'text-dark' : 'text-dark/40'}`}>
                    {item.title}
                  </span>
                  {open === i && (
                    <ArrowRight size={18} className="shrink-0 text-dark" />
                  )}
                </button>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: open === i ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.25s ease-out',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p className="pb-5 pl-12 text-sm text-dark/50 leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="h-px bg-dark/10" />
            <div className="mt-8">
              <InvertDotButton
                href={tCommon('appUrl')}
                className="inline-block bg-accent text-black font-semibold px-8 py-4 rounded-full text-sm"
                location="features"
                locale={locale}
              >
                {t('cta')}
              </InvertDotButton>
            </div>
          </div>

          {/* App screenshot in iPhone frame */}
          <ScrollReveal animation="slide-right" className="flex justify-center">
            <div className="relative w-full max-w-[320px]">
              {/* Phone frame */}
              <div className="relative bg-dark rounded-[3rem] p-[10px] shadow-2xl">
                {/* Dynamic Island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-dark w-[100px] h-[30px] rounded-b-2xl" />
                {/* Screen */}
                <div className="aspect-[9/19.5] rounded-[2.5rem] overflow-hidden bg-white p-5">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                    {FEATURE_IMAGES.map((src, i) => {
                      const isActive = activeImage === src;
                      if (!imagesPreloaded && !isActive) return null;
                      return (
                        <Image
                          key={src}
                          src={src}
                          alt={items[i]?.title ?? 'OurMoney app'}
                          fill
                          className="object-cover transition-opacity duration-300"
                          style={{ opacity: isActive ? 1 : 0 }}
                          sizes="320px"
                          loading={i === 0 ? undefined : 'lazy'}
                          priority={i === 0}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
