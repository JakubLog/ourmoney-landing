'use client';

import { trackCTAClick } from '@/lib/analytics';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  location: string;
  locale: string;
  postSlug?: string;
};

export function TrackedCTALink({ href, children, className, location, locale, postSlug }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackCTAClick({
          location,
          text: typeof children === 'string' ? children : location,
          locale,
          postSlug,
        })
      }
    >
      {children}
    </a>
  );
}
