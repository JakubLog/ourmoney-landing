'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';

type FAQItem = { question: string; answer: string };

export function FAQSection() {
  const t = useTranslations('HomePage.faq');
  const items = t.raw('items') as FAQItem[];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#f7f7f7] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9c9c9c] text-center mb-4">
          {t('title')}
        </p>
        <div className="flex flex-col gap-0">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl mb-3 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#fafafa] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-[#141414] text-sm pr-6">{item.question}</span>
                {open === i
                  ? <Minus size={16} className="shrink-0 text-[#9c9c9c]" />
                  : <Plus size={16} className="shrink-0 text-[#9c9c9c]" />
                }
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-[#141414]/60 text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
