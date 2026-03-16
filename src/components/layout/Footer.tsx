'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Instagram, Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');

  const links = [
    { href: '/o-nas', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/kontakt', label: t('contact') },
    { href: '/regulamin', label: t('terms') },
    { href: '/polityka-prywatnosci', label: t('privacy') },
  ];

  return (
    <footer className="bg-[#141414] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-8 border-b border-white/10">
          {/* Logo */}
          <Link href="/" aria-label="OurMoney">
            <Image
              src="/ourmoney-logo-hero.svg"
              alt="OurMoney"
              width={100}
              height={17}
              className="h-[17px] w-auto opacity-80 hover:opacity-100 transition-opacity"
              unoptimized
            />
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${tFooter('email')}`}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Mail size={15} />
              {tFooter('email')}
            </a>
            <a
              href={tFooter('instagram')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <p className="mt-6 text-xs text-white/40">{tFooter('copyright')}</p>
      </div>
    </footer>
  );
}
