'use client';

import React from 'react';

interface AtelierInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function AtelierInput({
  label,
  error,
  className = '',
  id,
  ...props
}: AtelierInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 w-full font-sans">
      {label && (
        <label
          htmlFor={inputId}
          className="font-label-code text-[10px] uppercase tracking-widest text-[#514534]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-[#ede8ee]/40 border border-[#1a0e1c]/40 px-3 py-2 text-xs text-[#241726] placeholder-[#514534]/60 focus:outline-none focus:border-[#e6a117] focus:border-2 transition-colors ${
          error ? 'border-[#d8371f] focus:border-[#d8371f]' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="font-label-code text-[10px] text-[#d8371f] tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}

