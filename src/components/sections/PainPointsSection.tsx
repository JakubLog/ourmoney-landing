import { getTranslations } from 'next-intl/server';
import { ArrowDown } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';
import { ChatDialogue } from '@/components/ui/ChatDialogue';
import { PainPointIllustration } from '@/components/ui/PainPointIllustration';
import { PainPointCard } from '@/components/ui/PainPointCard';

type Props = { locale: string };

type PainItem = {
  kind: 'split' | 'argument' | 'plans';
  title: string;
  description: string;
  dialogue: { speaker: string; line: string }[];
};

export async function PainPointsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.painPoints' });
  const items = t.raw('items') as PainItem[];

  return (
    <section
      id="wyzwania"
      aria-labelledby="painpoints-title"
      data-section-view="pain_points"
      className="bg-white px-6 py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-dark/60 mb-4">{t('eyebrow')}</p>
          <h2 id="painpoints-title" className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight">
            {t('title')}
          </h2>
          <SectionLead className="mt-6">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        {/* Cards - micro-dialogue between partners */}
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0">
          {items.map((item, i) => (
            <li key={item.kind} className={i === 2 ? 'md:col-span-2 lg:col-span-1' : undefined}>
              {/* Wlasny reveal (nie ScrollReveal): karta wjezdza z fade + uniesieniem,
                  a od tej samej klasy zalezy draw-in ilustracji w rogu. */}
              <PainPointCard
                delay={i * 120}
                className="h-full rounded-panel border border-dark/8 bg-surface-2 p-6 md:p-8"
              >
                {/* Ilustracja w osobnym wierszu (znacznik w prawym gornym rogu karty):
                    w wierszu z h3 zabierala 56-72 px miary i na 1024 px lamala KAZDY
                    naglowek na 3 linie, a na 768 px tylko srodkowy - dialogi w rzedzie
                    przestawaly sie wyrownywac. */}
                <div className="flex justify-end">
                  <PainPointIllustration kind={item.kind} className="-mt-2 -mr-1 text-dark" />
                </div>
                <h3 className="mt-1 text-lg md:text-xl font-medium text-dark leading-snug">
                  {item.title}
                </h3>

                {item.dialogue?.length >= 2 && (
                  <ChatDialogue label={t('dialogueLabel')} lines={item.dialogue} delay={i * 120} />
                )}

                <p className="mt-6 text-sm leading-relaxed text-dark/70">
                  {item.description}
                </p>
              </PainPointCard>
            </li>
          ))}
        </ul>

        {/* Bridge to calculator */}
        <ScrollReveal delay={300} className="mt-12 md:mt-16 text-center">
          <p className="text-base text-dark/70">{t('bridgeLead')}</p>
          <a
            href="#kalkulator"
            className="-mt-1 -mb-3 inline-flex items-center gap-2 py-3 text-sm font-semibold text-accent-deep hover:underline underline-offset-4 decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-deep rounded-card"
          >
            {t('bridgeCta')} <ArrowDown size={16} aria-hidden="true" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
