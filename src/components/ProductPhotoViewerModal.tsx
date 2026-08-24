import React, { useState } from 'react';
import { Product, CatalogSettings } from '../types';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  Share2,
  Download,
  Edit3,
  Check,
  Layers,
  Sparkles,
  IndianRupee,
  Smartphone,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductPhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  settings: CatalogSettings;
  onEditProduct?: (product: Product) => void;
  onAdjustPhoto?: (product: Product) => void;
  onSharePhoto?: (product: Product) => void;
  onToggleStock?: (product: Product) => void;
}

export const ProductPhotoViewerModal: React.FC<ProductPhotoViewerModalProps> = ({
  isOpen,
  onClose,
  product,
  settings,
  onEditProduct,
  onAdjustPhoto,
  onSharePhoto,
  onToggleStock,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Download raw image
  const handleDownloadImage = () => {
    const a = document.createElement('a');
    a.href = product.image;
    a.download = `${product.code || 'Bangle'}_photo.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-stone-950 flex items-center justify-between border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-wide font-['Playfair_Display']">
                  Bangle {product.code}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#5A825C] text-white">
                  {product.brandName || 'JEET GOLD'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOutOfStock
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {product.category || settings.defaultCategory || 'BANGELS GOLD COVERING'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetView}
              className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold hidden sm:inline-block transition-colors"
            >
              Reset View
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Photo Stage */}
        <div className="relative flex-1 bg-stone-950 flex items-center justify-center p-4 min-h-[340px] sm:min-h-[440px] max-h-[60vh] overflow-hidden select-none">
          <div
            className="transition-transform duration-200 flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={product.image}
              alt={product.code}
              className="max-h-[52vh] max-w-full object-contain rounded-2xl shadow-2xl border border-stone-800/80"
            />
          </div>

          {/* Floating Zoom & Rotate Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700/80 flex items-center gap-2 shadow-2xl z-20">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="text-stone-300 hover:text-white disabled:opacity-30 p-1.5 rounded-full hover:bg-stone-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-amber-400 min-w-[45px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="text-stone-300 hover:text-white disabled:opacity-30 p-1.5 rounded-full hover:bg-stone-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-stone-700" />

            <button
              onClick={handleRotate}
              className="text-stone-300 hover:text-white p-1.5 rounded-full hover:bg-stone-800 transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details Bar */}
        <div className="px-5 py-3 bg-stone-900 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Available Sizes</span>
              <span className="font-extrabold text-stone-100 text-sm">
                {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'All standard sizes'}
              </span>
            </div>

            {product.price ? (
              <div className="border-l border-stone-800 pl-4">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Wholesale Rate</span>
                <span className="font-extrabold text-amber-400 text-sm flex items-center gap-0.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {product.price.toLocaleString('en-IN')} {product.priceUnit || ''}
                </span>
              </div>
            ) : null}

            {product.pcsPerSet && (
              <div className="border-l border-stone-800 pl-4">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Set Details</span>
                <span className="font-bold text-stone-300 text-xs">
                  {product.pcsPerSet}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {onAdjustPhoto && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAdjustPhoto(product);
                }}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                title="Adjust, crop, or rotate this photo"
              >
                <Crop className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Adjust Photo</span>
              </button>
            )}

            {onSharePhoto && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSharePhoto(product);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                title="Share to WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp Card</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadImage}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700"
              title="Download original photo to gallery"
            >
              <Download className="w-4 h-4" />
            </button>

            {onEditProduct && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditProduct(product);
                }}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700"
                title="Edit bangle code, sizes, price"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
