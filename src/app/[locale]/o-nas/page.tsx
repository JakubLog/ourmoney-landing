import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';

type Props = { params: Promise<{ locale: string }> };

type TeamMember = { name: string; role: string; bio: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.app/${locale}/o-nas`,
      languages: {
        pl: 'https://ourmoney.app/pl/o-nas',
        en: 'https://ourmoney.app/en/o-nas',
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  const members = t.raw('team.members') as TeamMember[];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[#141414] pt-36 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-8">
              {t('hero.headline')}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-[#141414] mb-6">
              {t('mission.title')}
            </h2>
            <p className="text-[#141414]/70 text-lg leading-relaxed mb-6">
              {t('mission.description')}
            </p>
            <p className="text-[#141414]/70 text-base leading-relaxed border-l-4 border-[#bbff00] pl-6">
              {t('mission.story')}
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="bg-[#f7f7f7] py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-[#141414] text-center mb-16">
              {t('team.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {members.map((member, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border border-[#e2dbd2]"
                >
                  <div className="w-14 h-14 bg-[#141414] rounded-full flex items-center justify-center mb-5">
                    <span className="text-[#bbff00] font-bold text-xl">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-[#141414] font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-[#bbff00] text-sm font-medium mb-4">{member.role}</p>
                  <p className="text-[#141414]/60 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
