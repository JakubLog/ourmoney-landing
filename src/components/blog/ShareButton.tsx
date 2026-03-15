'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

type Props = {
  label: string;
  copiedLabel: string;
};

export function ShareButton({ label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select URL from address bar — not needed, just silently fail
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-[#bbff00] transition-colors border border-white/10 hover:border-[#bbff00]/30 px-3 py-1.5 rounded-full"
    >
      {copied ? <Check size={12} /> : <Link2 size={12} />}
      {copied ? copiedLabel : label}
    </button>
  );
}
