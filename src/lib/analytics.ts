import { sendGAEvent } from '@next/third-parties/google';

export function trackCTAClick({
  location,
  text,
  locale,
  postSlug,
}: {
  location: string;
  text: string;
  locale: string;
  postSlug?: string;
}) {
  sendGAEvent('event', 'cta_click', {
    cta_location: location,
    cta_text: text,
    locale,
    ...(postSlug && { post_slug: postSlug }),
  });
}

export function trackLanguageSwitch(fromLocale: string, toLocale: string) {
  sendGAEvent('event', 'language_switch', {
    from_locale: fromLocale,
    to_locale: toLocale,
  });
}

export function trackBlogPostRead(slug: string, locale: string) {
  sendGAEvent('event', 'blog_post_read', {
    post_slug: slug,
    locale,
  });
}
