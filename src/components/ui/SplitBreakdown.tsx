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
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">{title}</p>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-white/50">
            {/* Pusta komorka naroznika: naglowkiem wierszy sa etykiety w
                pierwszej kolumnie (th scope="row"), wiec kolumna nie potrzebuje
                wlasnego tytulu - a11y (td-has-header) wymaga tylko, zeby kazda
                komorka danych miala naglowek wiersza lub kolumny */}
            <td className="pb-2" aria-hidden="true" />
            <th scope="col" className="pb-2 text-right font-normal">{youLabel}</th>
            <th scope="col" className="pb-2 text-right font-normal">{partnerLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-white/10">
              <th scope="row" className="py-2 text-left font-normal text-white/70">
                {row.label}
                <span className="ml-2 text-xs text-white/50">{format(row.total)}</span>
              </th>
              <td className="py-2 text-right tabular-nums text-white">{format(row.you)}</td>
              <td className="py-2 text-right tabular-nums text-white/70">{format(row.partner)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs leading-relaxed text-white/50">{note}</p>
    </div>
  );
}
