import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ShoppingBasket, Fuel } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

export async function BrandPromiseSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.brandPromise' });

  return (
    <section className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight mb-6">
            {t('title')}
          </h2>
          <p className="text-dark/50 text-base md:text-lg leading-relaxed mb-12 md:mb-16 max-w-xl mx-auto">
            {t('description')}
          </p>
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
            </div>
          </div>

          {/* Cards: absolute on desktop, flex row below image on mobile */}
          <div className="flex gap-3 mt-4 md:block md:mt-0">

            {/* Card: Biedronka */}
            <div className="float-a glass-light flex-1 md:flex-none relative md:absolute md:bottom-10 md:left-6 rounded-2xl px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3 z-10">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0" aria-hidden="true">
                <ShoppingBasket className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs md:text-sm font-semibold text-dark">Biedronka</p>
                <p className="text-xs text-dark/50">Zakupy spożywcze</p>
              </div>
              <div className="text-right ml-auto md:ml-4 shrink-0">
                <p className="text-xs md:text-sm font-semibold text-dark">129,89 zł</p>
                <p className="hidden md:block text-xs text-dark/50">23.02.2026</p>
              </div>
              <span className="absolute -top-2 -right-2 bg-accent text-xs font-semibold text-dark px-2 py-1 rounded-full">
                Agnieszka
              </span>
            </div>

            {/* Card: Paliwo */}
            <div className="float-b glass-light flex-1 md:flex-none relative md:absolute md:bottom-28 md:right-6 rounded-2xl px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3 z-10">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0" aria-hidden="true">
                <Fuel className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs md:text-sm font-semibold text-dark">Paliwo</p>
                <p className="text-xs text-dark/50">Samochód</p>
              </div>
              <div className="text-right ml-auto md:ml-4 shrink-0">
                <p className="text-xs md:text-sm font-semibold text-dark">312,23 zł</p>
                <p className="hidden md:block text-xs text-dark/50">28.02.2026</p>
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
