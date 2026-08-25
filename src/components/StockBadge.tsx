import React from 'react';
import { StockStatus } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StockBadgeProps {
  status: StockStatus;
  interactive?: boolean;
  onToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  status,
  interactive = false,
  onToggle,
  size = 'md',
}) => {
  const isOutOfStock = status === 'OUT_OF_STOCK';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wide',
  }[size];

  const content = (
    <span
      id={`stock-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border transition-all duration-150 ${sizeClasses} ${
        isOutOfStock
          ? 'bg-red-50 text-red-700 border-red-300 shadow-xs ring-1 ring-red-400/30'
          : 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/20'
      } ${interactive ? 'cursor-pointer hover:opacity-85 active:scale-95' : ''}`}
      onClick={interactive ? onToggle : undefined}
      title={interactive ? 'Click to toggle stock status' : undefined}
    >
      {isOutOfStock ? (
        <>
          <XCircle className={`${size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-red-600 animate-pulse`} />
          <span className="font-bold text-red-700 uppercase tracking-wider">Out of Stock</span>
        </>
      ) : (
        <>
          <CheckCircle2 className={`${size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-emerald-600`} />
          <span className="font-semibold text-emerald-800">In Stock</span>
        </>
      )}
    </span>
  );

  return content;
};
