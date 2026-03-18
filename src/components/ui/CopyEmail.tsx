'use client';

import { useState } from 'react';

type Props = {
  email: string;
  className?: string;
  children?: React.ReactNode;
};

export function CopyEmail({ email, className = '', children }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" onClick={handleClick} className={`relative cursor-pointer ${className}`}>
      {children ?? (copied ? 'Skopiowano!' : email)}
      {copied && children && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-dark text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          Skopiowano!
        </span>
      )}
    </button>
  );
}
