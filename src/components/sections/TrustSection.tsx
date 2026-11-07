import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Lock, Eye, Server } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

type Props = { locale: string };

const ICONS = [ShieldCheck, Lock, Eye, Server];

export async function TrustSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.trust' });
  const items = t.raw('items') as { title: string; description: string }[];

  return (
    <section className="bg-dark py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <SectionEyebrow icon={ShieldCheck} className="text-white/50">{t('eyebrow')}</SectionEyebrow>
          <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-6">
            {t('title')}
          </h2>
          <SectionLead tone="dark">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        {/* Ponizej sm kompaktowe wiersze (ikona z lewej, tekst do lewej) zamiast
            czterech wysokich, wysrodkowanych kart po ~180px jedna pod druga */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left sm:block sm:p-6 sm:text-center md:p-8">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 sm:mx-auto sm:mb-4 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-white sm:mb-2">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-white/50">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
