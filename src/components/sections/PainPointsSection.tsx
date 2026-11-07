import { getTranslations } from 'next-intl/server';
import { ArrowDown, MessagesSquare } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
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
          <SectionEyebrow icon={MessagesSquare}>{t('eyebrow')}</SectionEyebrow>
          <h2 id="painpoints-title" className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight">
            {t('title')}
          </h2>
          <SectionLead className="mt-6">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        {/* Cards - micro-dialogue between partners.
            Mobile: karty jedna pod druga, tresc w kolejnosci DOM.
            md (768-1023): jedna kolumna kart, w karcie dwie kolumny - ikona, naglowek
            i opis po lewej, dialog po prawej. Uklad 2+1 zostawial trzecia karte na cala
            szerokosc z dymkami rozjechanymi o ~600 px.
            lg: trzy karty, wiersze (ikona / naglowek / dialog / opis) dzielone przez
            subgrid - opisy i ich kreska zaczynaja sie na tej samej wysokosci, choc
            dialogi maja rozna liczbe linii. */}
        <ul
          role="list"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-x-8 lg:gap-y-0 list-none p-0 m-0"
        >
          {items.map((item, i) => (
            <li key={item.kind} className="lg:row-span-4 lg:grid lg:grid-rows-subgrid">
              {/* Wlasny reveal (nie ScrollReveal): karta wjezdza z fade + uniesieniem,
                  a od tej samej klasy zalezy draw-in ilustracji. */}
              <PainPointCard
                delay={i * 120}
                className="h-full rounded-panel border border-dark/8 bg-surface-2 p-6 md:p-8 md:grid md:grid-cols-2 md:grid-rows-[auto_auto_1fr] md:gap-x-10 lg:row-span-4 lg:grid-cols-1 lg:grid-rows-subgrid"
              >
                {/* Ilustracja nad naglowkiem, wyrownana do lewej krawedzi tresci:
                    w wierszu z h3 zabierala 56-72 px miary, a w prawym rogu zostawiala
                    pusty pas nad tytulem. */}
                <PainPointIllustration kind={item.kind} className="-ml-1 block text-dark" />
                <h3 className="mt-4 text-lg md:text-xl font-medium text-dark leading-snug text-balance">
                  {item.title}
                </h3>

                {item.dialogue?.length >= 2 && (
                  <ChatDialogue
                    label={t('dialogueLabel')}
                    lines={item.dialogue}
                    delay={i * 120}
                    className="mt-6 md:col-start-2 md:row-span-3 md:row-start-1 md:mt-0 md:self-center lg:col-auto lg:row-auto lg:mt-6 lg:self-start"
                  />
                )}

                <p className="mt-6 border-t border-dark/10 pt-5 text-sm leading-relaxed text-dark/70 md:mt-3 md:border-t-0 md:pt-0 lg:mt-6 lg:border-t lg:pt-5">
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
