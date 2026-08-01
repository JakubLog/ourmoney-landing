'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Check } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

export function BeforeAfterSection({ locale }: Props) {
  const t = useTranslations('HomePage.beforeAfter');
  const before = t.raw('before') as string[];
  const after = t.raw('after') as string[];
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight mb-4">
            {t('title')}{' '}
            <span className="relative inline-block">
              <svg
                className="absolute -left-2 -right-2 -bottom-1 top-0 w-[calc(100%+16px)] h-full origin-left"
                style={{
                  transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.6s',
                }}
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 45 C20 50, 40 52, 60 48 C80 44, 100 38, 130 36 C150 34, 175 36, 192 40 C196 28, 194 18, 188 14 C170 8, 140 6, 110 8 C80 10, 50 14, 25 18 C12 20, 4 28, 8 45Z"
                  className="fill-accent/25"
                />
              </svg>
              <span className="relative">{t('titleHighlight')}</span>
            </span>{' '}
            {t('titleEnd')}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <ScrollReveal>
            <div className="rounded-2xl bg-white border border-dark/10 p-8 md:p-10 h-full">
              <h3 className="text-dark/40 text-sm font-semibold uppercase tracking-wider mb-6">
                {t('beforeLabel')}
              </h3>
              <ul className="space-y-4 list-none p-0 m-0">
                {before.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-dark/60 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* After */}
          <ScrollReveal delay={100}>
            <div className="rounded-2xl bg-dark p-8 md:p-10 h-full">
              <h3 className="text-accent text-sm font-semibold uppercase tracking-wider mb-6">
                {t('afterLabel')}
              </h3>
              <ul className="space-y-4 list-none p-0 m-0">
                {after.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
