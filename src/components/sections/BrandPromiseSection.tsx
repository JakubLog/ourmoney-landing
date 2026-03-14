import { getTranslations } from 'next-intl/server';

type Props = { locale: string };

export async function BrandPromiseSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.brandPromise' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section className="bg-[#e2dbd2] py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl text-[#141414] mb-6">
          {t('title')}
        </h2>
        <p className="text-lg text-[#141414]/70 mb-10 leading-relaxed">
          {t('description')}
        </p>
        <a
          href={tCommon('appUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#141414] text-white font-semibold px-10 py-4 rounded-full hover:bg-black transition-colors"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
