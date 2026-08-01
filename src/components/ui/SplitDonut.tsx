type Props = {
  percentYou: number;
  percentPartner: number;
  label: string;
};

// Geometria 1:1 z ekranem onboardingu w aplikacji (recharts Pie:
// innerRadius 50, outerRadius 80, paddingAngle 2) - landing ma wygladac tak samo,
// ale rysujemy to inline SVG zamiast dociagac recharts na landing.
const RADIUS = 65;
const STROKE = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = (2 / 360) * CIRCUMFERENCE;

const COLOR_YOU = '#bbff00';
const COLOR_PARTNER = '#3f3f46';

export function SplitDonut({ percentYou, percentPartner, label }: Props) {
  const arcYou = Math.max((percentYou / 100) * CIRCUMFERENCE - GAP, 0);
  const arcPartner = Math.max((percentPartner / 100) * CIRCUMFERENCE - GAP, 0);

  return (
    <svg
      viewBox="0 0 160 160"
      className="h-40 w-40"
      role="img"
      aria-label={label}
    >
      {/* Odbicie w pionie: sciezka SVG startuje na godzinie 3 i biegnie zgodnie
          ze wskazowkami, a recharts przy domyslnym startAngle 0 / endAngle 360
          rysuje od godziny 3 PRZECIWNIE do wskazowek. Bez tego wykres na landingu
          bylby lustrzanym odbiciem tego z aplikacji. */}
      <g transform="matrix(1 0 0 -1 0 160)" fill="none" strokeWidth={STROKE}>
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          stroke={COLOR_YOU}
          strokeDasharray={`${arcYou} ${CIRCUMFERENCE - arcYou}`}
          strokeDashoffset={-GAP / 2}
        />
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          stroke={COLOR_PARTNER}
          strokeDasharray={`${arcPartner} ${CIRCUMFERENCE - arcPartner}`}
          strokeDashoffset={-((percentYou / 100) * CIRCUMFERENCE) - GAP / 2}
        />
      </g>
    </svg>
  );
}
