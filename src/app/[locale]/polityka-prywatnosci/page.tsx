import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.app/${locale}/polityka-prywatnosci`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });

  return (
    <>
      <Header />
      <main>
        <section className="bg-[#141414] pt-36 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl text-white">{t('title')}</h1>
          </div>
        </section>

        <section className="bg-white py-16 px-6">
          <div className="max-w-3xl mx-auto prose prose-slate max-w-none">
            <h2>1. Informacje ogólne</h2>
            <p>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych użytkowników aplikacji OurMoney (dalej: „Aplikacja"), dostępnej pod adresem <a href="https://app.ourmoney.pl">https://app.ourmoney.pl</a>.</p>
            <p>Administratorem danych osobowych jest zespół OurMoney (dalej: „Administrator"). W sprawach związanych z ochroną danych osobowych można kontaktować się pod adresem e-mail: <a href="mailto:kontakt@ourmoney.pl">kontakt@ourmoney.pl</a>.</p>
            <p>Aplikacja jest progresywną aplikacją webową (PWA) służącą do wspólnego zarządzania budżetem domowym przez pary.</p>

            <h2>2. Jakie dane zbieramy</h2>
            <h3>2.1. Dane uwierzytelniające</h3>
            <ul>
              <li>Adres e-mail — niezbędny do rejestracji i logowania.</li>
              <li>Hash hasła — przechowywany w zaszyfrowanej formie (w przypadku rejestracji przez e-mail).</li>
              <li>Dane z konta Google — w przypadku logowania przez Google OAuth pobieramy wyłącznie adres e-mail oraz podstawowe informacje z profilu (imię, zdjęcie profilowe). Zakres uprawnień ograniczony jest do <code>email</code> i <code>profile</code>.</li>
              <li>Tokeny sesji — przechowywane lokalnie w przeglądarce użytkownika (localStorage).</li>
            </ul>

            <h3>2.2. Dane profilowe</h3>
            <ul>
              <li>Nazwa użytkownika (obowiązkowa).</li>
              <li>Imię i nazwisko (opcjonalnie).</li>
              <li>Pseudonim (opcjonalnie, domyślnie generowany na podstawie nazwy użytkownika).</li>
              <li>Zdjęcie profilowe (avatar) — maksymalny rozmiar pliku: 5 MB.</li>
            </ul>

            <h3>2.3. Dane workspace i partnerstwa</h3>
            <ul>
              <li>Nazwa workspace.</li>
              <li>Typ podziału wydatków (50/50, proporcjonalny, tracking).</li>
              <li>Adres e-mail partnera — podawany przy wysyłaniu zaproszenia do wspólnego workspace.</li>
              <li>Miesięczny dochód każdego użytkownika w workspace.</li>
              <li>Procentowy podział wydatków między partnerami.</li>
            </ul>

            <h3>2.4. Dane finansowe</h3>
            <p>Wszystkie dane finansowe są wprowadzane ręcznie przez użytkownika. Aplikacja nie łączy się z bankami ani innymi instytucjami finansowymi. Zbieramy:</p>
            <ul>
              <li>Transakcje wydatków (kwota, opis, data, kategoria, informacja o tym, kto zapłacił).</li>
              <li>Transakcje przychodów (kwota, opis, data, źródło).</li>
              <li>Transakcje oszczędności (kwota, typ: wpłata/wypłata, cel oszczędnościowy).</li>
              <li>Budżety miesięczne i plany finansowe.</li>
              <li>Kategorie wydatków, przychodów i oszczędności.</li>
              <li>Zobowiązania cykliczne (np. subskrypcje).</li>
              <li>Inwestycje (nazwa, typ, ilość, ceny zakupu/bieżące).</li>
            </ul>

            <h3>2.5. Czego NIE zbieramy</h3>
            <p>Aplikacja nie zbiera następujących danych:</p>
            <ul>
              <li>Numeru telefonu.</li>
              <li>Adresu zamieszkania.</li>
              <li>Daty urodzenia.</li>
              <li>Numerów dokumentów tożsamości (PESEL, dowód osobisty, paszport).</li>
              <li>Numerów kont bankowych ani kart płatniczych.</li>
              <li>Danych lokalizacyjnych (GPS).</li>
              <li>Identyfikatorów urządzenia.</li>
            </ul>

            <h2>3. Cele przetwarzania danych</h2>
            <p>Dane osobowe przetwarzamy w następujących celach:</p>
            <ul>
              <li><strong>Świadczenie usługi</strong> — umożliwienie rejestracji, logowania, tworzenia workspace i zarządzania budżetem (podstawa: wykonanie umowy, art. 6 ust. 1 lit. b RODO).</li>
              <li><strong>Personalizacja</strong> — dostosowanie interfejsu i wyświetlanie danych profilowych (podstawa: prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).</li>
              <li><strong>Generowanie raportów AI</strong> — przetwarzanie zagregowanych danych finansowych w celu tworzenia spersonalizowanych raportów i analiz (podstawa: wykonanie umowy, art. 6 ust. 1 lit. b RODO).</li>
              <li><strong>Analityka i rozwój produktu</strong> — badanie sposobu korzystania z Aplikacji w celu jej ulepszania (podstawa: prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).</li>
              <li><strong>Diagnostyka błędów</strong> — identyfikacja i naprawa problemów technicznych (podstawa: prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).</li>
            </ul>

            <h2>4. Narzędzia zewnętrzne i podmioty przetwarzające</h2>
            <h3>4.1. Supabase</h3>
            <p>Dane użytkowników przechowywane są w infrastrukturze Supabase. Supabase zapewnia szyfrowanie danych w spoczynku i podczas transmisji.</p>
            <h3>4.2. Vercel</h3>
            <p>Aplikacja jest hostowana na platformie Vercel. Vercel może przetwarzać dane techniczne związane z żądaniami HTTP (adresy IP, nagłówki przeglądarki).</p>
            <h3>4.3. Google OAuth</h3>
            <p>W przypadku logowania przez Google, dane uwierzytelniające są przetwarzane zgodnie z Polityką Prywatności Google. OurMoney pobiera wyłącznie adres e-mail i podstawowe dane profilowe (imię, zdjęcie). Dane finansowe przechowywane w OurMoney nie są udostępniane Google w ramach procesu uwierzytelniania.</p>
            <h3>4.4. Google Gemini (raporty AI)</h3>
            <p>Zagregowane dane finansowe użytkownika mogą być przesyłane do modelu Google Gemini 2.5 Flash w celu generowania raportów i analiz finansowych. Dane te są przetwarzane w formie zagregowanej i służą wyłącznie do wygenerowania odpowiedzi dla użytkownika.</p>
            <h3>4.5. PostHog (analityka)</h3>
            <p>Do analizy sposobu korzystania z Aplikacji wykorzystujemy narzędzie PostHog. Stosujemy maskowanie danych: automatyczne przechwytywanie (autocapture) jest wyłączone, pola formularzy są maskowane, a kwoty finansowe przesyłane są wyłącznie jako zakresy wartości.</p>
            <h3>4.6. Sentry (monitoring błędów)</h3>
            <p>Do śledzenia i diagnozowania błędów technicznych wykorzystujemy Sentry. Zbierane dane obejmują stack trace&apos;y błędów JavaScript, adres URL strony, na której wystąpił błąd, identyfikator użytkownika i adres e-mail.</p>

            <h2>5. Przechowywanie danych</h2>
            <p>Dane użytkownika przechowujemy przez cały okres korzystania z Aplikacji. Po usunięciu konta dane osobowe są usuwane w ciągu 30 dni, z wyjątkiem danych, których przechowywanie wymagane jest przepisami prawa.</p>

            <h2>6. Bezpieczeństwo danych</h2>
            <p>Stosujemy następujące środki ochrony danych:</p>
            <ul>
              <li>Szyfrowanie transmisji danych (HTTPS/TLS).</li>
              <li>Szyfrowanie danych w spoczynku w bazie danych (Supabase).</li>
              <li>Hashowanie haseł — hasła nigdy nie są przechowywane w postaci jawnej.</li>
              <li>Polityka Row Level Security (RLS) w Supabase — użytkownicy mają dostęp wyłącznie do danych własnego workspace.</li>
              <li>Maskowanie danych wrażliwych w narzędziach analitycznych.</li>
            </ul>

            <h2>7. Prawa użytkownika</h2>
            <p>Zgodnie z RODO, każdy użytkownik ma prawo do: dostępu do swoich danych osobowych, sprostowania nieprawidłowych danych, usunięcia danych (&ldquo;prawo do bycia zapomnianym&rdquo;), ograniczenia przetwarzania, przenoszenia danych, sprzeciwu wobec przetwarzania oraz cofnięcia zgody w dowolnym momencie.</p>
            <p>W celu realizacji powyższych praw prosimy o kontakt pod adresem: <a href="mailto:kontakt@ourmoney.pl">kontakt@ourmoney.pl</a>.</p>

            <h2>8. Pliki cookies i dane lokalne</h2>
            <p>Aplikacja wykorzystuje tokeny sesji przechowywane w localStorage przeglądarki — niezbędne do utrzymania sesji logowania. Pliki cookies mogą być stosowane przez narzędzia zewnętrzne (PostHog, Sentry) w celach analitycznych i diagnostycznych.</p>

            <h2>9. Przekazywanie danych do państw trzecich</h2>
            <p>W związku z korzystaniem z usług podmiotów zewnętrznych (Supabase, Vercel, Google, PostHog, Sentry), dane osobowe mogą być przekazywane do państw spoza Europejskiego Obszaru Gospodarczego, w tym do Stanów Zjednoczonych. Przekazywanie odbywa się na podstawie odpowiednich mechanizmów prawnych, takich jak standardowe klauzule umowne (SCC).</p>

            <h2>10. Zmiany w Polityce Prywatności</h2>
            <p>Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. O istotnych zmianach użytkownicy zostaną poinformowani za pośrednictwem Aplikacji lub drogą e-mailową.</p>

            <h2>11. Kontakt</h2>
            <p>W przypadku pytań dotyczących niniejszej Polityki Prywatności lub przetwarzania danych osobowych prosimy o kontakt: <a href="mailto:kontakt@ourmoney.pl">kontakt@ourmoney.pl</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
