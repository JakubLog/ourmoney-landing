import { getTranslations } from 'next-intl/server';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';

type Props = { locale: string };

type PainItem = { title: string; description: string };

const CARD_COLORS = [
  'var(--color-surface-cool)',
  'var(--color-beige)',
  'var(--color-surface-2)',
];

export async function PainPointsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.painPoints' });
  const items = t.raw('items') as PainItem[];

  return (
    <section
      id="wyzwania"
      aria-labelledby="painpoints-title"
      data-section-view="pain_points"
      className="bg-white py-20 md:py-28 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <p className="text-xs text-dark/60 uppercase tracking-[0.2em] mb-4">{t('eyebrow')}</p>
          <h2 id="painpoints-title" className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight">
            {t('title')}
          </h2>
          <SectionLead className="mt-6">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        {/* Cards - staggered */}
        <ul role="list" className="grid md:grid-cols-3 gap-6 list-none p-0 m-0">
          {items.map((item, i) => (
            <li key={item.title}>
              <ScrollReveal delay={i * 100}>
                <div
                  className="rounded-panel p-8 md:p-10 flex flex-col gap-4 h-full"
                  style={{ backgroundColor: CARD_COLORS[i] }}
                >
                  <h3 className="text-dark text-lg leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-dark/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
