'use client';

type Testimonial = { name: string; rating: number; quote: string };
type Props = { items: Testimonial[] };

const ITEM_WIDTH = 320;
const ITEM_GAP = 20;

const AVATAR_COLORS: Record<string, string> = {
  A: '#c084fc',
  D: '#60a5fa',
  K: '#f97316',
};

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div
      className="bg-white rounded-2xl p-7 flex flex-col gap-4"
      style={{ width: ITEM_WIDTH, marginRight: ITEM_GAP, flexShrink: 0 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base"
            style={{ flexShrink: 0, backgroundColor: AVATAR_COLORS[item.name.charAt(0)] ?? '#141414' }}
          >
            {item.name.charAt(0)}
          </div>
          <span className="text-[#141414] font-semibold text-base">{item.name}</span>
        </div>
        <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
          <span className="text-[#141414]/60 text-sm font-medium">{item.rating}.0</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>
      <p className="text-[#141414]/70 text-sm leading-relaxed">{item.quote}</p>
    </div>
  );
}

export function TestimonialsCarousel({ items }: Props) {
  const distance = items.length * (ITEM_WIDTH + ITEM_GAP);
  const animName = `ts-scroll-${distance}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          from { transform: translateX(0px); }
          to   { transform: translateX(-${distance}px); }
        }
      `}</style>
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: `${animName} 28s linear infinite`,
          }}
        >
          {items.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
          {items.map((item, i) => (
            <TestimonialCard key={`d${i}`} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
