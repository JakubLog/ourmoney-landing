import { getTranslations } from 'next-intl/server';
import { TestimonialsCarousel } from './TestimonialsCarousel';

type Props = { locale: string };
type Testimonial = { name: string; rating: number; quote: string };

export async function TestimonialsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.testimonials' });
  const items = t.raw('items') as Testimonial[];

  return (
    <section className="bg-[#E6E1D9] py-24 overflow-hidden">
      <h2 className="font-display text-4xl md:text-5xl text-[#141414] text-center leading-tight mb-14 px-6">
        {t('title')}
      </h2>
      <TestimonialsCarousel items={items} />
    </section>
  );
}
