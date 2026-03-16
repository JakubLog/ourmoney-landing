import { getTranslations } from 'next-intl/server';
import { InvertDotButton } from '@/components/ui/InvertDotButton';

type Props = { locale: string };

export async function CTABanner({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'CTABanner' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section className="bg-[#141414] px-6 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-display text-3xl md:text-4xl text-white leading-snug mb-10">
          {t('text')}
        </p>
        <InvertDotButton
          href={tCommon('appUrl')}
          className="inline-block bg-accent text-black text-sm font-semibold px-10 py-4 rounded-full"
          location="cta_banner"
          locale={locale}
        >
          {t('button')}
        </InvertDotButton>
      </div>
    </section>
  );
}
