'use client';

import React from 'react';

interface AtelierBadgeProps {
  label: string;
  variant?: 'verdigris' | 'vermilion' | 'saffron' | 'ink';
  className?: string;
  showHole?: boolean;
}

export default function AtelierBadge({
  label,
  variant = 'verdigris',
  className = '',
  showHole = true,
}: AtelierBadgeProps) {
  const variantStyles = {
    verdigris: 'bg-[#1e6b62] text-white border border-[#1e6b62]',
    vermilion: 'bg-[#d8371f] text-white border border-[#d8371f]',
    saffron: 'bg-[#e6a117] text-[#1a0e1c] border border-[#e6a117]',
    ink: 'bg-[#1a0e1c] text-[#ede8ee] border border-[#1a0e1c]',
  }[variant];

  return (
    <div
      className={`relative inline-flex items-center px-2 py-0.5 clip-swatch-sm font-label-code text-[9px] tracking-widest uppercase font-bold select-none ${variantStyles} ${className}`}
    >
      {showHole && (
        <span className="w-1.5 h-1.5 rounded-full bg-white/70 mr-1.5 shadow-inner shrink-0" />
      )}
      <span>{label}</span>
    </div>
  );
}

