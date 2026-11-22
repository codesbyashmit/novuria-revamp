'use client';

import React from 'react';
import { X } from 'lucide-react';
import SwatchCard from './SwatchCard';

interface AtelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AtelierModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}: AtelierModalProps) {
  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#1a0e1c]/70 transition-opacity"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full ${widthClass}`}>
        <SwatchCard
          hasPunchedHole
          darkHole={false}
          shadow
          className="bg-[#fff7fa] border border-[#1a0e1c] p-6 text-[#241726]"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#1a0e1c]/20 mb-4">
            {title && (
              <h3 className="font-headline-md text-xl tracking-tight text-[#1a0e1c]">
                {title}
              </h3>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#514534] hover:text-[#1a0e1c] transition-colors ml-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div>{children}</div>
        </SwatchCard>
      </div>
    </div>
  );
}

