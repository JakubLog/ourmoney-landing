import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type PostCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  mainImageUrl?: string;
  mainImageAlt?: string;
  mainImageBlur?: string;
  author?: string;
  locale: string;
  readingTimeLabel: string;
};

type FeaturedPostCardProps = PostCardProps & {
  featuredLabel: string;
  readMoreLabel: string;
};


function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ImagePlaceholder() {
  return (
    <div className="w-full h-full bg-[#1a1a1a]">
      <svg width="100%" height="100%" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="rg1" cx="30%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#bbff00" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#bbff00" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rg2" cx="75%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#6b7fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#6b7fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="225" fill="#1a1a1a" />
        <rect width="400" height="225" fill="url(#rg1)" />
        <rect width="400" height="225" fill="url(#rg2)" />
        <circle cx="80" cy="60" r="120" fill="none" stroke="#bbff00" strokeOpacity="0.04" strokeWidth="1" />
        <circle cx="320" cy="170" r="90" fill="none" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
        <circle cx="200" cy="112" r="50" fill="none" stroke="#bbff00" strokeOpacity="0.06" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export function BlogPostCard({
  slug,
  title,
  excerpt,
  publishedAt,
  mainImageUrl,
  mainImageAlt,
  mainImageBlur,
  author,
  locale,
  readingTimeLabel,
}: PostCardProps) {

  return (
    <article className="group flex flex-col bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#bbff00]/25 transition-all duration-400 hover:-translate-y-1">
      <Link
        href={`/blog/${slug}`}
        className="flex flex-col flex-1"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden shrink-0">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={mainImageAlt ?? title}
              title={mainImageAlt ?? title}
              fill
              {...(mainImageBlur && { placeholder: 'blur' as const, blurDataURL: mainImageBlur })}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 gap-3">
          <h3 className="font-display text-xl text-white leading-snug line-clamp-2 group-hover:text-[#bbff00] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>
          <footer className="flex items-center justify-between pt-4 border-t border-white/8 mt-auto">
            <time dateTime={publishedAt} className="text-xs text-white/25">
              {formatDate(publishedAt, locale)}
            </time>
            {author && <span className="text-xs text-white/25"> · {author}</span>}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#bbff00]/50">
                {readingTimeLabel}
              </span>
              <ArrowUpRight
                size={13}
                className="text-white/15 group-hover:text-[#bbff00] transition-colors duration-300"
              />
            </div>
          </footer>
        </div>
      </Link>
    </article>
  );
}

export function FeaturedPostCard({
  slug,
  title,
  excerpt,
  publishedAt,
  mainImageUrl,
  mainImageAlt,
  mainImageBlur,
  author,
  locale,
  readingTimeLabel,
  featuredLabel,
  readMoreLabel,
}: FeaturedPostCardProps) {
  return (
    <article className="group relative flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/5 hover:border-[#bbff00]/20 transition-all duration-500 bg-[#1a1a1a] min-h-[380px] md:min-h-[420px]">
      <Link
        href={`/blog/${slug}`}
        className="flex flex-col md:flex-row flex-1"
      >
        {/* Image — 55% width on desktop */}
        <div className="relative w-full md:w-[55%] aspect-[4/3] md:aspect-auto overflow-hidden shrink-0">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={mainImageAlt ?? title}
              title={mainImageAlt ?? title}
              fill
              priority
              {...(mainImageBlur && { placeholder: 'blur' as const, blurDataURL: mainImageBlur })}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          ) : (
            <div className="w-full h-full">
              <svg width="100%" height="100%" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <radialGradient id="frg1" cx="25%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#bbff00" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#bbff00" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="frg2" cx="80%" cy="75%" r="55%">
                    <stop offset="0%" stopColor="#6b7fff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#6b7fff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="600" height="420" fill="#1a1a1a" />
                <rect width="600" height="420" fill="url(#frg1)" />
                <rect width="600" height="420" fill="url(#frg2)" />
                <circle cx="150" cy="120" r="200" fill="none" stroke="#bbff00" strokeOpacity="0.05" strokeWidth="1" />
                <circle cx="450" cy="300" r="140" fill="none" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
                <circle cx="300" cy="210" r="80" fill="none" stroke="#bbff00" strokeOpacity="0.07" strokeWidth="0.5" />
                <line x1="0" y1="210" x2="600" y2="210" stroke="#ffffff" strokeOpacity="0.02" strokeWidth="1" />
                <line x1="300" y1="0" x2="300" y2="420" stroke="#ffffff" strokeOpacity="0.02" strokeWidth="1" />
              </svg>
            </div>
          )}
          {/* Fade edge desktop */}
          <div className="hidden md:block absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-[#1a1a1a]" />
        </div>

        {/* Content — 45% on desktop */}
        <div className="flex flex-col justify-between p-8 md:p-12 flex-1">
          <div className="flex flex-col gap-5">
            <span className="inline-flex items-center bg-[#bbff00] text-black text-xs font-semibold px-3 py-1 rounded-full w-fit tracking-wide">
              {featuredLabel}
            </span>
            <h2 className="font-display text-3xl md:text-[2.5rem] text-white leading-tight group-hover:text-[#bbff00] transition-colors duration-300">
              {title}
            </h2>
            <p className="text-sm text-white/45 leading-relaxed line-clamp-4">
              {excerpt}
            </p>
          </div>

          <footer className="flex items-end justify-between pt-6 mt-6 border-t border-white/8">
            <div>
              <time dateTime={publishedAt} className="text-xs text-white/25">
                {formatDate(publishedAt, locale)}
              </time>
              {author && <span className="text-xs text-white/25"> · {author}</span>}
              <p className="text-xs text-[#bbff00]/50 mt-1">
                {readingTimeLabel}
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/30 group-hover:text-[#bbff00] transition-colors duration-300">
              <span className="text-sm font-medium">{readMoreLabel}</span>
              <ArrowUpRight size={16} />
            </div>
          </footer>
        </div>
      </Link>
    </article>
  );
}
