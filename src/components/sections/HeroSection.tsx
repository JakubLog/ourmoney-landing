import { getTranslations } from 'next-intl/server';

type Props = { locale: string };

export async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.hero' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section
      className="relative pt-36 pb-24 px-6 min-h-screen flex items-center"
      style={{
        backgroundImage: 'url(/hero-bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-8">
          {t('headline')}
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('subheadline')}
        </p>
        <a
          href={tCommon('appUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#bbff00] text-black font-semibold px-10 py-4 rounded-full text-base hover:bg-[#a2e600] transition-colors"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );

}
