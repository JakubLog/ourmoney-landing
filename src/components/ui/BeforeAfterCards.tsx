import { X, Check } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = {
  before: string[];
  after: string[];
  beforeLabel: string;
  afterLabel: string;
};

export function BeforeAfterCards({ before, after, beforeLabel, afterLabel }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ScrollReveal>
        <div className="rounded-2xl bg-white border border-dark/10 p-8 md:p-10 h-full">
          <h3 className="text-dark/40 text-sm font-semibold uppercase tracking-wider mb-6">
            {beforeLabel}
          </h3>
          <ul className="space-y-4 list-none p-0 m-0">
            {before.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-red-500" />
                </div>
                <span className="text-dark/60 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="rounded-2xl bg-dark p-8 md:p-10 h-full">
          <h3 className="text-accent text-sm font-semibold uppercase tracking-wider mb-6">
            {afterLabel}
          </h3>
          <ul className="space-y-4 list-none p-0 m-0">
            {after.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <span className="text-white/70 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </div>
  );
}
