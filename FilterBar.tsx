import React from 'react';
import { Search, SlidersHorizontal, CheckSquare, Square, X } from 'lucide-react';
import { SortOption } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  availableSizes: string[];
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalVisible: number;
  totalSelected: number;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedSize,
  onSizeChange,
  availableSizes,
  sortOption,
  onSortChange,
  totalVisible,
  totalSelected,
  onToggleSelectAll,
  isAllSelected,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="catalog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by code (e.g. MK806), pattern name, or size..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-800 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
            <span className="text-xs text-stone-500 font-medium">Category:</span>
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          {availableSizes.length > 0 && (
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
              <span className="text-xs text-stone-500 font-medium">Size:</span>
              <select
                id="filter-size-select"
                value={selectedSize}
                onChange={(e) => onSizeChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Sizes</option>
                {availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <select
              id="filter-sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="NEWEST">Newest Added</option>
              <option value="STOCK_FIRST">In Stock First</option>
              <option value="CODE_ASC">Code: A to Z</option>
              <option value="CODE_DESC">Code: Z to A</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Select & Count status */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-3">
          <button
            id="toggle-select-all-btn"
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-semibold px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-stone-400" />
            )}
            <span>
              {isAllSelected ? 'Deselect All' : 'Select All Visible'} ({totalVisible})
            </span>
          </button>

          {totalSelected > 0 && (
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
              {totalSelected} selected for PDF
            </span>
          )}
        </div>

        <div className="text-stone-400 text-right">
          Showing <span className="font-semibold text-stone-700">{totalVisible}</span> designs
        </div>
      </div>
    </div>
  );
};
