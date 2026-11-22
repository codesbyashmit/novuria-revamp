'use client';

import React from 'react';

export interface SwatchCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hasPunchedHole?: boolean;
  darkHole?: boolean;
  cutSize?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
}

export default function SwatchCard({
  children,
  className = '',
  style,
  hasPunchedHole = true,
  darkHole = false,
  cutSize = 'md',
  shadow = false,
}: SwatchCardProps) {
  const cutClass =
    cutSize === 'sm' ? 'clip-swatch-sm' : cutSize === 'lg' ? 'clip-swatch-lg' : 'clip-swatch';
  const shadowClass = shadow ? 'shadow-atelier' : '';

  return (
    <div className={`relative ${cutClass} ${shadowClass} ${className}`} style={style}>
      {hasPunchedHole && (
        <div className={darkHole ? 'punched-hole-dark' : 'punched-hole'} />
      )}
      {children}
    </div>
  );
}
