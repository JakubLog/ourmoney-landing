import { getTranslations } from 'next-intl/server';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

export async function CTABanner({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'CTABanner' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section className="bg-dark px-6 py-20 md:py-28">
      <ScrollReveal className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Accent glow behind the glass card.
              40px = radius-hero (32) + inset (8) - promien koncentryczny, nie token */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-[40px] blur-2xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(187,255,0,0.14), transparent 65%)',
            }}
          />
          <div className="relative glass rounded-hero px-8 py-14 md:px-14 md:py-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white leading-snug mb-8 md:mb-10">
              {t('text')}
            </h2>
            <InvertDotButton
              href={tCommon('appUrl')}
              className="sheen inline-block bg-accent text-black text-sm font-semibold px-10 py-4 rounded-full"
              location="cta_banner"
              locale={locale}
            >
              {t('button')}
            </InvertDotButton>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
