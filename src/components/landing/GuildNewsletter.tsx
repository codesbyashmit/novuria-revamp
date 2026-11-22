'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

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
        setMessage(data.message || 'You have entered the Novuria Guild.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to submit. Please try again.');
    }
  };

  return (
    <section className="w-full bg-[#1e1720] py-20 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase">
          PRIVATE PRIVILEGES
        </span>

        <h2 className="text-2xl sm:text-4xl font-serif text-stone-100 font-normal mt-2">
          Enter the Novuria Guild
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
          Receive INR 5,000 welcome credit toward your first bespoke couture commission,
          private salon invitations, and advance access to archival drops.
        </p>

        {status === 'success' ? (
          <div className="mt-8 inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-6 py-3 text-xs tracking-wider">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 mx-auto max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email address"
                  className="w-full bg-stone-900 border border-stone-700 pl-10 pr-4 py-3 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-semibold px-6 py-3 text-xs uppercase tracking-widest transition"
              >
                {status === 'loading' ? 'Joining...' : 'JOIN THE GUILD'}
              </button>
            </div>

            {status === 'error' && (
              <p className="mt-2 text-xs text-red-400 text-left">{message}</p>
            )}

            <p className="mt-3 text-[10px] text-stone-500">
              We respect your discretion. You may opt out at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

