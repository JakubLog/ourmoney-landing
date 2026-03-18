/**
 * Estimates reading time from a character count (as returned by Sanity's `length(pt::text(body))`).
 *
 * Formula: charCount / (200 WPM × 5 chars/word) = charCount / 1000
 * Minimum: 1 minute.
 */
export function readingTime(charCount: number | null | undefined): number {
  if (!charCount || charCount <= 0) return 1;
  return Math.max(1, Math.ceil(charCount / 1000));
}
