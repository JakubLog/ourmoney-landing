import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';
import { StartRedirect } from '@/components/start/StartRedirect';
import { detectPlatform, parsePlan } from '@/lib/appLinks';

// Strona przejscia musi widziec User-Agent i ?plan= przy kazdym wejsciu -
// zadnego prerenderu ani cache'u.
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'StartPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    // Bramka do aplikacji - nie ma czego indeksowac, ale linki maja dzialac
    robots: { index: false, follow: true },
    alternates: { canonical: `https://ourmoney.pl/${locale}/start` },
  };
}

export default async function StartPage({ params, searchParams }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'pl' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);

  const [t, tCommon, query, headerList] = await Promise.all([
    getTranslations({ locale, namespace: 'StartPage' }),
    getTranslations({ locale, namespace: 'Common' }),
    searchParams,
    headers(),
  ]);

  const plan = parsePlan(query.plan);
  const initialPlatform = detectPlatform(headerList.get('user-agent') ?? '');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark px-6 py-16 text-center">
      <Link href="/" aria-label="OurMoney">
        <Logo />
      </Link>

      <h1 className="font-display mt-12 max-w-lg text-4xl leading-tight text-white md:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">{t('subtitle')}</p>

      {plan === 'premium' && (
        <div className="mt-8 rounded-panel border border-accent/25 bg-accent/[0.07] px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t('planPremiumLabel')}
          </p>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/60">
            {t('planPremiumNote')}
          </p>
        </div>
      )}

      <div className="mt-12">
        <StartRedirect locale={locale} plan={plan} initialPlatform={initialPlatform} />
      </div>

      <Link
        href="/"
        className="mt-12 text-xs uppercase tracking-widest text-white/30 transition-colors hover:text-white/60"
      >
        {tCommon('backToHome')}
      </Link>
    </main>
  );
}
