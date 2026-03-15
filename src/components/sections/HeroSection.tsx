import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { TrackedCTALink } from '@/components/ui/TrackedCTALink';
import { AnimatedWord } from '@/components/ui/AnimatedWord';

type Props = { locale: string };

export async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.hero' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: '80vh' }}>
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
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-16">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight mb-8">
          {t('headlinePre')}{' '}
          <AnimatedWord
            words={t('headlineWords').split(',')}
            className="text-[#bbff00]"
          />{' '}
          {t('headlinePost')}
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-12 leading-relaxed">
          {t('subheadline')}
        </p>
        <TrackedCTALink
          href={tCommon('appUrl')}
          className="inline-block bg-[#bbff00] text-black font-semibold px-10 py-4 rounded-full text-sm hover:bg-[#a2e600] transition-colors"
          location="hero"
          locale={locale}
        >
          {t('cta')}
        </TrackedCTALink>
      </div>
    </section>
  );
}
