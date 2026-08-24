import React from 'react';
import { Plus, FileText, Settings, AlertCircle } from 'lucide-react';
import { CatalogSettings } from '../types';
import { JEET_GOLD_BRAND_LOGO } from '../assets/brandAssets';

interface HeaderProps {
  settings: CatalogSettings;
  totalProducts: number;
  inStockCount: number;
  outOfStockCount: number;
  selectedCount: number;
  onOpenAddModal: () => void;
  onOpenPdfModal: () => void;
  onOpenSettingsModal: () => void;
  onFilterStock: (status: 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK') => void;
  currentStockFilter: 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK';
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  totalProducts,
  inStockCount,
  outOfStockCount,
  selectedCount,
  onOpenAddModal,
  onOpenPdfModal,
  onOpenSettingsModal,
  onFilterStock,
  currentStockFilter,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 border-b border-stone-800 text-white shadow-lg">
      {/* Top golden accent bar */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Shop Branding with Authentic Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-md shadow-amber-950/60 ring-2 ring-amber-400/40 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={JEET_GOLD_BRAND_LOGO}
                alt="Jeet Gold Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-100 font-['Playfair_Display']">
                  {settings.shopName || 'Shanti Kangan'}
                </h1>
                <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full tracking-wide">
                  {settings.pdfBrandName || 'JEET GOLD'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                Bangles Inventory, WhatsApp Photo Cards & PDF Generator
              </p>
            </div>
          </div>

          {/* Stock Metrics Quick Filters */}
          <div className="flex items-center gap-1.5 bg-stone-950/70 p-1.5 rounded-xl border border-stone-800 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              id="filter-all-btn"
              onClick={() => onFilterStock('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                currentStockFilter === 'ALL'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>All Items</span>
              <span className="bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded-full text-[10px]">
                {totalProducts}
              </span>
            </button>

            <button
              id="filter-instock-btn"
              onClick={() => onFilterStock('IN_STOCK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                currentStockFilter === 'IN_STOCK'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-xs'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>In Stock</span>
              <span className="bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded-full text-[10px]">
                {inStockCount}
              </span>
            </button>

            <button
              id="filter-outofstock-btn"
              onClick={() => onFilterStock('OUT_OF_STOCK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                currentStockFilter === 'OUT_OF_STOCK'
                  ? 'bg-red-950 text-red-300 border border-red-800 shadow-xs ring-1 ring-red-500/30'
                  : 'text-red-400 hover:text-red-300'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-400">Out of Stock</span>
              <span className="bg-red-900/90 text-red-200 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {outOfStockCount}
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* Create / Export PDF button */}
            <button
              id="header-create-pdf-btn"
              onClick={onOpenPdfModal}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer ${
                selectedCount > 0
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30 ring-2 ring-red-400/40 animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <FileText className="w-4 h-4 text-red-400" />
              <span>
                {selectedCount > 0
                  ? `Create PDF (${selectedCount})`
                  : 'Export PDF'}
              </span>
            </button>

            {/* Add Bangle button */}
            <button
              id="header-add-product-btn"
              onClick={onOpenAddModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md shadow-amber-900/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Bangle</span>
            </button>

            {/* Settings button */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettingsModal}
              title="Shop Settings & Backup"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
