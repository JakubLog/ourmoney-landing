import { Calculator, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Props = {
  title: string;
  text: string;
  cta: string;
};

/**
 * Staly link z kazdego posta do kalkulatora. Kalkulator jest jedynym narzedziem
 * na landingu, po ktore ktos przychodzi z wyszukiwarki bez intencji zakupowej -
 * bez tego bloku nie mial ani jednego linku przychodzacego z bloga.
 */
export function CalculatorPromo({ title, text, cta }: Props) {
  return (
    <aside className="my-12 rounded-2xl border border-dark/10 bg-surface p-6 md:p-8 not-prose">
      <div className="flex items-start gap-5">
        <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-deep/12">
          <Calculator className="h-5 w-5 text-accent-deep" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-dark text-base mb-2">{title}</h3>
          <p className="text-sm text-dark/60 leading-relaxed mb-4">{text}</p>
          <Link
            href="/kalkulator"
            className="inline-flex items-center gap-2 text-sm font-semibold text-dark hover:text-accent-deep transition-colors"
          >
            {cta}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
