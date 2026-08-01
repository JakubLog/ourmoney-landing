import { getTranslations } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = { locale: string };

type Testimonial = {
  _id: string;
  name: string;
  quote: string;
  rating: number;
  photoUrl: string | null;
};

export async function TestimonialsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.testimonials' });

  const items = await client.fetch<Testimonial[]>(
    TESTIMONIALS_QUERY,
    { language: locale },
    process.env.NODE_ENV === 'production'
      ? { next: { revalidate: 86400, tags: ['landing'] } }
      : { cache: 'no-store' as const },
  );

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-sand py-20 md:py-28 overflow-hidden">
      <ScrollReveal className="px-6">
        <h2 className="font-display text-4xl md:text-5xl text-dark text-center leading-tight mb-12 md:mb-16">
          {t('title')}
        </h2>
      </ScrollReveal>
      <TestimonialsCarousel items={items} />
    </section>
  );
}
