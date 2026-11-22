'use client';

import React from 'react';

interface AtelierCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  className?: string;
}

export default function AtelierCheckbox({
  checked,
  onChange,
  label,
  id,
  className = '',
}: AtelierCheckboxProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-2 cursor-pointer select-none font-sans text-xs ${className}`}
    >
      <div
        className="w-4 h-4 border border-[#1a0e1c] bg-white flex items-center justify-center transition-colors"
        onClick={() => onChange(!checked)}
      >
        {checked && <div className="w-2.5 h-2.5 bg-[#e6a117]" />}
      </div>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {label && <span className="text-[#241726]">{label}</span>}
    </label>
  );
}

