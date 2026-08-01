import { getTranslations } from 'next-intl/server';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SplitCalculator } from '@/components/sections/SplitCalculator';

type Props = { locale: string };

export async function SplitCalculatorSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.calculator' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section id="kalkulator" className="bg-dark px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">{t('subtitle')}</p>
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60">
            {t('description')}
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <SplitCalculator locale={locale} appUrl={tCommon('appUrl')} placement="homepage" />
        </ScrollReveal>
      </div>
    </section>
  );
}
