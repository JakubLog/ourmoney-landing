import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Instagram, Mail } from 'lucide-react';
import { CopyEmail } from '@/components/ui/CopyEmail';

export async function Footer() {
  const t = await getTranslations('Navigation');
  const tFooter = await getTranslations('Footer');

  const links = [
    { href: '/kalkulator', label: t('calculator') },
    { href: '/o-nas', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/kontakt', label: t('contact') },
    { href: '/regulamin', label: t('terms') },
    { href: '/polityka-prywatnosci', label: t('privacy') },
  ];

  return (
    <footer className="bg-dark text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top: logo + contact */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10">
          <Link href="/" aria-label="OurMoney">
            <Image
              src="/ourmoney-logo-hero.svg"
              alt="OurMoney"
              title="OurMoney"
              width={100}
              height={17}
              className="h-[17px] w-auto opacity-80 hover:opacity-100 transition-opacity"
              unoptimized
            />
          </Link>

          <div className="flex items-center gap-4">
            <CopyEmail
              email={tFooter('email')}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Mail size={15} />
              <span className="hidden sm:inline">{tFooter('email')}</span>
            </CopyEmail>
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

        {/* Nav links */}
        <nav className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-3 py-8 border-b border-white/10">
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

        {/* Bottom */}
        <p className="mt-6 text-xs text-white/40">{tFooter('copyright')}</p>
      </div>
    </footer>
  );
}
