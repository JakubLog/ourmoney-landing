'use client';

export type SplitMode = 'proportional' | 'equal';

type Props = {
  value: SplitMode;
  onChange: (mode: SplitMode) => void;
  labels: Record<SplitMode, string>;
  groupLabel: string;
};

/** Segmentowany przelacznik zasady podzialu - odpowiednik SplitRulesScreen w aplikacji. */
export function SplitModeToggle({ value, onChange, labels, groupLabel }: Props) {
  const modes: SplitMode[] = ['proportional', 'equal'];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-white/60" id="split-mode-label">
        {groupLabel}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="split-mode-label"
        className="flex gap-2 rounded-full bg-white/[0.06] p-1"
      >
        {modes.map((mode) => {
          const active = value === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(mode)}
              className={`min-h-[48px] flex-1 rounded-full px-4 text-sm font-semibold transition-colors ${
                active ? 'bg-accent text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
