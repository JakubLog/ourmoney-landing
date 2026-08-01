type Row = { label: string; total: number; you: number; partner: number };

type Props = {
  title: string;
  note: string;
  rows: Row[];
  format: (value: number) => string;
  youLabel: string;
  partnerLabel: string;
};

/**
 * Rozbicie wspolnych wydatkow na typowe kategorie.
 * Proporcje kategorii sa przykladowe (i tak opisane), ale kwoty per osoba
 * licza sie z liczb wpisanych przez uzytkownika - to jego wlasna matematyka.
 */
export function SplitBreakdown({ title, note, rows, format, youLabel, partnerLabel }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{title}</p>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-white/40">
            <th className="pb-2 font-normal">&nbsp;</th>
            <th className="pb-2 text-right font-normal">{youLabel}</th>
            <th className="pb-2 text-right font-normal">{partnerLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-white/10">
              <td className="py-2 text-white/70">
                {row.label}
                <span className="ml-2 text-xs text-white/35">{format(row.total)}</span>
              </td>
              <td className="py-2 text-right tabular-nums text-white">{format(row.you)}</td>
              <td className="py-2 text-right tabular-nums text-white/70">{format(row.partner)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs leading-relaxed text-white/35">{note}</p>
    </div>
  );
}
