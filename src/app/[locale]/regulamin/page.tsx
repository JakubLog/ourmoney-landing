import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.app/${locale}/regulamin`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsPage' });

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
            {/* TODO: Replace with OurMoney-specific terms */}
            <p className="text-sm text-gray-400 mb-8 italic">Ostatnia aktualizacja: 14 marca 2026</p>

            <h2>1. Korzystanie z usług</h2>
            <p>Aby korzystać z OurMoney, musisz mieć ukończone 18 lat. Zgadzasz się korzystać z naszych usług wyłącznie w celach zgodnych z prawem i obowiązującymi przepisami.</p>

            <h2>2. Odpowiedzialność za konto</h2>
            <p>Jesteś odpowiedzialny za zachowanie poufności swojego konta i za wszelką aktywność prowadzoną pod Twoim loginem. Powiadom nas niezwłocznie, jeśli podejrzewasz nieautoryzowane użycie.</p>

            <h2>3. Płatności i rozliczenia</h2>
            <p>Aktualnie aplikacja OurMoney jest bezpłatna. W przyszłości planujemy wprowadzenie subskrypcji miesięcznej. O wszelkich zmianach cennikowych będziemy informować z odpowiednim wyprzedzeniem.</p>

            <h2>4. Własność intelektualna</h2>
            <p>Wszystkie treści, marka i oprogramowanie są własnością OurMoney lub naszych licencjodawców. Nie możesz kopiować, modyfikować ani odsprzedawać naszych materiałów bez pozwolenia.</p>

            <h2>5. Zakończenie korzystania</h2>
            <p>Możemy zawiesić lub zakończyć Twój dostęp, jeśli naruszysz niniejszy regulamin lub korzystasz z naszych usług w szkodliwy lub obraźliwy sposób.</p>

            <h2>6. Wyłączenia odpowiedzialności</h2>
            <p>Nasze usługi świadczymy &ldquo;w stanie, w jakim są&rdquo;, bez jakichkolwiek gwarancji. Nie gwarantujemy nieprzerwanego ani bezbłędnego działania usługi.</p>

            <h2>7. Ograniczenie odpowiedzialności</h2>
            <p>OurMoney nie ponosi odpowiedzialności za jakiekolwiek pośrednie lub wtórne szkody wynikające z korzystania z naszych usług.</p>

            <h2>8. Zmiany Regulaminu</h2>
            <p>Możemy aktualizować niniejszy Regulamin. Dalsze korzystanie z aplikacji po wprowadzeniu zmian oznacza ich akceptację.</p>

            <h2>9. Kontakt</h2>
            <p>W przypadku pytań dotyczących Regulaminu skontaktuj się z nami: <a href="mailto:kontakt@ourmoney.pl">kontakt@ourmoney.pl</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
