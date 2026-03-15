'use client';

import { useEffect, useState } from 'react';

const DISPLAY_MS = 2400;
const FADE_MS = 350;

type Props = {
  words: string[];
  className?: string;
};

export function AnimatedWord({ words, className = '' }: Props) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setFading(false);
      }, FADE_MS);
    }, DISPLAY_MS + FADE_MS);

    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(-10px)' : 'translateY(0)',
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
      }}
    >
      {words[index]}
    </span>
  );
}
