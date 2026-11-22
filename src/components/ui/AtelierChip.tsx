'use client';

import React from 'react';

interface AtelierChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  count?: number;
  className?: string;
}

export default function AtelierChip({
  label,
  selected = false,
  onClick,
  count,
  className = '',
}: AtelierChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 px-3.5 inline-flex items-center gap-1.5 font-label-code text-[11px] uppercase tracking-wider transition-all select-none ${
        selected
          ? 'bg-[#1a0e1c] text-[#e6a117] clip-swatch-sm shadow-atelier-sm'
          : 'bg-[#ede8ee] text-[#1a0e1c] border border-[#1a0e1c]/40 hover:border-[#1a0e1c]'
      } ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] ${selected ? 'text-white/60' : 'text-[#514534]'}`}>
          ({count})
        </span>
      )}
    </button>
  );
}

