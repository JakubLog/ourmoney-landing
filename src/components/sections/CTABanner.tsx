import { getTranslations } from 'next-intl/server';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

export async function CTABanner({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'CTABanner' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section className="bg-dark px-6 py-20 md:py-28">
      <ScrollReveal className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl text-white leading-snug mb-8 md:mb-10">
          {t('text')}
        </h2>
        <InvertDotButton
          href={tCommon('appUrl')}
          className="inline-block bg-accent text-black text-sm font-semibold px-10 py-4 rounded-full"
          location="cta_banner"
          locale={locale}
        >
          {t('button')}
        </InvertDotButton>
      </ScrollReveal>
    </section>
  );
}
