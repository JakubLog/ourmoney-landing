'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackFaqOpen, trackSectionView } from '@/lib/analytics';

// Globalny tracker interakcji - montowany raz w layout.
// Sekcje deklaruja sie atrybutami (server components, zero wlasnego JS):
//   data-section-view="pricing"  -> event section_view przy wejsciu w viewport
//   data-track-faq               -> kontener akordeonu <details>, event faq_open
// Koszt runtime: 1 delegowany listener 'toggle' + 1 IntersectionObserver.
export function InteractionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = document.documentElement.lang || 'pl';

    // faq_open - 'toggle' nie bąbelkuje, ale faza capture łapie je na document
    const seenQuestions = new Set<string>();
    function onToggle(e: Event) {
      const details = e.target as HTMLDetailsElement;
      if (!details.open || !details.closest('[data-track-faq]')) return;
      const question = details.querySelector('summary')?.textContent?.trim() ?? '';
      if (!question || seenQuestions.has(question)) return;
      seenQuestions.add(question);
      trackFaqOpen(question, locale);
    }
    document.addEventListener('toggle', onToggle, true);

    // section_view - fire-once per sekcja per pageview
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = (entry.target as HTMLElement).dataset.sectionView;
          observer.unobserve(entry.target);
          if (section) trackSectionView(section, locale);
        }
      },
      // Sekcja liczy sie jako obejrzana, gdy jej gorna krawedz minie 60% viewportu
      { threshold: 0, rootMargin: '0px 0px -40% 0px' },
    );
    document.querySelectorAll('[data-section-view]').forEach((el) => observer.observe(el));

    return () => {
      document.removeEventListener('toggle', onToggle, true);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
