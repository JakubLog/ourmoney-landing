type Props = {
  className?: string;
  strokeWidth?: number;
};

/**
 * Przekreslona karta ("bez karty kredytowej") w stylu lucide - lucide-react nie
 * ma wariantu -off dla CreditCard. Kontur i pasek karty sa przerwane tam, gdzie
 * przechodzi ukosna kreska, zeby przekreslenie bylo czytelne nawet przy 14px.
 */
export function CreditCardOffIcon({ className, strokeWidth = 2 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M8 5h10a3 3 0 0 1 3 3v8a3 3 0 0 1-.88 2.12" />
      <path d="M17 19H6a3 3 0 0 1-3-3V8a3 3 0 0 1 .88-2.12" />
      <path d="M3 11h5.5" />
      <path d="M13.5 11H21" />
    </svg>
  );
}
