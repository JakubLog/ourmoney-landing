import { getTranslations } from 'next-intl/server';
import { CircleHelp, Plus, X } from 'lucide-react';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { startHref } from '@/lib/appLinks';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

type FAQItem = { question: string; answer: string };
type Props = { locale: string };

export async function FAQSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.faq' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const items = t.raw('items') as FAQItem[];

  return (
    <section data-section-view="faq" className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Ten sam uklad co pozostale sekcje: wysrodkowany naglowek nad trescia,
            CTA wysrodkowane pod nia (jak w HowItWorksSection) */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <SectionEyebrow icon={CircleHelp}>{t('eyebrow')}</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight mb-6">
            {t('title')}
          </h2>
          <SectionLead>{t('subtitle')}</SectionLead>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div data-track-faq>
            {items.map((item) => (
              <details key={item.question} className="group border-t border-dark/10">
                <summary className="flex items-center justify-between py-6 cursor-pointer">
                  <span className="font-medium text-dark text-base pr-6">{item.question}</span>
                  <span aria-hidden="true" className="shrink-0 text-dark/60">
                    <Plus size={18} className="faq-plus" />
                    <X size={18} className="faq-minus" />
                  </span>
                </summary>
                <div className="faq-answer pb-6">
                  <p className="text-dark/60 text-sm leading-relaxed max-w-xl">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
            <div className="border-t border-dark/10" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150} className="mt-12 text-center md:mt-16">
          <InvertDotButton
            href={startHref(locale)}
            className="inline-block bg-accent text-black font-semibold px-8 py-4 rounded-full text-sm"
            location="faq"
            locale={locale}
          >
            {tCommon('startFree')}
          </InvertDotButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
