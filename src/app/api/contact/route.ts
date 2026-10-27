import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { routing } from '@/i18n/routing';

// Imię trafia do tematu maila - bez znaków nowej linii (header injection).
const contactSchema = z.object({
  name: z.string().trim().min(1).max(100).regex(/^[^\r\n]*$/),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(5000),
  locale: z.enum(routing.locales),
});

/** Formularz wolno wysłać tylko z tej samej domeny co strona. */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !from || !to) {
    console.error('contact: missing RESEND_API_KEY / CONTACT_EMAIL_FROM / CONTACT_EMAIL_TO');
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }

  const { name, email, message, locale } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject: `Formularz kontaktowy: ${name}`,
    text: `Imię i nazwisko: ${name}\nE-mail: ${email}\nJęzyk strony: ${locale}\n\n${message}`,
  });

  if (error) {
    // Bez treści wiadomości i danych nadawcy - tylko kod błędu Resend.
    console.error(`contact: resend ${error.name} (${error.statusCode ?? 'n/a'})`);
    return NextResponse.json({ message: 'Server error' }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}
