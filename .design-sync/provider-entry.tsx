/**
 * Provider dla kart podgladu design-sync: komponenty landingu czytaja
 * tlumaczenia przez next-intl (useTranslations), wiec poza Next.js musza
 * byc opakowane w NextIntlClientProvider z polskimi messages.
 */
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import plMessages from '../messages/pl.json';

export function DSProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="pl" timeZone="Europe/Warsaw" messages={plMessages as never}>
      {children}
    </NextIntlClientProvider>
  );
}
