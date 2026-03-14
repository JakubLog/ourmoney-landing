import Link from 'next/link';
import '@/app/globals.css';

export default function NotFound() {
  return (
    <html lang="pl">
      <body
        style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}
        className="bg-[#141414] min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="text-white text-5xl font-bold mb-4">
          Ups, coś poszło nie tak!
        </h1>
        <p className="text-white/60 text-lg mb-10">
          Link może być nieaktywny lub strona została usunięta.
        </p>
        <Link
          href="/pl"
          className="bg-[#bbff00] text-black font-semibold px-8 py-4 rounded-full hover:bg-[#a2e600] transition-colors"
        >
          Wróć na stronę główną
        </Link>
      </body>
    </html>
  );
}
