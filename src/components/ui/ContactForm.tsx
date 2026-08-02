'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { trackContactFormSubmit } from '@/lib/analytics';

const WEBHOOK_URL = 'https://srv.ourmoney.pl/webhooks/custom/contact-form';

export function ContactForm() {
  const t = useTranslations('ContactPage.form');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`${res.status}`);
      setStatus('success');
      trackContactFormSubmit('success', locale);
      form.reset();
    } catch {
      setStatus('error');
      trackContactFormSubmit('error', locale);
      setErrorMsg(t('error'));
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-surface rounded-2xl p-10 text-center">
        <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
        <p className="text-dark text-base font-medium">{t('success')}</p>
        <p className="text-dark/50 text-sm mt-2">{t('note')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <input
          name="name"
          type="text"
          required
          placeholder={t('namePlaceholder')}
          className="w-full rounded-xl border border-dark/10 bg-white px-6 py-4 text-sm text-dark placeholder:text-dark/30 outline-none focus:border-dark/30 transition-colors"
        />
        <input
          name="email"
          type="email"
          required
          placeholder={t('emailPlaceholder')}
          className="w-full rounded-xl border border-dark/10 bg-white px-6 py-4 text-sm text-dark placeholder:text-dark/30 outline-none focus:border-dark/30 transition-colors"
        />
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder={t('messagePlaceholder')}
        className="w-full rounded-xl border border-dark/10 bg-white px-6 py-4 text-sm text-dark placeholder:text-dark/30 outline-none focus:border-dark/30 transition-colors resize-none"
      />

      {errorMsg && (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-dark/40 text-xs">{t('note')}</p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 bg-accent text-dark font-semibold px-8 py-4 rounded-full text-sm hover:bg-accent-dark transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed shrink-0"
        >
          {status === 'sending' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {t('submit')}
        </button>
      </div>
    </form>
  );
}
