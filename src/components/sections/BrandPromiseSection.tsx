import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ShoppingBasket, Fuel, Heart } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { AiImageLabel } from '@/components/ui/AiImageLabel';

type Props = { locale: string };

export async function BrandPromiseSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.brandPromise' });

  return (
    <section className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <SectionEyebrow icon={Heart}>{t('eyebrow')}</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight mb-6">
            {t('title')}
          </h2>
          <SectionLead className="mb-12 md:mb-16">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        {/* Couple image with floating expense cards */}
        <ScrollReveal animation="scale" className="relative max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image
                src="/bg-section-2.avif"
                alt="Para korzystająca z aplikacji OurMoney"
                title="Para korzystająca z aplikacji OurMoney"
                fill
                placeholder="blur"
                blurDataURL="data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAD6AAEAAAAAAAAAJwAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAABQAAAANAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAvbWRhdBIACgg4EOeMICGg0jIZGAAAAEC1gKKG4YuKvzn4glcc20wkbr0Vig=="
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <AiImageLabel variant="label" tooltipSide="bottom" className="absolute top-4 right-4" />
            </div>
          </div>

          {/* Cards: absolute on desktop, staggered diagonally (left low, right high).
              Below md they sit under the image, offset left/right and overlapping
              its bottom edge, so they still read as floating instead of two equal rows */}
          <div className="flex flex-col gap-3 md:block">

            {/* Card: Biedronka */}
            <div className="float-a glass-light relative z-10 -mt-8 mr-auto w-[86%] max-w-xs rounded-2xl px-4 py-3.5 flex items-center gap-3 md:absolute md:mt-0 md:w-auto md:max-w-none md:bottom-[12%] md:left-6 md:px-5 md:py-4">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0" aria-hidden="true">
                <ShoppingBasket className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold text-dark">Biedronka</p>
                <p className="text-xs text-dark/60">Zakupy spożywcze</p>
              </div>
              <div className="text-right ml-auto md:ml-6 shrink-0">
                <p className="text-sm font-semibold text-dark">129,89 zł</p>
                <p className="text-xs text-dark/60">23.02.2026</p>
              </div>
              <span className="absolute -top-2 -right-2 bg-accent text-xs font-semibold text-dark px-2 py-1 rounded-full">
                Agnieszka
              </span>
            </div>

            {/* Card: Paliwo */}
            <div className="float-b glass-light relative z-10 ml-auto w-[86%] max-w-xs rounded-2xl px-4 py-3.5 flex items-center gap-3 md:absolute md:w-auto md:max-w-none md:top-[22%] md:right-6 md:px-5 md:py-4">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-green-50 flex items-center justify-center shrink-0" aria-hidden="true">
                <Fuel className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold text-dark">Paliwo</p>
                <p className="text-xs text-dark/60">Samochód</p>
              </div>
              <div className="text-right ml-auto md:ml-6 shrink-0">
                <p className="text-sm font-semibold text-dark">312,23 zł</p>
                <p className="text-xs text-dark/60">28.02.2026</p>
              </div>
              <span className="absolute -top-2 -right-2 bg-accent text-xs font-semibold text-dark px-2 py-1 rounded-full">
                Rafał
              </span>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
