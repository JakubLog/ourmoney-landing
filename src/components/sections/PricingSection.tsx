import { getTranslations } from 'next-intl/server';
import { Check, Minus } from 'lucide-react';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { startHref } from '@/lib/appLinks';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

// Bez przelacznika mies./rok - obie ceny sa widoczne naraz, dzieki czemu cala
// sekcja zostaje server-only. Jedyny client JS to CTA (tracking GA4).
export async function PricingSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.pricing' });

  const freeFeatures = t.raw('plans.free.features') as string[];
  const freeLimits = t.raw('plans.free.limits') as string[];
  const premiumFeatures = t.raw('plans.premium.features') as string[];

  return (
    <section id="cennik" data-section-view="pricing" className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-dark/40">{t('eyebrow')}</p>
          <h2 className="font-display mx-auto max-w-2xl text-4xl leading-tight text-dark md:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-dark/50">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Plan darmowy */}
          <ScrollReveal className="h-full">
            <div className="flex h-full flex-col rounded-hero border border-dark/8 bg-white p-8 md:p-10">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-dark/40">
                {t('plans.free.name')}
              </h3>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl leading-none text-dark">
                  {t('plans.free.price')}
                </span>
                <span className="text-sm text-dark/40">{t('plans.free.period')}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-dark/60">
                {t('plans.free.description')}
              </p>

              <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-dark/40">
                {t('includedLabel')}
              </p>
              <ul className="mt-4 list-none space-y-3 p-0 text-sm text-dark/70">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-deep/12">
                      <Check className="h-3 w-3 text-accent-deep" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-dark/40">
                {t('limitsLabel')}
              </p>
              <ul className="mt-4 list-none space-y-3 p-0 text-sm text-dark/45">
                {freeLimits.map((limit) => (
                  <li key={limit} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dark/8">
                      <Minus className="h-3 w-3 text-dark/40" aria-hidden="true" />
                    </span>
                    {limit}
                  </li>
                ))}
              </ul>

              {/* mt-auto na wrapperze - przyciski obu kart stoja w jednej linii
                  niezaleznie od tego, ktora lista jest dluzsza */}
              <div className="mt-auto pt-10">
                <InvertDotButton
                  href={startHref(locale)}
                  className="block w-full rounded-full border border-dark/15 bg-white px-8 py-4 text-center text-sm font-semibold text-dark"
                  location="pricing_free"
                  locale={locale}
                >
                  {t('plans.free.cta')}
                </InvertDotButton>
              </div>
            </div>
          </ScrollReveal>

          {/* Premium */}
          <ScrollReveal className="h-full" delay={80}>
            <div className="relative h-full">
              {/* Poswiata akcentu pod karta - 40px = radius-hero (32) + inset (8) */}
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-[40px] blur-2xl"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(187,255,0,0.18), transparent 65%)',
                }}
              />
              <div className="relative flex h-full flex-col rounded-hero bg-dark p-8 ring-1 ring-accent/25 md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50">
                    {t('plans.premium.name')}
                  </h3>
                  <span className="rounded-full bg-accent px-4 py-1 text-xs font-semibold text-black">
                    {t('badge')}
                  </span>
                </div>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl leading-none text-white">
                    {t('plans.premium.price')}
                  </span>
                  <span className="text-sm text-white/40">{t('plans.premium.period')}</span>
                </p>
                <p className="mt-2 text-sm font-medium text-accent">{t('plans.premium.yearly')}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {t('plans.premium.description')}
                </p>

                <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-white/40">
                  {t('includedLabel')}
                </p>
                <ul className="mt-4 list-none space-y-3 p-0 text-sm text-white/80">
                  {premiumFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                        <Check className="h-3 w-3 text-accent" strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  <InvertDotButton
                    href={startHref(locale, 'premium')}
                    className="sheen block w-full rounded-full bg-accent px-8 py-4 text-center text-sm font-semibold text-black"
                    location="pricing_premium"
                    locale={locale}
                  >
                    {t('plans.premium.cta')}
                  </InvertDotButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-dark/40">
            {t('note')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
