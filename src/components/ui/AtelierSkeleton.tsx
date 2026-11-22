'use client';

import React from 'react';

interface AtelierSkeletonProps {
  className?: string;
  isSwatch?: boolean;
}

export default function AtelierSkeleton({
  className = '',
  isSwatch = false,
}: AtelierSkeletonProps) {
  const swatchClass = isSwatch ? 'clip-swatch' : '';
  return (
    <div
      className={`animate-pulse bg-[#e9d3e8]/60 border border-[#1a0e1c]/10 ${swatchClass} ${className}`}
    />
  );
}

