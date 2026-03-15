'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';
import { trackCTAClick, trackLanguageSwitch } from '@/lib/analytics';

export function Header() {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/o-nas', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/kontakt', label: t('contact') },
  ];

  const altLocale = locale === 'pl' ? 'en' : 'pl';

  // transparent by default, frosted glass when scrolled or mobile menu open
  const light = scrolled || open;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'rgba(0,0,0,0)',
        backdropFilter: light ? 'blur(5px)' : 'none',
        WebkitBackdropFilter: light ? 'blur(5px)' : 'none',
        willChange: 'auto',
        transition: 'backdrop-filter 0.3s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="OurMoney">
          <Logo textColor={light ? '#141414' : '#ffffff'} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${light ? 'text-[#141414]/70 hover:text-[#141414]' : 'text-white/80 hover:text-white'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Lang + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={pathname}
            locale={altLocale}
            className={`text-xs uppercase tracking-widest transition-colors ${light ? 'text-[#141414]/40 hover:text-[#141414]/70' : 'text-white/40 hover:text-white/70'}`}
            onClick={() => trackLanguageSwitch(locale, altLocale)}
          >
            {altLocale}
          </Link>
          <a
            href={tCommon('appUrl')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#bbff00] text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#a2e600] transition-colors"
            onClick={() => trackCTAClick({ location: 'header', text: tCommon('startFree'), locale })}
          >
            {tCommon('startFree')}
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden p-1 transition-colors ${light ? 'text-[#141414]' : 'text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-black/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#141414] text-base font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-black/10">
            <Link
              href={pathname}
              locale={altLocale}
              className="text-xs text-[#141414]/40 uppercase tracking-widest"
              onClick={() => { setOpen(false); trackLanguageSwitch(locale, altLocale); }}
            >
              {altLocale}
            </Link>
            <a
              href={tCommon('appUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#bbff00] text-black text-sm font-semibold px-5 py-2 rounded-full"
              onClick={() => trackCTAClick({ location: 'header_mobile', text: tCommon('startFree'), locale })}
            >
              {tCommon('startFree')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
