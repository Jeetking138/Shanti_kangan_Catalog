import React from 'react';
import { Product } from '../types';
import { StockBadge } from './StockBadge';
import { Share2, Edit3, Trash2, Check, IndianRupee, Layers, Crop, Sparkles, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewPhoto: () => void;
  onSharePhoto: () => void;
  onAdjustPhoto?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStock: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onToggleSelect,
  onViewPhoto,
  onSharePhoto,
  onAdjustPhoto,
  onEdit,
  onDelete,
  onToggleStock,
}) => {
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col overflow-hidden ${
        isSelected
          ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-50/20'
          : isOutOfStock
          ? 'border-red-200 bg-red-50/10'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      {/* Top Bar with Select Checkbox & Stock Status */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Select for PDF Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={`pointer-events-auto w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-md cursor-pointer ${
            isSelected
              ? 'bg-amber-600 text-white ring-2 ring-amber-300 scale-105'
              : 'bg-white/90 text-stone-400 hover:text-stone-700 hover:bg-white border border-stone-200'
          }`}
          title="Select for PDF Catalog"
        >
          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <div className="w-3 h-3 border-2 border-stone-300 rounded-xs" />}
        </button>

        {/* Stock Status Badge (Clickable to switch) */}
        <div className="pointer-events-auto">
          <StockBadge
            status={product.stockStatus}
            interactive={true}
            onToggle={onToggleStock}
          />
        </div>
      </div>

      {/* Out of Stock Top Ribbon if out of stock */}
      {isOutOfStock && (
        <div className="bg-red-600 text-white text-[11px] font-extrabold tracking-wider text-center py-1 uppercase shadow-xs">
          Out of Stock — Click to Restock
        </div>
      )}

      {/* Product Image Container (100% preserves original aspect ratio, clicking opens High-Res Photo View with Eye) */}
      <div
        className="relative w-full bg-stone-100/70 border-b border-stone-100 flex items-center justify-center p-3 cursor-pointer overflow-hidden min-h-[220px]"
        onClick={onViewPhoto}
        title="Click to view full photo & zoom"
      >
        <img
          src={product.image}
          alt={product.code}
          loading="lazy"
          className="max-h-[260px] w-auto max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Quick Eye View Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-stone-900/70 hover:bg-stone-900 text-white p-1.5 rounded-lg backdrop-blur-xs shadow-md transition-all flex items-center gap-1 text-[11px] font-bold">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">View</span>
        </div>

        {/* Hover Quick View & Actions Overlay */}
        <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewPhoto();
            }}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4 stroke-[2.5]" />
            <span>View Full Photo</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSharePhoto();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </button>

            {onAdjustPhoto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdjustPhoto();
                }}
                className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <Crop className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Info Section (Mirrors Jeet Gold template) */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand Header: JEET GOLD */}
          <div className="text-center">
            <span className="text-xs font-black tracking-widest text-red-600 font-['Playfair_Display'] uppercase">
              {product.brandName || 'JEET GOLD'}
            </span>
          </div>

          {/* Product Code Badge: Green Pill */}
          <div className="flex justify-center my-1.5">
            <span className="inline-block bg-[#5A825C] text-white font-extrabold text-sm px-4 py-1 rounded-lg tracking-wider shadow-xs">
              {product.code}
            </span>
          </div>

          {/* Sizes List */}
          <div className="text-center font-extrabold text-stone-800 text-base tracking-tight my-1">
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.join(', ')
            ) : (
              <span className="text-stone-400 text-xs font-normal">No sizes set</span>
            )}
          </div>

          {/* Optional Name or Notes */}
          {product.name && (
            <p className="text-center text-xs text-stone-500 font-medium line-clamp-1">
              {product.name}
            </p>
          )}

          {/* Optional Price display (Shop Internal / Reference) */}
          <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-stone-100 text-xs">
            {product.price ? (
              <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                <IndianRupee className="w-3 h-3 text-amber-700" />
                {product.price.toLocaleString('en-IN')}
                {product.priceUnit && <span className="text-[10px] text-amber-700 font-normal ml-0.5">{product.priceUnit}</span>}
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 italic">Price hidden</span>
            )}

            {product.pcsPerSet && (
              <span className="text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1 font-medium">
                <Layers className="w-2.5 h-2.5" />
                {product.pcsPerSet}
              </span>
            )}
          </div>
        </div>

        {/* Footer Category & Actions */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-[11px] text-[#5A7365] font-bold tracking-wider uppercase mb-3">
            <span>{product.category || 'BANGELS GOLD COVERING'}</span>
            <span className="text-[10px] text-stone-400 font-normal lowercase">
              {isOutOfStock ? '⚠️ out' : '✓ ready'}
            </span>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="grid grid-cols-7 gap-1">
            {/* View Photo with Eye Icon Button */}
            <button
              id={`view-photo-${product.id}`}
              onClick={onViewPhoto}
              className="col-span-1 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
              title="View Photo & Zoom (Eye)"
            >
              <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Share to WhatsApp Button */}
            <button
              id={`share-whatsapp-${product.id}`}
              onClick={onSharePhoto}
              className="col-span-3 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              title="Share as WhatsApp Photo Card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {/* Direct Adjust Photo Button */}
            {onAdjustPhoto && (
              <button
                id={`adjust-photo-${product.id}`}
                onClick={onAdjustPhoto}
                className="col-span-1 p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
                title="Adjust & Reframe Photo"
              >
                <Crop className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Edit Button */}
            <button
              id={`edit-product-${product.id}`}
              onClick={onEdit}
              className="col-span-1 p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
              title="Edit Product"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button */}
            <button
              id={`delete-product-${product.id}`}
              onClick={onDelete}
              className="col-span-1 p-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
              title="Delete Product"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
