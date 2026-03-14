import { getTranslations } from 'next-intl/server';

type Props = { locale: string };

type Feature = { title: string; description: string };

export async function FeaturesSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.features' });
  const items = t.raw('items') as Feature[];

  return (
    <section className="bg-[#141414] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-white text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 flex flex-col gap-4 hover:border-[#bbff00]/30 transition-colors"
            >
              <div className="w-10 h-10 bg-[#bbff00] rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-sm">{i + 1}</span>
              </div>
              <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
