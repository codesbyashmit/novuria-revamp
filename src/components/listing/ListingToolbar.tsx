'use client';

import React from 'react';
import { Filter, Grid2X2, Grid3X3, LayoutGrid } from 'lucide-react';

interface ListingToolbarProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  columns: 2 | 3 | 4;
  onColumnsChange: (cols: 2 | 3 | 4) => void;
  onFilterToggle?: () => void;
  activeFilterCount?: number;
}

export default function ListingToolbar({
  totalCount,
  sortBy,
  onSortChange,
  columns,
  onColumnsChange,
  onFilterToggle,
  activeFilterCount = 0,
}: ListingToolbarProps) {
  return (
    <div className="bg-white border-y border-[#1A0E1C]/15 py-3 px-4 lg:px-8 mb-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#241726]">
      <div className="flex items-center gap-4">
        {onFilterToggle && (
          <button
            type="button"
            onClick={onFilterToggle}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF7FA] border border-[#1A0E1C]/20 hover:border-[#E6A117] transition-colors clip-swatch-sm font-bold uppercase tracking-wider"
          >
            <Filter className="w-3.5 h-3.5 text-[#7F5600]" />
            <span>Filter Specimen</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-[#E6A117] text-[#1A0E1C] text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        <span className="font-mono text-xs uppercase tracking-widest text-[#514534]">
          {totalCount} {totalCount === 1 ? 'Specimen' : 'Specimens'} Inscribed
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider text-[#837562] hidden sm:inline">
            Arrange By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#FFF7FA] border border-[#1A0E1C]/20 px-3 py-1.5 outline-none font-mono text-xs text-[#241726] uppercase tracking-wider cursor-pointer"
          >
            <option value="newest">Newest Acquisitions</option>
            <option value="price_asc">Price: Ascending (INR)</option>
            <option value="price_desc">Price: Descending (INR)</option>
            <option value="featured">Featured Curations</option>
          </select>
        </div>

        <div className="hidden md:flex items-center gap-1 border-l border-[#1A0E1C]/15 pl-4">
          <button
            type="button"
            onClick={() => onColumnsChange(2)}
            className={`p-1.5 border transition-colors ${
              columns === 2 ? 'border-[#E6A117] bg-[#FFE7FC]' : 'border-transparent text-[#837562]'
            }`}
            aria-label="2 Columns"
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onColumnsChange(3)}
            className={`p-1.5 border transition-colors ${
              columns === 3 ? 'border-[#E6A117] bg-[#FFE7FC]' : 'border-transparent text-[#837562]'
            }`}
            aria-label="3 Columns"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onColumnsChange(4)}
            className={`p-1.5 border transition-colors ${
              columns === 4 ? 'border-[#E6A117] bg-[#FFE7FC]' : 'border-transparent text-[#837562]'
            }`}
            aria-label="4 Columns"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

