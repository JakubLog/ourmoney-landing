import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';

type Props = { locale: string };

// Samo narzedzie zyje na /kalkulator - tutaj tylko zajawka, zeby nie
// duplikowac tresci miedzy homepage a strona kalkulatora
export async function CalculatorTeaserSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.calculator' });

  return (
    <section id="kalkulator" data-section-view="calculator_teaser" className="bg-dark px-6 py-20 md:py-28">
      <ScrollReveal className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">{t('eyebrow')}</p>
        <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
          {t('title')}
        </h2>
        <SectionLead tone="dark" className="mt-6">
          {t('subtitle')}
        </SectionLead>
        <Link
          href="/kalkulator"
          className="sheen mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-accent-dark"
        >
          {t('cta')}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </ScrollReveal>
    </section>
  );
}
