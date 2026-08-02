'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect, useState } from 'react';
import { UserPlus, ListChecks, Target } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';

const STEP_ICONS = [UserPlus, ListChecks, Target];

export function HowItWorksSection() {
  const t = useTranslations('HomePage.howItWorks');
  const steps = t.raw('steps') as { title: string; description: string }[];
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
    <section ref={sectionRef} className="bg-surface py-20 md:py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight mb-6">
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
            </span>
          </h2>
          <SectionLead>{t('subtitle')}</SectionLead>
        </ScrollReveal>

        {/* Steps - horizontal with connecting line */}
        <div className="relative">
          {/* Horizontal connecting line */}
          <div
            className="hidden md:block absolute top-8 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(20,20,20,0.1) 15%, rgba(20,20,20,0.1) 85%, transparent)',
            }}
            aria-hidden="true"
          />

          <ol className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i];

              return (
                <li key={i}>
                  <ScrollReveal delay={i * 150}>
                    <div className="group/step flex flex-col items-center text-center cursor-default">
                      {/* Node on the line */}
                      <div className="relative mb-8">
                        {/* Glow pulse on hover */}
                        <div className="absolute inset-0 rounded-2xl rotate-45 bg-accent/0 group-hover/step:bg-accent/20 blur-xl scale-150 transition-all duration-500" />
                        <div className="relative w-16 h-16 rounded-2xl bg-white border border-dark/10 shadow-sm flex items-center justify-center rotate-45 transition-all duration-500 group-hover/step:bg-dark group-hover/step:border-dark group-hover/step:shadow-xl group-hover/step:scale-110">
                          <Icon className="w-6 h-6 text-dark/60 -rotate-45 transition-colors duration-500 group-hover/step:text-accent" aria-hidden="true" />
                        </div>
                      </div>

                      <span className="text-dark/10 font-display text-6xl leading-none mb-2 transition-colors duration-500 group-hover/step:text-accent/40">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-dark text-lg md:text-xl font-medium leading-snug mb-3 transition-transform duration-500 group-hover/step:translate-y-[-2px]">
                        {step.title}
                      </h3>
                      <p className="text-dark/50 text-sm leading-relaxed max-w-xs mx-auto transition-colors duration-500 group-hover/step:text-dark/70">
                        {step.description}
                      </p>
                    </div>
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
