'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';

type Feature = { title: string; description: string };

export function FeaturesSection() {
  const t = useTranslations('HomePage.features');
  const items = t.raw('items') as Feature[];
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header — left aligned */}
        <div className="max-w-lg mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-[#141414] leading-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-[#141414]/60 text-sm leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Full-width accordion */}
        <div className="mb-0">
          {items.map((item, i) => (
            <div key={i} className="border-t border-[#141414]/10">
              <button
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-[#141414] text-base group-hover:text-black transition-colors">
                  {item.title}
                </span>
                {open === i
                  ? <ChevronUp size={16} className="shrink-0 text-[#141414]/50" />
                  : <ChevronDown size={16} className="shrink-0 text-[#141414]/50" />
                }
              </button>
              {open === i && (
                <p className="pb-5 text-sm text-[#141414]/60 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              )}
            </div>
          ))}
          <div className="border-t border-[#141414]/10" />
        </div>

        {/* Full-width image below */}
        <div className="relative w-full aspect-[16/7] mt-10 rounded-2xl overflow-hidden">
          <Image
            src="https://framerusercontent.com/images/df2Hx2qPE56KLCmPTWbkqGQyng.jpg"
            alt="OurMoney app in use"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
