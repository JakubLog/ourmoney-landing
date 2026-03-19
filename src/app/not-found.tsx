import Link from 'next/link';
import '@/app/globals.css';

export default function NotFound() {
  return (
    <html lang="pl">
      <body className="bg-[#141414] min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden relative">
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #bbff00 0%, transparent 70%)' }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#bbff00]"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
                opacity: 0.08 + i * 0.03,
                animation: `float-a ${4 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Giant 404 — layered with offset for depth */}
        <div className="relative select-none mb-2" aria-hidden="true">
          {/* Shadow layer */}
          <span
            className="absolute inset-0 font-display text-[12rem] md:text-[20rem] lg:text-[26rem] leading-none tracking-tighter"
            style={{
              color: 'transparent',
              WebkitTextStroke: '1px rgba(187, 255, 0, 0.06)',
              transform: 'translate(8px, 8px)',
            }}
          >
            404
          </span>
          {/* Outline layer */}
          <span
            className="absolute inset-0 font-display text-[12rem] md:text-[20rem] lg:text-[26rem] leading-none tracking-tighter"
            style={{
              color: 'transparent',
              WebkitTextStroke: '1px rgba(187, 255, 0, 0.12)',
              transform: 'translate(3px, 3px)',
            }}
          >
            404
          </span>
          {/* Main layer — accent gradient */}
          <span
            className="relative font-display text-[12rem] md:text-[20rem] lg:text-[26rem] leading-none tracking-tighter"
            style={{
              background: 'linear-gradient(180deg, #bbff00 0%, rgba(187, 255, 0, 0.15) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </span>
        </div>

        {/* Divider line */}
        <div className="w-12 h-px bg-[#bbff00]/30 mb-8" />

        {/* Copy */}
        <h1
          className="text-white/90 text-xl md:text-2xl mb-3 tracking-tight"
          style={{ fontFamily: '"Switzer", "Inter Tight", sans-serif', fontWeight: 500 }}
        >
          Zabłądziłeś? Nawet najlepszy budżet nie przewidzi tego.
        </h1>
        <p
          className="text-white/35 text-sm md:text-base max-w-md mb-12 leading-relaxed"
          style={{ fontFamily: '"Switzer", "Inter Tight", sans-serif' }}
        >
          Ta strona nie istnieje — ale Twoje finanse mogą wyglądać lepiej.
        </p>

        {/* CTA */}
        <Link
          href="/pl"
          className="group relative bg-[#bbff00] text-[#141414] font-semibold px-10 py-4 rounded-full text-sm hover:bg-[#a2e600] transition-all duration-300 hover:shadow-[0_0_40px_rgba(187,255,0,0.2)]"
          style={{ fontFamily: '"Switzer", "Inter Tight", sans-serif' }}
        >
          Wróć na stronę główną
        </Link>

        {/* Easter egg */}
        <p className="absolute bottom-6 text-white/10 text-xs tracking-widest uppercase">
          Error 404 · OurMoney
        </p>
      </body>
    </html>
  );
}
