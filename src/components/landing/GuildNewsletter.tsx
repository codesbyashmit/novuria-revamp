'use client';

import React, { useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import { Check, Mail } from 'lucide-react';

export default function GuildNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'You have inscribed in the Novuria Guild.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to submit inscription.');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to submit inscription.');
    }
  };

  return (
    <section className="w-full bg-[#FFE7FC] py-20 px-6 font-sans border-b border-[#1A0E1C]/15 relative">
      <div className="mx-auto max-w-2xl text-center space-y-4">
        <span className="font-mono text-xs tracking-[0.25em] text-[#7F5600] uppercase font-bold block">
          Private Privileges &amp; Solicitations
        </span>

        <h2 className="text-3xl sm:text-4xl font-serif text-[#1A0E1C] uppercase tracking-tight">
          Enter The Novuria Guild
        </h2>

        <p className="mx-auto max-w-lg text-xs sm:text-sm text-[#514534] leading-relaxed">
          Receive ₹5,000 welcome credit toward your premier couture acquisition, private salon invitations, and advance access to archival drops.
        </p>

        {status === 'success' ? (
          <div className="mt-6 inline-flex items-center gap-2 bg-[#1C6960] text-white px-6 py-3 text-xs font-mono uppercase tracking-wider clip-swatch-sm">
            <Check className="h-4 w-4 text-white" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 mx-auto max-w-md flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#837562]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR PRIVILEGED EMAIL"
                className="w-full bg-white border border-[#1A0E1C]/25 pl-10 pr-4 py-3 font-mono text-xs uppercase tracking-wider text-[#1A0E1C] outline-none focus:border-[#E6A117]"
              />
            </div>
            <AtelierButton variant="primary" size="md" disabled={status === 'loading'}>
              {status === 'loading' ? 'Inscribing...' : 'Inscribe'}
            </AtelierButton>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs font-mono text-[#D8371F] mt-2">{message}</p>
        )}
      </div>
    </section>
  );
}
