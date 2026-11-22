'use client';

import React from 'react';

interface AtelierPriceProps {
  amountInPaise?: number | null;
  amount?: number | string | null;
  compareAtPaise?: number | null;
  compareAtAmount?: number | string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function formatInr(rupees: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function AtelierPrice({
  amountInPaise,
  amount,
  compareAtPaise,
  compareAtAmount,
  size = 'md',
  className = '',
}: AtelierPriceProps) {
  let mainRupees = 0;
  if (typeof amountInPaise === 'number') {
    mainRupees = Math.round(amountInPaise / 100);
  } else if (typeof amount === 'number') {
    mainRupees = amount;
  } else if (typeof amount === 'string') {
    mainRupees = parseFloat(amount) || 0;
  }

  let compareRupees: number | null = null;
  if (typeof compareAtPaise === 'number') {
    compareRupees = Math.round(compareAtPaise / 100);
  } else if (typeof compareAtAmount === 'number') {
    compareRupees = compareAtAmount;
  } else if (typeof compareAtAmount === 'string') {
    compareRupees = parseFloat(compareAtAmount) || null;
  }

  const fontClass =
    size === 'lg' ? 'font-price-lg' : size === 'sm' ? 'text-xs font-mono font-bold' : 'font-price-md';

  return (
    <div className={`inline-flex items-baseline gap-2 font-mono ${className}`}>
      <span className={`${fontClass} text-[#1a0e1c]`}>
        ₹ {formatInr(mainRupees)}
      </span>
      {compareRupees && compareRupees > mainRupees && (
        <span className="text-xs font-mono text-[#837562] line-through">
          ₹ {formatInr(compareRupees)}
        </span>
      )}
    </div>
  );
}

