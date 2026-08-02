'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { startHref } from '@/lib/appLinks';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';

type Feature = { title: string; description: string };
type Props = { locale: string };

const FEATURE_IMAGES = [
  '/app-screens/strona-glowna.png',
  '/app-screens/dodawaj-prosto-wydatki.png',
  '/app-screens/ustawienia.png',
  '/app-screens/koperty.png',
  '/app-screens/importuj-z-banku.png',
];

const FEATURE_BLUR: Record<string, string> = {
  '/app-screens/dodawaj-prosto-wydatki.png':
    'data:image/webp;base64,UklGRloCAABXRUJQVlA4WAoAAAAgAAAACwAAGwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggbAAAAHADAJ0BKgwAHAAumWi0WiKoKCgIAJhLOAAFzu41djuHav9IAAD+9CAtV8jHTgl/yn5fbPjYGP881z9ew3+GqCKVgs6Z6fAvir0AEdj3eDpnZMlH9cdnKf0Ur+K06a7aKu/Ot8lh76ACBAAAAA==',
  '/app-screens/koperty.png':
    'data:image/webp;base64,UklGRlQCAABXRUJQVlA4WAoAAAAgAAAACwAAGwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggZgAAANADAJ0BKgwAHAA+0VSjS6gkoyGwCAEAGglnAAPjYg3wehcULGeQAAD+9M7eiejlz2pHrTgO8zI2UZUyLM2tmFq6lY9fiTurWXsEfw+BuO2T0MbBva+nDcP0fxYTLzXluL291MAAAA==',
  '/app-screens/importuj-z-banku.png':
    'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAwAwCdASoMABsAPzmEuVOvKKWkMAgB4CcJZwABNGD6E+AAAP7w7lKVS+nUuXdimkIvQTn5vmPagAAA',
  '/app-screens/strona-glowna.png':
    'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAACQAwCdASoMABwAPzmGuVOvKKWisAgB4CcJYgAAXKKmKAsXviAAAP7T21xgMMOP0g+25WjwBwH/YaAklYrCCfyCclfW7nyqHzcl8gW2lesVTdocJ4AAAA==',
  '/app-screens/ustawienia.png':
    'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAAAQAwCdASoMABsAPzmGuVOvKSWisAgB4CcJZwAAerOYEwAA/u3wxV/AyAd/6O69X/xKa2RWgAA=',
};

const CYCLE_DURATION = 5000;

