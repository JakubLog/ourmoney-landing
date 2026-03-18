import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { AnimatedWord } from '@/components/ui/AnimatedWord';

type Props = { locale: string };

export async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.hero' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-[85svh]">
      {/* Background image */}
      <Image
        src="/hero-bg.webp"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-24 md:py-32">
        <h1 className="font-display text-5xl md:text-7xl lg:text-[5.25rem] text-white leading-[1.05] tracking-tight mb-6">
          {t('headlineL1')}
          <br />
          <AnimatedWord
            words={t('headlineWords').split(',')}
            className="text-accent"
          />{' '}
          {t('headlinePost')}
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
          {t('subheadline')}
        </p>
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm text-white/50">
          <span>{t('socialProof')}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>{t('noCreditCard')}</span>
        </div>
        <InvertDotButton
          href={tCommon('appUrl')}
          className="inline-block bg-accent text-black font-semibold px-10 py-4 rounded-full text-sm"
          location="hero"
          locale={locale}
        >
          {t('cta')}
        </InvertDotButton>
      </div>
    </section>
  );
}
