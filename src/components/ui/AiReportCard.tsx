import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

type Stat = { label: string; value: string };
type Insight = { title: string; description: string; type: 'positive' | 'warning' };
type Recommendation = { title: string; description: string; priority: string; impact: string };

type Props = {
  badge: string;
  reportTitle: string;
  summary: string;
  stats: Stat[];
  insightsTitle: string;
  insights: Insight[];
  recommendationsTitle: string;
  recommendation: Recommendation;
  priorityLabel: string;
};

/**
 * Odwzorowanie raportu AI z aplikacji (AIInsightsCard: podsumowanie + kafle liczb,
 * kluczowe spostrzezenia z typem positive/warning, rekomendacja z priorytetem).
 * Struktura i nazwy sekcji 1:1 z produktem, kolory z systemu landingu.
 * Tresc jest przykladowa - oznaczona plakietka.
 */
export function AiReportCard({
  badge,
  reportTitle,
  summary,
  stats,
  insightsTitle,
  insights,
  recommendationsTitle,
  recommendation,
  priorityLabel,
}: Props) {
  return (
    <div className="rounded-hero bg-white p-6 text-dark md:p-8">
      {/* Naglowek raportu */}
      {/* Na waskim ekranie plakietka schodzi pod tytul, zeby go nie sciskac */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
            <Sparkles size={20} className="text-dark" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-semibold">{reportTitle}</h3>
        </div>
        <span className="self-start rounded-full border border-dark/10 bg-surface px-3 py-1 text-xs text-dark/50 sm:shrink-0 sm:self-auto">
          {badge}
        </span>
      </div>

      <p className="text-base leading-relaxed text-dark/70">{summary}</p>

      {/* Kafle liczb - jak w raporcie w aplikacji */}
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-card bg-surface p-4">
            <dt className="text-xs text-dark/50">{stat.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Kluczowe spostrzezenia */}
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-dark/40">
            {insightsTitle}
          </h4>
          <ul className="flex flex-col gap-4 p-0">
            {insights.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-card bg-surface p-4">
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {item.type === 'positive' ? (
                    <TrendingUp size={18} className="text-dark" />
                  ) : (
                    <AlertCircle size={18} className="text-amber-600" />
                  )}
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-dark/60">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Rekomendacja */}
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-dark/40">
            {recommendationsTitle}
          </h4>
          <div className="rounded-card bg-surface p-4">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">{recommendation.title}</p>
              <span className="shrink-0 rounded-full bg-dark px-3 py-1 text-xs text-white">
                {priorityLabel}: {recommendation.priority}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-dark/60">{recommendation.description}</p>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-dark">
              <Lightbulb size={16} className="shrink-0" aria-hidden="true" />
              {recommendation.impact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
