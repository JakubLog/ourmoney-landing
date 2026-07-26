'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';
import { trackCTAClick, trackLanguageSwitch } from '@/lib/analytics';

export function Header() {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // --nav-p: 0 (transparent, full-width) -> 1 (glass pill), proporcjonalnie
  // do scrolla w zakresie 0-120px; otwarte menu wymusza pelny glass
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = open ? 1 : Math.min(1, Math.max(0, window.scrollY / 120));
      headerRef.current?.style.setProperty('--nav-p', p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [open]);

  const navLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/o-nas' as const, label: t('about') },
    { href: '/blog' as const, label: t('blog') },
    { href: '/kontakt' as const, label: t('contact') },
  ];

  const altLocale = locale === 'pl' ? 'en' : 'pl';

  return (
    <header ref={headerRef} className="nav-shell fixed top-0 left-0 right-0 z-50">
      <div className="nav-pill">
        <div className="nav-row px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="OurMoney - strona główna">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label={locale === 'pl' ? 'Nawigacja główna' : 'Main navigation'} className="hidden md:flex items-center">
            <ul className="flex items-center gap-8 list-none m-0 p-0">
              {navLinks.slice(1).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium group px-1 py-2 text-white/80 hover:text-white"
                  >
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-200 ease-out group-hover:-translate-y-full">
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 block translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0"
                      >
                        {link.label}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Lang + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href={pathname}
              locale={altLocale}
              className="text-xs uppercase tracking-widest group px-1 py-2 text-white/40 hover:text-white/70"
              onClick={() => trackLanguageSwitch(locale, altLocale)}
              hrefLang={altLocale}
            >
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-200 ease-out group-hover:-translate-y-full">
                  {altLocale}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0"
                >
                  {altLocale}
                </span>
              </span>
            </Link>
            <a
              href={tCommon('appUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen bg-[#bbff00] text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#a2e600] transition-colors"
              onClick={() => trackCTAClick({ location: 'header', text: tCommon('startFree'), locale })}
            >
              {tCommon('startFree')}
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-1 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Menu - glass sheet; zawsze w drzewie, zeby zamkniecie
            tez sie animowalo (grid 0fr <-> 1fr w .mobile-menu) */}
        <div id="mobile-menu" className={`mobile-menu md:hidden ${open ? 'mobile-menu--open' : ''}`} inert={!open}>
          <div>
            <nav aria-label={locale === 'pl' ? 'Menu mobilne' : 'Mobile menu'} className="border-t border-white/10 px-6 pb-8 flex flex-col">
            <ul className="list-none m-0 p-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-4 text-white text-lg font-medium border-b border-white/8 active:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-white/25" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3">
              <a
                href={tCommon('appUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#bbff00] text-black text-base font-semibold py-4 rounded-full text-center"
                onClick={() => trackCTAClick({ location: 'header_mobile', text: tCommon('startFree'), locale })}
              >
                {tCommon('startFree')}
              </a>
              <Link
                href={pathname}
                locale={altLocale}
                className="text-center text-xs text-white/35 uppercase tracking-widest py-3"
                hrefLang={altLocale}
                onClick={() => { setOpen(false); trackLanguageSwitch(locale, altLocale); }}
              >
                {altLocale}
              </Link>
            </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
