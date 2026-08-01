import { getTranslations } from 'next-intl/server';
import { Check, X, Minus } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';

type Props = { locale: string };

type CellValue = 'yes' | 'no' | 'partial';

// highlight = kolumna OurMoney: ciemne kolko z limonkowa fajka.
// Poza nia zielen na bieli idzie w accent-deep - accent ma na bialym tle 1.3:1.
function CellIcon({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (value === 'yes')
    return (
      <div
        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
          highlight ? 'bg-dark' : 'bg-accent-deep/12'
        }`}
      >
        <Check
          className={`h-4 w-4 ${highlight ? 'text-accent' : 'text-accent-deep'}`}
          strokeWidth={2.5}
        />
      </div>
    );
  if (value === 'no')
    return (
      <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
        <X className="h-4 w-4 text-red-400" />
      </div>
    );
  return (
    <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-dark/10">
      <Minus className="h-4 w-4 text-dark/40" />
    </div>
  );
}

export async function ComparisonSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.comparison' });
  const features = t.raw('features') as string[];
  const competitors = t.raw('competitors') as string[];
  const grid = t.raw('grid') as CellValue[][];
  const lastRow = features.length - 1;

  // Pasmo pod kolumna OurMoney - te same klasy na kazdej komorce kolumny 0,
  // bo <col> nie przyjmuje border-radius
  const ownColumn = 'bg-accent-deep/8';

  return (
    <section className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-dark leading-tight mb-6">
            {t('title')}
          </h2>
          <SectionLead>{t('subtitle')}</SectionLead>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-x-auto -mx-6 px-6">
            {/* border-separate, bo przy collapse promienie na komorkach nie sa renderowane */}
            <table className="w-full min-w-[500px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="text-left text-dark/40 font-medium py-3 pr-4 w-1/3" />
                  {competitors.map((name, i) => (
                    <th
                      key={name}
                      scope="col"
                      className={`px-3 pb-4 pt-3 text-center align-bottom ${
                        i === 0 ? `${ownColumn} rounded-t-card` : ''
                      }`}
                    >
                      {i === 0 ? (
                        <span className="inline-block rounded-full bg-dark px-4 py-1.5 text-sm font-semibold text-accent">
                          {name}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-dark/45">{name}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, row) => (
                  <tr key={feature}>
                    <th
                      scope="row"
                      className="border-t border-dark/5 py-4 pr-4 text-left font-normal text-dark/70"
                    >
                      {feature}
                    </th>
                    {grid[row].map((val, col) => (
                      <td
                        key={competitors[col]}
                        className={`border-t px-3 py-4 text-center ${
                          col === 0
                            ? `${ownColumn} border-accent-deep/10 ${row === lastRow ? 'rounded-b-card' : ''}`
                            : 'border-dark/5'
                        }`}
                      >
                        <CellIcon value={val} highlight={col === 0} />
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
