import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

type Props = { locale: string };

export async function BrandPromiseSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.brandPromise' });

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight mb-6">
          {t('title')}
        </h2>
        <p className="text-dark/50 text-base md:text-lg leading-relaxed mb-14 max-w-xl mx-auto">
          {t('description')}
        </p>

        {/* Couple image with floating expense cards */}
        <div className="relative max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image
                src="/bg-section-2.avif"
                alt="Para korzystająca z aplikacji OurMoney"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          </div>

          {/* Floating card: Biedronka — bottom left */}
          <div className="absolute bottom-6 left-2 md:bottom-10 md:left-6 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-lg shrink-0" aria-hidden="true">
              🐞
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-dark">Biedronka</p>
              <p className="text-xs text-dark/50">Zakupy spożywcze</p>
            </div>
            <div className="text-right ml-4">
              <p className="text-sm font-semibold text-dark">129,89 zł</p>
              <p className="text-xs text-dark/50">23.02.2026</p>
            </div>
            <span className="absolute -top-2 -right-2 bg-accent text-[10px] font-semibold text-dark px-2 py-0.5 rounded-full">
              Agnieszka
            </span>
          </div>

          {/* Floating card: Paliwo — right */}
          <div className="absolute bottom-24 right-2 md:bottom-28 md:right-6 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-lg shrink-0" aria-hidden="true">
              ⛽
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-dark">Paliwo</p>
              <p className="text-xs text-dark/50">Samochód</p>
            </div>
            <div className="text-right ml-4">
              <p className="text-sm font-semibold text-dark">312,23 zł</p>
              <p className="text-xs text-dark/50">28.02.2026</p>
            </div>
            <span className="absolute -top-2 -right-2 bg-accent text-[10px] font-semibold text-dark px-2 py-0.5 rounded-full">
              Rafał
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
