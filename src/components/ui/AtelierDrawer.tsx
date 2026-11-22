'use client';

import React from 'react';
import { X } from 'lucide-react';

interface AtelierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

export default function AtelierDrawer({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
}: AtelierDrawerProps) {
  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[width];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div
        className="fixed inset-0 bg-[#1a0e1c]/70 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen ${widthClass} bg-[#fff7fa] text-[#241726] border-l-2 border-[#1a0e1c] shadow-atelier flex flex-col`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a0e1c]/20 bg-[#ffeffc]">
            {title && (
              <h3 className="font-headline-md text-lg uppercase tracking-wider text-[#1a0e1c]">
                {title}
              </h3>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#514534] hover:text-[#1a0e1c] transition-colors ml-auto"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

