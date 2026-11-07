import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { HeartHandshake } from 'lucide-react';
import { CreditCardOffIcon } from '@/components/ui/CreditCardOffIcon';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { AiImageLabel } from '@/components/ui/AiImageLabel';
import { AppStoreBadge } from '@/components/ui/AppStoreBadge';
import { startHref } from '@/lib/appLinks';
import { AnimatedWord } from '@/components/ui/AnimatedWord';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { client } from '@/sanity/lib/client';
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries';

type Props = { locale: string };

type Testimonial = {
  _id: string;
  name: string;
  rating: number;
  photoUrl: string | null;
};

export async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.hero' });

  const testimonials = await client.fetch<Testimonial[]>(
    TESTIMONIALS_QUERY,
    { language: locale },
    process.env.NODE_ENV === 'production'
      ? { next: { revalidate: 86400, tags: ['landing'] } }
      : { cache: 'no-store' as const },
  );

  const avatars = testimonials
    .filter((t) => t.photoUrl)
    .slice(0, 4);

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-[85svh]">
      {/* Background image */}
      <Image
        src="/hero-bg.webp"
        alt=""
        fill
        priority
        // Samo `priority` w Next 16 dokleja tylko <link rel=preload>; bez tego
        // atrybutu przegladarka pobiera obraz LCP z priorytetem Low
        fetchPriority="high"
        placeholder="blur"
        blurDataURL="data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APm0skkWkIqGYBABABsSygF2ADO64MI1TsWQAAP7HDgl1sgHPkqougshD1xuX2uqraK2xIgw0+ZAropQAAAA="
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <AiImageLabel variant="label" className="absolute bottom-4 right-4" />

      {/* Content */}
      <div className="hero-stagger relative z-10 max-w-6xl mx-auto px-6 text-center py-24 md:py-32">
        {/* Eyebrow niesie fraze kluczowa - H1 zostaje hookiem emocjonalnym,
            ale nazwa kategorii produktu stoi nad nim, nad linia zgiecia */}
        <SectionEyebrow icon={HeartHandshake} className="text-white/60">
          {t('eyebrow')}
        </SectionEyebrow>
        <h1 className="font-display text-5xl md:text-7xl lg:text-[5.25rem] text-white leading-[1.05] tracking-tight mb-6">
          {t('headlineL1')}
          <br />
          <AnimatedWord
            words={t('headlineWords').split(',')}
            className="text-accent"
          />{' '}
          {t('headlinePost')}
        </h1>
        {/* h2, nie p - to zdanie niesie fraze "wspolny budzet domowy" i jest
            jedynym tekstem opisowym w hero */}
        <h2 className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
          {/* Pelne zdanie jest za dlugie na mobile - krotsza wersja < sm,
              bez "pierwszej aplikacji dla par" (to "dla par" niesie juz eyebrow nad H1) */}
          <span className="sm:hidden">{t('subheadlineShort')}</span>
          <span className="hidden sm:inline">{t('subheadline')}</span>
        </h2>

        {/* Social proof with avatars */}
        <aside aria-label={t('socialProof')} className="mb-6 flex flex-col items-center gap-3">
          <div className="glass rounded-full pl-3 pr-5 sm:pr-6 py-2 flex items-center justify-center gap-3 whitespace-nowrap">
            {avatars.length > 0 && (
              <div className="flex shrink-0 -space-x-2" aria-hidden="true">
                {avatars.map((person, i) => (
                  <Image
                    key={person._id}
                    src={person.photoUrl!}
                    alt={person.name}
                    width={36}
                    height={36}
                    // Ponizej 360px (iPhone SE 1. gen, male Androidy) cztery avatary + tekst
                    // nie mieszcza sie w pigulce - czwarty znika, zamiast nachodzic na tekst
                    className={`w-9 h-9 rounded-full object-cover ring-2 ring-accent/70${i === 3 ? ' max-[359px]:hidden' : ''}`}
                  />
                ))}
              </div>
            )}
            {/* Pelny tekst nie miesci sie w jednej linii na mobile - krotsza wersja < sm */}
            <span className="text-sm text-white/80 sm:hidden">{t('socialProofShort')}</span>
            <span className="text-sm text-white/80 hidden sm:inline">{t('socialProof')}</span>
          </div>
        </aside>

        <InvertDotButton
          href={startHref(locale)}
          className="sheen inline-block bg-accent text-black font-semibold px-10 py-4 rounded-full text-sm"
          location="hero"
          locale={locale}
        >
          {t('cta')}
        </InvertDotButton>
        {/* Notka i odznaka w jednym wezle - hero-stagger animuje kolejne dzieci */}
        <div className="mt-3">
          <p className="flex items-center justify-center gap-1.5 text-xs text-white/50">
            <CreditCardOffIcon className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={1.75} />
            {t('noCreditCard')}
          </p>
          <AppStoreBadge location="hero_app_store" className="mt-6 inline-block" />
        </div>
      </div>

    </section>
  );
}
