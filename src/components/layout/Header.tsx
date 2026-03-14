'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

export function Header() {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/o-nas', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/kontakt', label: t('contact') },
  ];

  const altLocale = locale === 'pl' ? 'en' : 'pl';

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="OurMoney">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ourmoney-logo-hero.svg"
            alt="OurMoney"
            width={134}
            height={23}
            className="h-[23px] w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
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
            className="text-sm text-white/50 hover:text-white/80 uppercase transition-colors"
          >
            {altLocale}
          </Link>
          <a
            href={tCommon('appUrl')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#bbff00] text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#a2e600] transition-colors"
          >
            {tCommon('startFree')}
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-6 py-6 flex flex-col gap-5" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 text-base"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            <Link
              href={pathname}
              locale={altLocale}
              className="text-sm text-white/50 uppercase"
              onClick={() => setOpen(false)}
            >
              {altLocale}
            </Link>
            <a
              href={tCommon('appUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#bbff00] text-black text-sm font-semibold px-5 py-2 rounded-full"
            >
              {tCommon('startFree')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
