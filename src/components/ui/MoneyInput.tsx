'use client';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: string;
};

/** Pole kwoty - tylko cyfry, spacja co 3 znaki dla czytelnosci. */
export function MoneyInput({ id, label, value, onChange, currency }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-white/60">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 8))}
          className="w-full min-h-[56px] rounded-2xl bg-white/[0.06] border border-white/10 px-4 pr-16 text-xl text-white placeholder-white/30 outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.08]"
          placeholder="0"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40"
        >
          {currency}
        </span>
      </div>
    </div>
  );
}