export function FeaturesSection({ locale }: Props) {
  const t = useTranslations('HomePage.features');
  const items = t.raw('items') as Feature[];
  const [open, setOpen] = useState<number>(0);
  const [animKey, setAnimKey] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  // Autocykl leci tylko do pierwszej interakcji - hover pauzuje wylacznie na
  // desktopie, wiec bez tego na mobile opis podmienia sie w trakcie czytania
  const [autoplay, setAutoplay] = useState(true);

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
    setAutoplay(false);
  }, []);

  return (
    <section data-section-view="features" className="group/features bg-white py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Two-column: accordion + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: header + accordion */}
          <div>
            <ScrollReveal className="mb-12 md:mb-16">
              <h2 className="font-display text-4xl md:text-5xl text-dark leading-tight mb-6">
                {t('title')}
              </h2>
              <SectionLead align="left">{t('subtitle')}</SectionLead>
            </ScrollReveal>
            <ol className="list-none p-0 m-0">
              {items.map((item, i) => (
                <li key={item.title} className="relative">
                  {/* Border top */}
                  <div className="h-px bg-dark/10" />
                  {/* Progress bar - only on active item, dopoki trwa autocykl */}
                  {open === i && autoplay && (
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
                  {open === i && !autoplay && (
                    <div className="absolute top-0 left-0 h-px w-full bg-accent" />
                  )}
                  {/* h3 opakowuje przycisk, a nie odwrotnie - <button> przyjmuje
                      tylko tresc frazowa, wiec naglowek w srodku bylby niepoprawny */}
                  <h3>
                    <button
                      className="w-full flex items-center gap-4 py-6 text-left group cursor-pointer"
                      onClick={() => handleClick(i)}
                      aria-expanded={open === i}
                    >
                      <span
                        aria-hidden="true"
                        className="text-dark/30 text-sm font-medium tabular-nums w-8 shrink-0"
                      >
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className={`font-medium text-base flex-1 transition-colors ${open === i ? 'text-dark' : 'text-dark/40'}`}>
                        {item.title}
                      </span>
                      {open === i && (
                        <ArrowRight size={18} className="shrink-0 text-dark" />
                      )}
                    </button>
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: open === i ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.25s ease-out',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <p className="pb-6 pl-12 text-sm text-dark/50 leading-relaxed max-w-md">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="h-px bg-dark/10" />
            <div className="mt-8">
              <InvertDotButton
                href={startHref(locale)}
                className="inline-block bg-accent text-black font-semibold px-8 py-4 rounded-full text-sm"
                location="features"
                locale={locale}
              >
                {t('cta')}
              </InvertDotButton>
            </div>
          </div>

          {/* App screenshot in iPhone 17 Pro Max frame */}
          <ScrollReveal animation="slide-right" className="flex justify-center overflow-x-clip">
            <div className="relative w-full max-w-[280px] sm:max-w-[310px]">
              {/* Side buttons */}
              <div className="absolute -left-[2px] top-[15%] w-[3px] h-6 bg-neutral-700 rounded-l-sm" />
              <div className="absolute -left-[2px] top-[22%] w-[3px] h-11 bg-neutral-700 rounded-l-sm" />
              <div className="absolute -left-[2px] top-[30%] w-[3px] h-11 bg-neutral-700 rounded-l-sm" />
              <div className="absolute -right-[2px] top-[24%] w-[3px] h-16 bg-neutral-700 rounded-r-sm" />
              {/* Titanium ring */}
              <div className="relative rounded-[3.4rem] bg-gradient-to-b from-neutral-500 via-neutral-700 to-neutral-500 p-[3px] shadow-2xl">
                {/* Bezel */}
                <div className="bg-black rounded-[3.2rem] p-[9px]">
                  {/* Screen */}
                  <div className="relative rounded-[2.7rem] overflow-hidden bg-screen">
                    {/* Status bar */}
                    <div className="relative z-20 h-11 bg-screen flex items-end justify-between px-7 pb-1.5">
                      <span className="text-dark text-[13px] font-semibold leading-none tabular-nums">
                        9:41
                      </span>
                      {/* Dynamic Island */}
                      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[92px] h-[26px] bg-black rounded-full flex items-center justify-end pr-2">
                        <div className="w-[10px] h-[10px] rounded-full bg-dark-2 ring-1 ring-[#2c2c2e]" />
                      </div>
                      <span className="flex items-center gap-1" aria-hidden="true">
                        {/* Signal */}
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" className="text-dark">
                          <rect x="0" y="7" width="3" height="4" rx="1" />
                          <rect x="4.5" y="4.5" width="3" height="6.5" rx="1" />
                          <rect x="9" y="2" width="3" height="9" rx="1" />
                          <rect x="13.5" y="0" width="2.5" height="11" rx="1" opacity="0.35" />
                        </svg>
                        {/* Wifi */}
                        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" className="text-dark">
                          <path d="M7.5 9.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z" transform="translate(0 -1.5)" />
                          <path d="M4.6 7.2a4.2 4.2 0 0 1 5.8 0l-1.2 1.2a2.5 2.5 0 0 0-3.4 0L4.6 7.2Z" />
                          <path d="M2.2 4.8a7.6 7.6 0 0 1 10.6 0l-1.2 1.2a5.9 5.9 0 0 0-8.2 0L2.2 4.8Z" />
                          <path d="M0 2.5a10.9 10.9 0 0 1 15 0l-1.2 1.2a9.2 9.2 0 0 0-12.6 0L0 2.5Z" opacity="0.9" />
                        </svg>
                        {/* Battery */}
                        <svg width="25" height="12" viewBox="0 0 25 12" className="text-dark">
                          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
                          <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" />
                          <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
                        </svg>
                      </span>
                    </div>
                    {/* App screen - padding-top replaces aspect-ratio for cross-browser h-full support */}
                    <div
                      className="relative mb-4 rounded-b-[2.2rem] overflow-hidden bg-screen"
                      style={{ paddingTop: 'calc(100% * 898 / 391)' }}
                    >
                      {FEATURE_IMAGES.map((src, i) => {
                        const isActive = activeImage === src;
                        if (!imagesPreloaded && !isActive) return null;
                        return (
                          <Image
                            key={src}
                            src={src}
                            alt={items[i]?.title ?? 'OurMoney app'}
                            title={items[i]?.title ?? 'OurMoney app'}
                            fill
                            className="object-cover object-top transition-opacity duration-300"
                            style={{ opacity: isActive ? 1 : 0 }}
                            sizes="(max-width: 640px) 280px, 310px"
                            loading={i === 0 ? undefined : 'lazy'}
                            priority={i === 0}
                            placeholder="blur"
                            blurDataURL={FEATURE_BLUR[src]}
                          />
                        );
                      })}
                    </div>
                    {/* Home indicator */}
                    <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2 z-30 w-[36%] h-[5px] rounded-full bg-black/80" />
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
