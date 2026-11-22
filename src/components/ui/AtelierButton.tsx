'use client';

import React from 'react';

interface AtelierButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'urgent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function AtelierButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: AtelierButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[11px] font-medium tracking-wider',
    md: 'px-5 py-2.5 text-xs font-medium tracking-widest',
    lg: 'px-8 py-3.5 text-sm font-semibold tracking-widest',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#1a0e1c] text-[#ede8ee] hover:bg-[#e6a117] hover:text-[#1a0e1c] hover:shadow-atelier-sm clip-swatch-sm transition-all uppercase',
    secondary:
      'bg-transparent text-[#1a0e1c] border border-[#1a0e1c] hover:bg-[#ede8ee] clip-swatch-sm transition-all uppercase',
    urgent:
      'bg-[#d8371f] text-white hover:bg-[#b81f09] hover:shadow-atelier-sm clip-swatch-sm transition-all uppercase',
    ghost:
      'bg-transparent text-[#1a0e1c] hover:text-[#e6a117] transition-colors uppercase tracking-wider',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 select-none font-sans ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

