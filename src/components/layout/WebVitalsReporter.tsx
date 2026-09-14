'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackWebVital } from '@/lib/analytics';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackWebVital({
      name: metric.name,
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
