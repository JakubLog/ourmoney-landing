import { TrackedCTALink } from '@/components/ui/TrackedCTALink';

type Props = {
  heading: string;
  text?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  postSlug?: string;
  location?: string;
  locale?: string;
};

function withLocaleParam(url: string, locale: string): string {
  if (locale === 'pl' || !url.includes('app.ourmoney.pl')) return url;
  const u = new URL(url);
  u.searchParams.set('locale', locale);
  return u.toString();
}

export function ArticleCTA({
  heading,
  text,
  buttonLabel,
  buttonUrl,
  postSlug,
  location = 'article_cta',
  locale = 'pl',
}: Props) {
  const effectiveUrl = buttonUrl ? withLocaleParam(buttonUrl, locale) : undefined;
  return (
    <aside className="my-12 p-8 rounded-2xl bg-[#141414] text-center not-prose" aria-label={heading}>
      <h3 className="font-display text-2xl md:text-3xl text-white mb-3 leading-tight">
        {heading}
      </h3>
      {text && (
        <p className="text-sm text-white/50 mb-7 max-w-sm mx-auto leading-relaxed">{text}</p>
      )}
      {effectiveUrl && buttonLabel && (
        <TrackedCTALink
          href={effectiveUrl}
          className="inline-flex items-center gap-2 bg-[#bbff00] text-black font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[#d4ff4d] transition-colors"
          location={location}
          locale={locale}
          postSlug={postSlug}
        >
          {buttonLabel}
        </TrackedCTALink>
      )}
    </aside>
  );
}
