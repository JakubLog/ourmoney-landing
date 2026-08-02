'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

type Testimonial = { _id: string; name: string; rating: number; quote: string; photoUrl: string | null };
type Props = { items: Testimonial[] };

const CARD_WIDTH = 320;
const GAP = 24;
const SPEED = 0.5; // px per frame (~30px/s at 60fps)

const AVATAR_COLORS: Record<string, string> = {
  A: '#c084fc',
  D: '#60a5fa',
  K: '#f97316',
  M: '#34d399',
  J: '#fb923c',
  P: '#a78bfa',
  S: '#f472b6',
};

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const initial = item.name.charAt(0).toUpperCase();
  const bgColor = AVATAR_COLORS[initial] ?? '#141414';

  return (
    <div
      className="bg-white rounded-2xl p-8 flex flex-col gap-4 select-none"
      style={{ width: CARD_WIDTH, flexShrink: 0 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {item.photoUrl ? (
            <Image
              src={item.photoUrl}
              alt={item.name}
              title={item.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
              style={{ flexShrink: 0 }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base"
              style={{ flexShrink: 0, backgroundColor: bgColor }}
            >
              {initial}
            </div>
          )}
          <span className="text-dark font-semibold text-base">{item.name}</span>
        </div>
        <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
          <span className="text-dark/60 text-sm font-medium">{item.rating}.0</span>
          <StarIcon />
        </div>
      </div>
      <p className="text-dark/70 text-sm leading-relaxed">{item.quote}</p>
    </div>
  );
}

export function TestimonialsCarousel({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  // Keep ref in sync for the animation loop
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Total width of one set of items
  const setWidth = items.length * (CARD_WIDTH + GAP);

  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current && trackRef.current) {
        offsetRef.current -= SPEED;
        // Reset seamlessly when one full set has scrolled past
        if (Math.abs(offsetRef.current) >= setWidth) {
          offsetRef.current += setWidth;
        }
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [setWidth]);

  if (items.length === 0) return null;

  // Render 3 copies for seamless looping regardless of viewport width
  const copies = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden w-full cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: GAP }}
      >
        {copies.map((item, i) => (
          <TestimonialCard key={`${item._id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
