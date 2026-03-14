import { useTranslations } from 'next-intl';

export function CTABanner() {
  const t = useTranslations('CTABanner');
  const tCommon = useTranslations('Common');

  return (
    <section className="bg-[#bbff00] px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xl md:text-2xl font-semibold text-black leading-snug mb-8">
          {t('text')}
        </p>
        <a
          href={tCommon('appUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#141414] transition-colors"
        >
          {t('button')}
        </a>
      </div>
    </section>
  );
}
