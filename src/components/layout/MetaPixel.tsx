'use client';

import { useEffect, useSyncExternalStore } from 'react';
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeToConsent,
} from '@/lib/analytics';

const PIXEL_ID = '1930936670874838';
const SRC = 'https://connect.facebook.net/en_US/fbevents.js';

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FbqFn;
  loaded: boolean;
  version: string;
};

type PixelWindow = Window & { fbq?: FbqFn; _fbq?: FbqFn };

let loaded = false;

// Stub fbq + <script async> - jeden do jednego ze snippetem Meta, tylko
// wywolywany dopiero po zgodzie zamiast przy kazdym wejsciu na strone.
function loadPixel() {
  if (loaded) return;
  loaded = true;

  const w = window as PixelWindow;
  if (!w.fbq) {
    const n = function (...args: unknown[]) {
      // apply, nie spread - fbevents.js czyta `this` w callMethod
      if (n.callMethod) Reflect.apply(n.callMethod, n, args);
      else n.queue.push(args);
    } as FbqFn;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    w.fbq = n;
    if (!w._fbq) w._fbq = n;

    const script = document.createElement('script');
    script.async = true;
    script.src = SRC;
    document.head.appendChild(script);
  }

  // Zgoda jest juz udzielona w momencie ladowania - kolejnosc jak w snippecie:
  // najpierw stan zgody, potem init, potem PageView
  w.fbq!('consent', 'grant');
  w.fbq!('init', PIXEL_ID);
  w.fbq!('track', 'PageView');
}

/**
 * Meta Pixel ladowany dopiero po zgodzie na cookies.
 * Wczesniej fbevents.js (108 KB) pobieral sie przy kazdym wejsciu, choc zaraz
 * po inicjalizacji stal na `consent: revoke` - czyli i tak nic nie raportowal.
 * Uzytkownik, ktory zgode wyrazil wczesniej, dostaje pixel od razu po hydracji
 * (stan czytany z localStorage), wiec zebrane dane sie nie zmieniaja.
 */
export function MetaPixel() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  useEffect(() => {
    if (consent === 'granted') loadPixel();
  }, [consent]);

  return null;
}
