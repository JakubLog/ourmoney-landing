'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Author = {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
};

export function AuthorCard({ author }: { author: Author }) {
  const t = useTranslations('AboutPage.authorCard');
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    /* Outer wrapper - 1.5px "border" pokazywany przez gradient */
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="rounded-[18px] p-[1.5px]"
      style={{
        background: active
          ? `radial-gradient(circle 220px at ${pos.x}px ${pos.y}px, #bbff00 0%, rgba(187,255,0,0.6) 30%, rgba(20,20,20,0.18) 60%)`
          : 'rgba(20,20,20,0.18)',
        transition: active ? 'none' : 'background 0.5s ease',
      }}
    >
      {/* Inner card */}
      <Link
        href={`/autor/${author.slug}`}
        className="group flex flex-col bg-[#141414] rounded-2xl p-10 h-full"
      >
        {/* Avatar */}
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            title={author.name}
            width={120}
            height={120}
            className="rounded-full object-cover mb-6 flex-shrink-0"
            style={{ width: 120, height: 120 }}
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-white/10 flex items-center justify-center mb-6 flex-shrink-0">
            <span className="text-[#bbff00] font-bold text-4xl">
              {author.name.charAt(0)}
            </span>
          </div>
        )}

        <h3 className="text-white font-semibold text-xl mb-1">{author.name}</h3>
        {author.role && (
          <p className="text-[#bbff00] text-sm font-medium mb-5">{author.role}</p>
        )}
        {author.bio && (
          <p className="text-white/55 text-base leading-relaxed flex-1">{author.bio}</p>
        )}

        <div className="mt-6 flex items-center gap-2 text-sm text-white/30 group-hover:text-[#bbff00] transition-colors duration-300">
          <span>{t('viewStory')}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </Link>
    </div>
  );
}
