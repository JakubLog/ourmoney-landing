import { getTranslations } from 'next-intl/server';

type Props = { locale: string };

export async function PainPointsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.painPoints' });

  const items: string[] = t.raw('items') as string[];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-[#141414] text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item: string, i: number) => (
            <div
              key={i}
              className="border border-[#e2dbd2] rounded-2xl p-8 flex flex-col gap-4"
            >
              <span className="text-[#bbff00] bg-[#141414] rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm shrink-0">
                {i + 1}
              </span>
              <p className="text-[#141414] text-lg font-medium leading-snug">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
