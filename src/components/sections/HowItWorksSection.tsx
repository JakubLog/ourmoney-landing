import { getTranslations } from 'next-intl/server';
import { Footprints, Timer } from 'lucide-react';
import { CreditCardOffIcon } from '@/components/ui/CreditCardOffIcon';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ScribbleWord } from '@/components/ui/ScribbleWord';
import { SectionLead } from '@/components/ui/SectionLead';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { HowItWorksStepper, type HowItWorksStep } from '@/components/ui/HowItWorksStepper';
import { startHref } from '@/lib/appLinks';

type Props = { locale: string };

export async function HowItWorksSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.howItWorks' });
  const steps = t.raw('steps') as HowItWorksStep[];

  return (
    <section
      id="jak-to-dziala"
      aria-labelledby="howitworks-title"
      data-section-view="how_it_works"
      className="bg-surface overflow-hidden px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <SectionEyebrow icon={Footprints}>{t('eyebrow')}</SectionEyebrow>
          <h2 id="howitworks-title" className="font-display text-4xl leading-tight text-dark md:text-5xl lg:text-6xl">
            {t('title')} <ScribbleWord>{t('titleHighlight')}</ScribbleWord>
          </h2>
          <SectionLead className="mt-6">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        <HowItWorksStepper steps={steps} stepsLabel={t('stepsLabel')} locale={locale} />

        <ScrollReveal delay={150} className="mt-12 text-center md:mt-16">
          <InvertDotButton
            href={startHref(locale)}
            className="sheen inline-block rounded-full bg-accent px-10 py-4 text-sm font-semibold text-black"
            location="how_it_works"
            locale={locale}
          >
            {t('cta')}
          </InvertDotButton>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-dark/60">
            <span className="inline-flex items-center gap-1.5">
              <CreditCardOffIcon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} />
              {t('ctaNoteCard')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Timer className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} aria-hidden="true" />
              {t('ctaNoteTime')}
            </span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
