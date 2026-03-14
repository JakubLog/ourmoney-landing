'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';

type FAQItem = { question: string; answer: string };

export function FAQSection() {
  const t = useTranslations('HomePage.faq');
  const items = t.raw('items') as FAQItem[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#141414] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-white text-center mb-16">
          {t('title')}
        </h2>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left text-white hover:bg-white/5 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-base pr-4">{item.question}</span>
                {open === i ? (
                  <Minus size={18} className="shrink-0 text-[#bbff00]" />
                ) : (
                  <Plus size={18} className="shrink-0 text-white/50" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/60 text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
