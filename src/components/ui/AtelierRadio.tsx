'use client';

import React from 'react';

interface AtelierRadioProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  id?: string;
  name?: string;
  className?: string;
}

export default function AtelierRadio({
  checked,
  onChange,
  label,
  id,
  name,
  className = '',
}: AtelierRadioProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none font-sans text-xs ${className}`}
    >
      <div
        className="w-4 h-4 border border-[#1a0e1c] bg-white flex items-center justify-center transform rotate-45 transition-transform"
        onClick={onChange}
      >
        {checked && <div className="w-2 h-2 bg-[#e6a117]" />}
      </div>
      <input
        type="radio"
        id={inputId}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label && <span className="text-[#241726]">{label}</span>}
    </label>
  );
}

