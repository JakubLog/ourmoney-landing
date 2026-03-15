import { getTranslations } from 'next-intl/server';

type Props = { locale: string };

export async function BrandPromiseSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.brandPromise' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section className="bg-[#141414] py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          {t('title')}
        </h2>
        <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          {t('description')}
        </p>
        <a
          href={tCommon('appUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#bbff00] text-black font-semibold px-10 py-4 rounded-full text-sm hover:bg-[#a2e600] transition-colors"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
