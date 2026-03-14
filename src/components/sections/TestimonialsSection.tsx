import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';

type Props = { locale: string };

type Testimonial = { name: string; rating: number; quote: string };

export async function TestimonialsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.testimonials' });
  const items = t.raw('items') as Testimonial[];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-[#141414] text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-[#f7f7f7] rounded-2xl p-8 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="fill-[#bbff00] text-[#bbff00]"
                  />
                ))}
              </div>
              <p className="text-[#141414]/80 text-sm leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="text-[#141414] font-semibold text-sm mt-auto">
                — {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
