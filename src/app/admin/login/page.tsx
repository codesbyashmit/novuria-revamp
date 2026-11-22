'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('+919999900000');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication rejected');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Connection failure');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0814] p-6 text-[#F5EFE6]">
      <div className="w-full max-w-md border border-[#2C1810] bg-[#1A0E1C] p-8 shadow-atelier space-y-6">
        <div className="text-center space-y-2 pb-4 border-b border-[#2C1810]">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E5B869] block">
            Novuria Atelier Console
          </span>
          <h1 className="font-serif text-2xl uppercase tracking-widest text-[#F5EFE6]">
            Patronage Inscription
          </h1>
          <p className="text-xs font-mono text-[#F5EFE6]/60 tracking-wider">
            Restricted to authenticated atelier principals.
          </p>
        </div>

        {error && (
          <div className="border border-[#D8371F] bg-[#D8371F]/10 p-3 text-xs font-mono text-[#D8371F] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AtelierInput
            label="Phone or Email Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="+919999900000 or atelier@novuria.in"
            required
          />

          <AtelierInput
            label="Atelier Security Key"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Security passkey"
          />

          <div className="pt-2">
            <AtelierButton variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Atelier Console'}
            </AtelierButton>
          </div>
        </form>

        <div className="text-center pt-2">
          <span className="text-[10px] font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
            Default credentials seeded from environment
          </span>
        </div>
      </div>
    </div>
  );
}

