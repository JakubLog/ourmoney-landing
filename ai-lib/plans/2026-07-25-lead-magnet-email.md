# Plan: Lead magnet - niższy próg konwersji (email capture)

**Data**: 2026-07-25
**Status**: Draft (zaakceptowany kierunkowo 2026-07-25 - wymaga decyzji o treści PDF i endpointzie)

## Kontekst
Landing ma dziś jedną ścieżkę konwersji: rejestracja w aplikacji. Odwiedzający
niezdecydowani odchodzą bez śladu. Product-context zakładał "brak zbierania emaili
na tym etapie" - ta decyzja została zrewidowana 2026-07-25 (akceptacja kierunku).

## Cel
Sekcja lead magnet: PDF "Jak porozmawiać z partnerem o pieniądzach (bez kłótni)"
w zamian za email. Budowa listy pod launche funkcji i newsletter.

## Do rozstrzygnięcia przed implementacją (decyzje usera)
- [ ] Treść PDF-a - kto pisze? (10-15 stron, ton marki: pomocny znajomy, nie bank)
- [ ] Endpoint zapisu - rozszerzyć istniejący webhook n8n (contact form) czy osobny? Docelowo ESP (np. MailerLite/Brevo - RODO, double opt-in)
- [ ] Umiejscowienie: sekcja na homepage (po Testimonials?) czy tylko blog/exit na artykułach

## Zakres Zmian (wstępny)
- `src/components/sections/LeadMagnetSection.tsx` - glass card z formularzem email
- `messages/*` - namespace `LeadMagnet` (PL+EN parity)
- Webhook/ESP - zapis + wysyłka PDF (double opt-in!)
- `polityka-prywatnosci` - aktualizacja o newsletter/przetwarzanie emaila
- GA4: event `lead_magnet_signup`
- `ai-lib/context-map/product-context.md` - aktualizacja sekcji "Cel landingu"

## Uwagi
- RODO: checkbox zgody + double opt-in obowiązkowo
- Nie odpalać przed gotowym PDF-em - pusta obietnica pali zaufanie
