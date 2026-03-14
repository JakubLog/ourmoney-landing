# Security Rules — OurMoney Landing

> Reguły bezpieczeństwa dla frontendu NextJS. Frontend-only, brak własnego backendu.

---

## 1. HTTP Security Headers

Dodaj w `next.config.ts` → `headers()`:

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.sanity.io",
      "font-src 'self'",
      "connect-src 'self' https://www.google-analytics.com https://api.sanity.io",
      "frame-src https://www.googletagmanager.com",
    ].join('; '),
  },
];
```

**Sprawdź**: `https://securityheaders.com` po deploymencie.

---

## 2. Environment Variables

| Zmienna | Prefix | Dostępna w |
|---------|--------|-----------|
| `NEXT_PUBLIC_GA_ID` | NEXT_PUBLIC_ | Frontend (OK — publiczne) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | NEXT_PUBLIC_ | Frontend (OK — publiczne) |
| `NEXT_PUBLIC_SANITY_DATASET` | NEXT_PUBLIC_ | Frontend (OK — publiczne) |
| `SANITY_API_TOKEN` | _(brak)_ | Server-only (NIGDY w bundlu) |
| `SANITY_WEBHOOK_SECRET` | _(brak)_ | Server-only (NIGDY w bundlu) |

**Zasada**: `NEXT_PUBLIC_` tylko dla danych które mogą być w publicznym JS bundlu.
Tokeny z uprawnieniami write → ZAWSZE bez prefixu (dostępne tylko w Server Components / Route Handlers).

---

## 3. Sanity — Bezpieczeństwo

- **Read token**: minimalny scope, tylko `viewer` rola
- **Write token**: NIGDY w frontend bundlu
- **Webhook secret**: weryfikuj w `app/api/revalidate/route.ts`
- **Studio**: embedded pod `/studio`, wymaga autentykacji Sanity — NIE wystawiaj publicznie

```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const secret = request.headers.get('x-sanity-webhook-secret');
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...revalidate
}
```

---

## 4. XSS Prevention

- `dangerouslySetInnerHTML` — ZAKAZANE poza `@portabletext/react` (który sanitizuje Sanity content)
- Zewnętrzne linki: ZAWSZE `rel="noopener noreferrer"` gdy `target="_blank"`
- JSON-LD: dane z CMS przez `JSON.stringify()` są automatycznie eskejpowane
- Formularze: Zod validation przed użyciem danych

---

## 5. Prywatność / GDPR

- **GA4**: `anonymize_ip: true` — wymagane
- **Logi Vercel**: nie loguj danych użytkownika (user-agent, IP) do niestandardowych logów
- **llms.txt**: nie zawieraj PII w plikach publicznych
- **Cookie consent**: wymagany dla EU jeśli używasz cookies analitycznych (GA4)
- **Formularze kontaktowe**: dane nie trafiają do konsoli/logów

---

## 6. Route Handlers (API)

Jeśli istnieją route handlery w `app/api/`:
- Weryfikuj secret header lub origin
- Waliduj input przez Zod
- Odpowiadaj generycznymi błędami (nie stack trace)
- Rate limiting — rozważyć Vercel Edge Config / Upstash

---

## 7. Frontend

- Brak `window.alert`, `window.confirm` — używaj Shadcn `AlertDialog`
- Error messages użytkownikowi — generyczne, bez szczegółów infrastruktury
- Brak `console.log` w produkcji
- Open Redirect: nie akceptuj zewnętrznych URL jako parametrów query bez whitelist

---

## 8. Vercel / Deployment

- Environment variables w Vercel Dashboard (nie w kodzie)
- `.env.local` w `.gitignore`
- Branch Protection na `main` (wymagaj PR)
- Vercel Preview Deployments — nie zawierają production secrets (osobne env)

---

_Ostatnia aktualizacja: 2026-03-14_
