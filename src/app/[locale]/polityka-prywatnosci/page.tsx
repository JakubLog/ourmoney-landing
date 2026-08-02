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
  const t = await getTranslations({ locale, namespace: 'PrivacyPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.pl/${locale}/polityka-prywatnosci`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });

  return (
    <>
      <Header />
      <main>
        <section className="bg-dark pt-36 pb-16 px-6">
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

            <h2>1. Administrator danych osobowych</h2>
            <p>
              Administratorem danych osobowych zbieranych za pośrednictwem strony <strong>ourmoney.pl</strong> jest
              {' '}<strong>Jakub Fedoszczak</strong> oraz <strong>Magda Nestorowicz</strong>, prowadzący działalność pod marką <strong>OurMoney</strong>.
            </p>
            <p>
              Kontakt w sprawach ochrony danych osobowych:{' '}
              <CopyEmail email="kontakt@ourmoney.pl" className="underline hover:opacity-70" />
            </p>
            <p className="text-sm text-gray-500 italic">
              Administrator nie wyznaczył Inspektora Ochrony Danych (IOD).
            </p>

            <h2>2. Jakie dane zbieramy i w jakim celu</h2>

            <h3>2.1. Dane analityczne (Google Analytics 4)</h3>
            <p>
              Strona korzysta z Google Analytics 4 w celu analizy ruchu i poprawy jakości serwisu.
              GA4 zbiera m.in.: zanonimizowany adres IP, typ przeglądarki, system operacyjny,
              kraj odwiedzającego, odwiedzone podstrony, czas wizyty oraz interakcje z elementami strony.
            </p>
            <p>
              <strong>Podstawa prawna:</strong> zgoda użytkownika (art. 6 ust. 1 lit. a RODO).
              Dane są zbierane wyłącznie po wyrażeniu zgody w banerze cookies.
              Przed wyrażeniem zgody GA4 działa w trybie cookieless (Consent Mode v2) - zbiera
              wyłącznie anonimowe, zagregowane dane bez identyfikacji użytkownika.
            </p>
            <p>
              <strong>Okres przechowywania:</strong> dane w GA4 przechowywane są przez 14 miesięcy
              (domyślne ustawienie Google Analytics).
            </p>

            <h3>2.2. Dane z formularza kontaktowego</h3>
            <p>
              W przypadku wypełnienia formularza kontaktowego na stronie <strong>/kontakt</strong> zbieramy:
            </p>
            <ul>
              <li>Imię (opcjonalnie),</li>
              <li>Adres e-mail,</li>
              <li>Treść wiadomości.</li>
            </ul>
            <p>
              <strong>Podstawa prawna:</strong> prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO)
              - obsługa zapytań kierowanych przez użytkowników.
            </p>
            <p>
              <strong>Okres przechowywania:</strong> wiadomości przechowywane są przez okres niezbędny
              do obsługi zapytania, nie dłużej niż 24 miesiące.
            </p>

            <h3>2.3. Dane marketingowe (Meta Pixel)</h3>
            <p>
              Strona korzysta z Meta Pixel (Facebook/Instagram) w celu mierzenia skuteczności
              reklam i remarketingu. Meta Pixel jest aktywowany wyłącznie po wyrażeniu zgody
              na cookies marketingowych. Przed wyrażeniem zgody Pixel działa w trybie
              wstrzymanym (<code>fbq(&apos;consent&apos;, &apos;revoke&apos;)</code>) i nie zbiera danych
              umożliwiających identyfikację użytkownika.
            </p>
            <p>
              <strong>Podstawa prawna:</strong> zgoda użytkownika (art. 6 ust. 1 lit. a RODO).
            </p>
            <p>
              <strong>Okres przechowywania:</strong> dane w Meta Pixel przechowywane są przez
              okres do 180 dni (domyślne ustawienie Meta).
            </p>
            <p>
              <strong>Advanced Matching:</strong> po wyrażeniu zgody Meta Pixel może wykorzystywać
              funkcję Advanced Matching, która przesyła do Meta zahashowane (SHA-256) dane podane
              przez użytkownika w formularzu kontaktowym - adres e-mail oraz imię i nazwisko - w celu
              lepszego dopasowania konwersji do profilu użytkownika na platformie Meta. Dane te są
              hashowane po stronie przeglądarki przed wysłaniem i nie są przechowywane przez nas
              w postaci jawnej na serwerach Meta.
            </p>

            <h3>2.4. Google Tag Manager (GTM)</h3>
            <p>
              Strona korzysta z Google Tag Manager - narzędzia do zarządzania tagami analitycznymi
              i marketingowymi. GTM sam w sobie nie zbiera danych osobowych ani nie ustawia plików
              cookies. Służy wyłącznie jako kontener do ładowania innych narzędzi (GA4, Meta Pixel),
              które podlegają osobnym zasadom opisanym powyżej.
            </p>

            <h2>3. Pliki cookies</h2>
            <p>Strona wykorzystuje następujące rodzaje plików cookies:</p>
            <ul>
              <li>
                <strong>Niezbędne</strong> - przechowują informację o wyrażonej (lub odmówionej)
                zgodzie na cookies (<code>ourmoney_cookie_consent</code> w localStorage).
                Nie wymagają zgody.
              </li>
              <li>
                <strong>Analityczne</strong> - pliki Google Analytics: <code>_ga</code>,{' '}
                <code>_ga_J6Z26RXMQY</code>. Aktywowane wyłącznie po wyrażeniu zgody.
                Okres ważności: do 2 lat.
              </li>
              <li>
                <strong>Marketingowe</strong> - pliki Meta Pixel: <code>_fbp</code>,{' '}
                <code>_fbc</code>. Aktywowane wyłącznie po wyrażeniu zgody. Okres ważności: do 90 dni.
              </li>
            </ul>
            <p>
              Możesz wycofać zgodę na cookies w dowolnym momencie, usuwając dane przechowywane
              przez przeglądarkę lub kontaktując się z nami pod adresem{' '}
              <CopyEmail email="kontakt@ourmoney.pl" className="underline hover:opacity-70" />.
            </p>

            <h2>4. Podmioty przetwarzające dane (procesory)</h2>
            <p>
              W celu świadczenia usług korzystamy z następujących podmiotów zewnętrznych,
              którym powierzamy przetwarzanie danych:
            </p>

            <h3>4.1. Google LLC (Google Analytics 4)</h3>
            <p>
              Usługa analityczna. Google LLC z siedzibą w USA przetwarza dane na podstawie
              standardowych klauzul umownych (SCC). Polityka prywatności Google:{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                policies.google.com/privacy
              </a>.
            </p>

            <h3>4.2. Meta Platforms Ireland Ltd (Meta Pixel)</h3>
            <p>
              Narzędzie marketingowe służące do mierzenia skuteczności reklam i remarketingu.
              Meta Platforms Ireland Ltd z siedzibą w Irlandii (UE) przetwarza
              dane zgodnie z RODO. Polityka prywatności Meta:{' '}
              <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
                facebook.com/privacy/policy
              </a>.
            </p>

            <h3>4.3. Vercel Inc. (hosting)</h3>
            <p>
              Strona hostowana jest na platformie Vercel Inc. z siedzibą w USA. Vercel może przetwarzać
              dane techniczne (adresy IP, logi HTTP) na serwerach zlokalizowanych poza EOG.
              Przetwarzanie odbywa się na podstawie SCC. Polityka prywatności Vercel:{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                vercel.com/legal/privacy-policy
              </a>.
            </p>

            <h3>4.4. ClickUp Technologies Inc. (obsługa formularza kontaktowego)</h3>
            <p>
              Wiadomości przesłane przez formularz kontaktowy trafiają do systemu zarządzania
              zadaniami ClickUp, którego operatorem jest ClickUp Technologies Inc. z siedzibą w USA.
              Przetwarzanie odbywa się na podstawie SCC. Polityka prywatności ClickUp:{' '}
              <a href="https://clickup.com/privacy" target="_blank" rel="noopener noreferrer">
                clickup.com/privacy
              </a>.
            </p>

            <h2>5. Przekazywanie danych do państw trzecich</h2>
            <p>
              Część podmiotów przetwarzających (Google, Vercel, ClickUp) ma siedzibę w Stanach Zjednoczonych
              - poza Europejskim Obszarem Gospodarczym. Przekazywanie danych odbywa się na podstawie
              standardowych klauzul umownych (SCC) zatwierdzonych przez Komisję Europejską,
              co zapewnia odpowiedni poziom ochrony danych.
            </p>

            <h2>6. Wiek użytkowników</h2>
            <p>
              Strona kierowana jest do użytkowników, którzy ukończyli 16 lat. Przetwarzanie danych
              osobowych osób poniżej 16. roku życia na podstawie zgody wymaga zgody rodzica
              lub opiekuna prawnego (art. 8 RODO).
            </p>

            <h2>7. Prawa użytkownika</h2>
            <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
            <ul>
              <li><strong>Prawo dostępu</strong> - możesz zażądać kopii swoich danych.</li>
              <li><strong>Prawo do sprostowania</strong> - możesz żądać poprawienia nieprawidłowych danych.</li>
              <li><strong>Prawo do usunięcia</strong> - możesz żądać usunięcia danych („prawo do bycia zapomnianym”).</li>
              <li><strong>Prawo do ograniczenia przetwarzania</strong> - możesz żądać ograniczenia przetwarzania Twoich danych.</li>
              <li><strong>Prawo do przenoszenia danych</strong> - możesz otrzymać swoje dane w formacie nadającym się do odczytu maszynowego.</li>
              <li><strong>Prawo sprzeciwu</strong> - możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie.</li>
              <li><strong>Prawo cofnięcia zgody</strong> - możesz wycofać zgodę na cookies w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania przed jej cofnięciem.</li>
            </ul>
            <p>
              Aby skorzystać z powyższych praw, skontaktuj się z nami:{' '}
              <CopyEmail email="kontakt@ourmoney.pl" className="underline hover:opacity-70" />.
              Na Twoje żądanie odpowiemy w terminie 30 dni.
            </p>
            <p>
              Masz również prawo wniesienia skargi do organu nadzorczego -
              Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.
            </p>

            <h2>8. Zmiany w Polityce Prywatności</h2>
            <p>
              Administrator zastrzega sobie prawo do zmiany niniejszej Polityki. Aktualna wersja
              zawsze dostępna jest pod adresem{' '}
              <a href="https://ourmoney.pl/pl/polityka-prywatnosci">
                ourmoney.pl/pl/polityka-prywatnosci
              </a>. Data ostatniej aktualizacji widoczna jest na górze strony.
            </p>

            <h2>9. Kontakt</h2>
            <p>
              W sprawach dotyczących niniejszej Polityki Prywatności oraz przetwarzania
              danych osobowych prosimy o kontakt:{' '}
              <CopyEmail email="kontakt@ourmoney.pl" className="underline hover:opacity-70" />
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
