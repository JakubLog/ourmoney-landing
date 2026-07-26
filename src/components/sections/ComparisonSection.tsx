import { getTranslations } from 'next-intl/server';
import { Check, X, Minus } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

type CellValue = 'yes' | 'no' | 'partial';

function CellIcon({ value }: { value: CellValue }) {
  if (value === 'yes')
    return (
      <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center mx-auto">
        <Check className="w-3.5 h-3.5 text-accent" />
      </div>
    );
  if (value === 'no')
    return (
      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mx-auto">
        <X className="w-3.5 h-3.5 text-red-400" />
      </div>
    );
  return (
    <div className="w-6 h-6 rounded-full bg-dark/10 flex items-center justify-center mx-auto">
      <Minus className="w-3.5 h-3.5 text-dark/40" />
    </div>
  );
}

export async function ComparisonSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.comparison' });
  const features = t.raw('features') as string[];
  const competitors = t.raw('competitors') as string[];
  const grid = t.raw('grid') as CellValue[][];

  return (
    <section className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-dark leading-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-dark/50 text-sm leading-relaxed max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left text-dark/40 font-medium py-3 pr-4 w-1/3" />
                  {competitors.map((name, i) => (
                    <th
                      key={i}
                      className={`text-center font-semibold py-3 px-3 ${
                        i === 0 ? 'text-accent' : 'text-dark/50'
                      }`}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, row) => (
                  <tr key={row} className="border-t border-dark/5">
                    <td className="text-dark/70 py-4 pr-4">{feature}</td>
                    {grid[row].map((val, col) => (
                      <td key={col} className="text-center py-4 px-3">
                        <CellIcon value={val} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
