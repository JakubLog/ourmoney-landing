import { getTranslations } from 'next-intl/server';
import { ArrowRight, Calculator } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CalculatorAnimationShowcase } from '@/components/sections/CalculatorAnimationShowcase';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

type Props = { locale: string };

// Samo narzedzie zyje na /kalkulator - tutaj tylko zajawka, zeby nie
// duplikowac tresci miedzy homepage a strona kalkulatora
export async function CalculatorTeaserSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.calculator' });

  return (
    <section id="kalkulator" data-section-view="calculator_teaser" className="bg-dark px-6 py-20 md:py-28">
      <ScrollReveal className="mx-auto max-w-3xl text-center">
        <SectionEyebrow icon={Calculator} className="text-white/40">{t('eyebrow')}</SectionEyebrow>
        <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
          {t('title')}
        </h2>
        <SectionLead tone="dark" className="mt-6">
          {t('subtitle')}
        </SectionLead>
      </ScrollReveal>

      <ScrollReveal animation="scale" delay={100} className="mx-auto mt-12 max-w-6xl">
        <CalculatorAnimationShowcase
          calculatorLabel={t('mockupLabel')}
          expenseLabel={t('expenseAnimation.label')}
        />
      </ScrollReveal>

      <div className="text-center">
        <Link
          href="/kalkulator"
          className="sheen mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-accent-dark"
        >
          {t('cta')}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
