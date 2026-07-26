'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { sendGAEvent } from '@next/third-parties/google';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    sendGAEvent('event', metric.name, {
      // GA4 wymaga int; CLS mnożymy, żeby nie stracić precyzji
      value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  });

  return null;
}
