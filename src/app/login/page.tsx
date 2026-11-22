'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierModal from '@/components/ui/AtelierModal';
import { KeyRound, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please provide a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpModalOpen(true);
        if (data.testOtp) {
          const digits = data.testOtp.split('');
          setOtpCode(digits);
        }
      } else {
        setError(data.error || 'Failed to dispatch access code');
      }
    } catch {
      setError('Connection interrupted');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const newCode = [...otpCode];
    newCode[index] = val;
    setOtpCode(newCode);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setOtpError('Please enter the 6-digit access code');
      return;
    }

    setVerifying(true);
    setOtpError(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code: fullCode,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpModalOpen(false);
        router.push('/account/orders');
      } else {
        setOtpError(data.error || 'Invalid or expired access code');
      }
    } catch {
      setOtpError('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726] flex flex-col justify-between">
      <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
            Novuria
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600]">
            Patron Inscription &amp; Access
          </span>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto px-4 py-16">
        <div className="bg-white p-8 border border-[#1A0E1C]/10 clip-swatch shadow-atelier relative space-y-6">
          <span className="punched-hole" />

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#FFE7FC] clip-swatch-sm flex items-center justify-center mx-auto text-[#7F5600]">
              <KeyRound className="w-6 h-6" />
            </div>

            <span className="font-mono text-xs text-[#7F5600] uppercase tracking-widest block font-bold">
              Atelier Identification
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-tight text-[#1A0E1C]">
              Patron Sign In
            </h1>

            <p className="font-sans text-xs text-[#514534]">
              Authenticate via encrypted mobile one-time access code to manage your couture acquisitions and wishlists.
            </p>
          </div>

          {error && (
            <div className="p-3 border border-[#D8371F] bg-[#D8371F]/10 text-xs font-mono text-[#D8371F]">
              {error}
            </div>
          )}

          <form onSubmit={handleRequestOtp} className="space-y-4">
            <AtelierInput
              label="Patron Name (Optional for Inscription)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />

            <div>
              <AtelierInput
                label="Mobile Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                required
              />
              <span className="text-[10px] font-mono text-[#837562] block mt-1 pl-1">
                Enter 10-digit Indian mobile number (+91 assumed)
              </span>
            </div>

            <AtelierButton variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Dispatching Access Code...' : 'Request Atelier Access Code'}
            </AtelierButton>
          </form>

          <div className="pt-4 border-t border-[#1A0E1C]/10 text-center space-y-2">
            <p className="text-[11px] font-sans text-[#514534]">
              By proceeding, you accede to Novuria&apos;s Terms of Patronage and Privacy Inscriptions.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#1C6960]">
              <Shield className="w-3 h-3" />
              <span>256-Bit Financial Grade Encryption</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1A0E1C]/10 py-6 text-center text-xs font-mono text-[#837562]">
        &copy; 2026 Novuria Atelier. All Rights Reserved.
      </footer>

      <AtelierModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        title="Verify Atelier Code"
      >
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <p className="text-xs font-sans text-[#514534] leading-relaxed">
            Enter the 6-digit access code dispatched to{' '}
            <span className="font-mono font-bold text-[#1A0E1C]">{phone}</span>.
          </p>

          {otpError && (
            <div className="p-3 border border-[#D8371F] bg-[#D8371F]/10 text-xs font-mono text-[#D8371F]">
              {otpError}
            </div>
          )}

          <div className="flex justify-between gap-2">
            {otpCode.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                className="w-12 h-14 text-center font-mono text-xl font-bold border border-[#1A0E1C]/30 bg-[#FFF7FA] outline-none focus:border-[#E6A117] transition-colors"
              />
            ))}
          </div>

          <AtelierButton variant="primary" size="lg" className="w-full" disabled={verifying}>
            {verifying ? 'Authenticating...' : 'Confirm Atelier Access'}
          </AtelierButton>

          <div className="text-center">
            <button
              type="button"
              onClick={handleRequestOtp}
              className="text-xs font-mono uppercase tracking-wider text-[#7F5600] hover:underline"
            >
              Resend Access Code
            </button>
          </div>
        </form>
      </AtelierModal>
    </div>
  );
}

