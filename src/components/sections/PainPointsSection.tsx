import { getTranslations } from 'next-intl/server';

type Props = { locale: string };

type PainItem = { title: string; description: string };

const CARD_COLORS = ['#e4e9f5', '#e2dbd2', '#eeeceb'];

export async function PainPointsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.painPoints' });
  const items = t.raw('items') as PainItem[];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#141414] leading-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-sm text-[#9c9c9c] tracking-wide">{t('subtitle')}</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 flex flex-col gap-4"
              style={{ backgroundColor: CARD_COLORS[i] }}
            >
              <h3 className="text-[#141414] text-lg leading-snug">
                {item.title}
              </h3>
              <p className="text-[#141414]/70 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
