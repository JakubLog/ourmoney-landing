'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { InvertDotButton } from '@/components/ui/InvertDotButton';

type Feature = { title: string; description: string };
type Props = { locale: string };

export function FeaturesSection({ locale }: Props) {
  const t = useTranslations('HomePage.features');
  const tCommon = useTranslations('Common');
  const items = t.raw('items') as Feature[];
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header row: title + CTA */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
          <div className="max-w-lg">
            <h2 className="text-4xl md:text-5xl text-dark leading-tight mb-4">
              {t('title')}
            </h2>
            <p className="text-dark/50 text-sm leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
          <InvertDotButton
            href={tCommon('appUrl')}
            className="inline-block bg-accent text-black font-semibold px-8 py-4 rounded-full text-sm shrink-0 self-start"
            location="features"
            locale={locale}
          >
            {tCommon('startFree')}
          </InvertDotButton>
        </div>

        {/* Two-column: accordion + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Numbered accordion */}
          <div>
            {items.map((item, i) => (
              <div key={item.title} className="border-t border-dark/10">
                <button
                  className="w-full flex items-center gap-4 py-5 text-left group cursor-pointer"
                  onClick={() => setOpen(open === i ? -1 : i)}
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
            <div className="border-t border-dark/10" />
          </div>

          {/* Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/bg-section-1.avif"
              alt="OurMoney app in use"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
