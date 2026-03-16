import { getTranslations } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries';
import { TestimonialsCarousel } from './TestimonialsCarousel';

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
      ? { next: { revalidate: 86400, tags: ['testimonials'] } }
      : { cache: 'no-store' as const },
  );

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#E6E1D9] py-24 overflow-hidden">
      <h2 className="font-display text-4xl md:text-5xl text-[#141414] text-center leading-tight mb-14 px-6">
        {t('title')}
      </h2>
      <TestimonialsCarousel items={items} />
    </section>
  );
}
