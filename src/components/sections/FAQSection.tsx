import { getTranslations } from 'next-intl/server';
import { Plus, X } from 'lucide-react';
import { InvertDotButton } from '@/components/ui/InvertDotButton';

type FAQItem = { question: string; answer: string };
type Props = { locale: string };

export async function FAQSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.faq' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const items = t.raw('items') as FAQItem[];

  return (
    <section className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-20">
          {/* Left column: title + CTA */}
          <div>
            <h2 className="text-5xl md:text-6xl text-dark mb-8">
              {t('title')}
            </h2>
            <InvertDotButton
              href={tCommon('appUrl')}
              className="inline-block bg-accent text-black font-semibold px-8 py-4 rounded-full text-sm"
              location="faq"
              locale={locale}
            >
              {tCommon('startFree')}
            </InvertDotButton>
          </div>

          {/* Right column: accordion */}
          <div>
            {items.map((item) => (
              <details key={item.question} className="group border-t border-dark/10">
                <summary className="flex items-center justify-between py-5 cursor-pointer">
                  <span className="font-medium text-dark text-base pr-6">{item.question}</span>
                  <span aria-hidden="true" className="shrink-0 text-dark/40">
                    <Plus size={18} className="faq-plus" />
                    <X size={18} className="faq-minus" />
                  </span>
                </summary>
                <div className="faq-answer pb-5">
                  <p className="text-dark/50 text-sm leading-relaxed max-w-xl">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
            <div className="border-t border-dark/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
