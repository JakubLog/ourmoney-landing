import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Lock, Eye, Server } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

const ICONS = [ShieldCheck, Lock, Eye, Server];

export async function TrustSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.trust' });
  const items = t.raw('items') as { title: string; description: string }[];

  return (
    <section className="bg-dark py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-white text-sm font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
