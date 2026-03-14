Wykonaj audyt bezpieczeństwa projektu OurMoney Landing (Next.js 15 + Sanity, frontend-only).

Przeczytaj `ai-lib/context-map/security-rules.md` przed rozpoczęciem.

## Checklist

### 1. HTTP Security Headers (A05)
- [ ] `X-Frame-Options: DENY` w `next.config.ts`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` (kamera, mikrofon — deny)
- [ ] `Content-Security-Policy` — bez `unsafe-inline` gdzie możliwe
- [ ] HTTPS enforced (Vercel: automatic)

### 2. Sanity / CMS Security (A08)
- [ ] Sanity API token NIGDY w frontend bundlu (tylko `NEXT_PUBLIC_` vars są publiczne)
- [ ] Read-only token dla publicznych fetchów (nie write token)
- [ ] Sanity Studio (`/studio`) wymaga autentykacji Sanity
- [ ] `/studio` w `robots.txt` jako `disallow`
- [ ] Webhook secret weryfikowany w `app/api/revalidate/route.ts`

### 3. Environment Variables (A02)
- [ ] `NEXT_PUBLIC_*` — tylko naprawdę publiczne (GA4 ID, Sanity project ID)
- [ ] Sanity write tokens, webhook secrets — bez prefixu (server-only)
- [ ] `.env.local` w `.gitignore`
- [ ] Brak hardcoded secrets w kodzie

### 4. XSS / Content Security (A03)
- [ ] `dangerouslySetInnerHTML` — TYLKO dla Sanity Portable Text z `@portabletext/react` (sanitized)
- [ ] Zewnętrzne linki: `rel="noopener noreferrer"` na `target="_blank"`
- [ ] User input (formularze): Zod validation przed użyciem
- [ ] JSON-LD: dane z CMS sanitizowane przed `JSON.stringify`

### 5. API Routes (A01, A09)
- [ ] Route handlers w `app/api/` — weryfikacja origin / secret header
- [ ] Rate limiting (Vercel Edge Config lub middleware) — jeśli są formularze
- [ ] CORS: tylko dozwolone originy
- [ ] Revalidate endpoint: secret key w nagłówku (Sanity webhook secret)

### 6. Prywatność / GDPR (A02)
- [ ] GA4: IP anonymization włączone (`anonymize_ip`)
- [ ] Cookie consent przed inicjalizacją GA4 (jeśli EU traffic)
- [ ] `llms.txt` nie zawiera PII
- [ ] Formularze kontaktowe: dane nie logowane w konsoli/Vercel logs

### 7. Frontend (A05, A06)
- [ ] Error messages nie ujawniają stacktrace / szczegółów infrastruktury
- [ ] Brak `console.log` z danymi użytkownika w produkcji
- [ ] Open Redirect: zewnętrzne URL nie przyjmowane jako parametry bez whitelisty
- [ ] Formularze: CSRF protection (Next.js Server Actions mają wbudowane)

## Severity Levels
- **CRITICAL**: Natychmiastowy STOP — ujawnia dane lub umożliwia atak
- **HIGH**: Fix przed deployem
- **MEDIUM**: Fix w następnym cyklu

## Output
```
## Security Audit Report — OurMoney Landing

| Kategoria | Status | Findings |
|-----------|--------|----------|
| HTTP Headers | OK/WARN/CRITICAL | ... |
| CMS Security | OK/WARN/CRITICAL | ... |
| Env Variables | OK/WARN/CRITICAL | ... |
| XSS / Content | OK/WARN/CRITICAL | ... |
| API Routes | OK/WARN/CRITICAL | ... |
| Privacy / GDPR | OK/WARN/CRITICAL | ... |
| Frontend | OK/WARN/CRITICAL | ... |

CRITICAL: [count]
HIGH: [count]
MEDIUM: [count]
```
