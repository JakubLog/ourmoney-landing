type Props = {
  color: string;
  name: string;
  amount: string;
  share: string;
};

/** Jedna osoba w wyniku podzialu: kropka koloru z wykresu, kwota i podpis. */
export function ResultCell({ color, name, amount, share }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2 text-sm text-white/60">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full ring-1 ring-white/20"
          style={{ backgroundColor: color }}
        />
        {name}
      </span>
      <span className="font-display text-3xl leading-none text-white">{amount}</span>
      <span className="text-xs text-white/40">{share}</span>
    </div>
  );
}
