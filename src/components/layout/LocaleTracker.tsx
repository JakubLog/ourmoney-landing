'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export function LocaleTracker({ locale }: { locale: string }) {
  useEffect(() => {
    sendGAEvent('set', 'user_properties', { locale });
  }, [locale]);
  return null;
}
