import { getTranslations } from 'next-intl/server';
import { TrackedCTALink } from '@/components/ui/TrackedCTALink';

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
        <TrackedCTALink
          href={tCommon('appUrl')}
          className="inline-block bg-[#bbff00] text-black text-sm font-semibold px-10 py-4 rounded-full hover:bg-[#a2e600] transition-colors"
          location="cta_banner"
          locale={locale}
        >
          {t('button')}
        </TrackedCTALink>
      </div>
    </section>
  );
}
