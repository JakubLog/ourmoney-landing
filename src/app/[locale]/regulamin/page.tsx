import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CopyEmail } from '@/components/ui/CopyEmail';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.pl/${locale}/regulamin`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'TermsPage' });

  return (
    <>
      <Header />
      <main>
        <section className="bg-[#141414] pt-36 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl text-white">{t('title')}</h1>
            <p className="text-white/40 text-sm mt-4">{t('lastUpdated')}</p>
          </div>
        </section>

        <section className="bg-white py-16 px-6">
          <div className="max-w-3xl mx-auto prose prose-slate max-w-none">

            <p
              className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose text-amber-800"
              dangerouslySetInnerHTML={{ __html: `<strong>${locale === 'pl' ? 'Uwaga' : 'Note'}:</strong> ${t.raw('disclaimer')}` }}
            />

            <h2>1. Postanowienia ogólne</h2>
            <p>
              Niniejszy Regulamin określa zasady korzystania ze strony internetowej{' '}
              <strong>ourmoney.pl</strong> (dalej: „Strona"), prowadzonej przez{' '}
              <strong>Jakub Fedoszczak</strong> oraz <strong>Magda Nestorowicz</strong>, działających pod marką <strong>OurMoney</strong>
              {' '}(dalej: „Operator"), dostępnego pod adresem e-mail:{' '}
              <CopyEmail email="kontakt@ourmoney.pl" className="underline hover:opacity-70" />.
            </p>
            <p>
              Strona ma charakter informacyjny i prezentuje produkt - aplikację mobilną OurMoney
              dostępną pod adresem <a href="https://app.ourmoney.pl">app.ourmoney.pl</a>.
              Korzystanie ze Strony jest bezpłatne i dobrowolne.
            </p>

            <h2>2. Zasady korzystania ze Strony</h2>
            <p>Użytkownik zobowiązuje się do korzystania ze Strony zgodnie z:</p>
            <ul>
              <li>obowiązującymi przepisami prawa,</li>
              <li>zasadami współżycia społecznego,</li>
              <li>postanowieniami niniejszego Regulaminu.</li>
            </ul>
            <p>Zabrania się w szczególności:</p>
            <ul>
              <li>podejmowania działań mogących zakłócić działanie Strony,</li>
              <li>automatycznego pobierania treści Strony (scraping) bez zgody Operatora,</li>
              <li>podszywania się pod Operatora lub markę OurMoney,</li>
              <li>rozpowszechniania treści naruszających prawa osób trzecich.</li>
            </ul>

            <h2>3. Formularz kontaktowy</h2>
            <p>
              Strona udostępnia formularz kontaktowy umożliwiający przesłanie zapytania do Operatora.
              Korzystając z formularza, Użytkownik wyraża zgodę na przetwarzanie danych osobowych
              podanych w formularzu w celu udzielenia odpowiedzi na zapytanie. Szczegóły dotyczące
              przetwarzania danych zawarte są w{' '}
              <a href="/polityka-prywatnosci">Polityce Prywatności</a>.
            </p>
            <p>
              Operator zastrzega sobie prawo do nieudzielenia odpowiedzi na zapytania zawierające
              treści niezgodne z prawem, wulgarne lub naruszające dobra osobiste.
            </p>

            <h2>4. Własność intelektualna</h2>
            <p>
              Wszelkie treści zamieszczone na Stronie - w tym teksty, grafiki, logotypy, ikony,
              zdjęcia, materiały wideo oraz kod źródłowy - stanowią własność Operatora lub podmiotów,
              które udzieliły licencji na ich wykorzystanie, i są chronione przepisami prawa
              autorskiego oraz innych przepisów o własności intelektualnej.
            </p>
            <p>
              Dozwolone jest udostępnianie linków do Strony. Kopiowanie, modyfikowanie,
              dystrybucja lub komercyjne wykorzystanie treści Strony bez pisemnej zgody Operatora
              jest zabronione.
            </p>

            <h2>5. Linki zewnętrzne</h2>
            <p>
              Strona zawiera odnośniki do zewnętrznych serwisów, w tym do aplikacji OurMoney
              (<a href="https://app.ourmoney.pl">app.ourmoney.pl</a>). Operator nie ponosi
              odpowiedzialności za treść, bezpieczeństwo ani politykę prywatności zewnętrznych stron
              internetowych, do których prowadzą zamieszczone linki.
            </p>

            <h2>6. Wyłączenie odpowiedzialności</h2>
            <p>
              Operator dokłada wszelkich starań, aby informacje zamieszczone na Stronie były
              aktualne i rzetelne, jednak nie gwarantuje ich kompletności ani dokładności.
            </p>
            <p>Operator nie ponosi odpowiedzialności za:</p>
            <ul>
              <li>przerwy w dostępności Strony spowodowane pracami technicznymi lub awariami,</li>
              <li>szkody wynikające z korzystania ze Strony lub niemożności korzystania z niej,</li>
              <li>decyzje podjęte przez Użytkownika na podstawie treści Strony,</li>
              <li>treść stron zewnętrznych, do których prowadzą linki zamieszczone na Stronie.</li>
            </ul>

            <h2>7. Dostępność Strony</h2>
            <p>
              Operator zastrzega sobie prawo do czasowego zawieszenia działania Strony w celu
              przeprowadzenia prac konserwacyjnych, aktualizacji lub z innych uzasadnionych przyczyn,
              bez wcześniejszego powiadomienia Użytkowników.
            </p>

            <h2>8. Zmiany Regulaminu</h2>
            <p>
              Operator zastrzega sobie prawo do zmiany niniejszego Regulaminu. Aktualna wersja
              Regulaminu zawsze dostępna jest pod adresem{' '}
              <a href="https://ourmoney.pl/pl/regulamin">ourmoney.pl/pl/regulamin</a>.
              Data ostatniej aktualizacji widoczna jest na górze strony.
            </p>
            <p>
              Dalsze korzystanie ze Strony po wprowadzeniu zmian oznacza akceptację
              zaktualizowanego Regulaminu.
            </p>

            <h2>9. Prawo właściwe</h2>
            <p>
              Niniejszy Regulamin podlega prawu polskiemu. Wszelkie spory wynikające z korzystania
              ze Strony będą rozstrzygane przez sąd właściwy dla siedziby Operatora.
            </p>

            <h2>10. Kontakt</h2>
            <p>
              W przypadku pytań dotyczących niniejszego Regulaminu prosimy o kontakt:{' '}
              <CopyEmail email="kontakt@ourmoney.pl" className="underline hover:opacity-70" />
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
