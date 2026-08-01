import { getTranslations } from 'next-intl/server';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AiReportCard } from '@/components/ui/AiReportCard';
import { SectionLead } from '@/components/ui/SectionLead';

type Props = { locale: string };

type Stat = { label: string; value: string };
type Insight = { title: string; description: string; type: 'positive' | 'warning' };
type Recommendation = { title: string; description: string; priority: string; impact: string };

export async function AiReportSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.aiReport' });

  return (
    <section className="bg-dark px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">{t('eyebrow')}</p>
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            {t('title')}
          </h2>
          <SectionLead tone="dark" className="mt-6">
            {t('subtitle')}
          </SectionLead>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <AiReportCard
            badge={t('badge')}
            reportTitle={t('reportTitle')}
            summary={t('summary')}
            stats={t.raw('stats') as Stat[]}
            insightsTitle={t('insightsTitle')}
            insights={t.raw('insights') as Insight[]}
            recommendationsTitle={t('recommendationsTitle')}
            recommendation={t.raw('recommendation') as Recommendation}
            priorityLabel={t('priorityLabel')}
          />
        </ScrollReveal>

        {/* Uczciwe ustawienie oczekiwan - raport potrzebuje realnych danych */}
        <ScrollReveal delay={150}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-white/50">
            {t('footnote')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
