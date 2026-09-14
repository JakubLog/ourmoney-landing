'use client';

import { useEffect } from 'react';
import { setLocaleUserProperty } from '@/lib/analytics';

export function LocaleTracker({ locale }: { locale: string }) {
  useEffect(() => {
    setLocaleUserProperty(locale);
  }, [locale]);
  return null;
}
