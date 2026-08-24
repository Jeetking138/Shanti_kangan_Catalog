import React, { useState, useEffect, useRef } from 'react';
import { Product, ShareCardOptions, CatalogSettings } from '../types';
import {
  renderProductCardToCanvas,
  downloadProductCardImage,
  shareProductCard,
  copyCardImageToClipboard,
} from '../services/imageCardGenerator';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Eye,
  IndianRupee,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SharePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  settings: CatalogSettings;
}

export const SharePhotoModal: React.FC<SharePhotoModalProps> = ({
  isOpen,
  onClose,
  product,
  settings,
}) => {
  const [brandName, setBrandName] = useState('JEET GOLD');
  const [categorySubtitle, setCategorySubtitle] = useState('BANGELS GOLD COVERING');
  const [includePrice, setIncludePrice] = useState(false); // Default to FALSE per user request
  const [includeStockStatus, setIncludeStockStatus] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string>('');

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setBrandName(product.brandName || settings.pdfBrandName || 'JEET GOLD');
      setCategorySubtitle(product.category || settings.defaultCategory || 'BANGELS GOLD COVERING');
      setIncludePrice(false); // Safety: price off by default
      setIncludeStockStatus(false);
      updateCanvasPreview(product, {
        brandName: product.brandName || settings.pdfBrandName || 'JEET GOLD',
        productCode: product.code,
        sizes: product.sizes,
        categorySubtitle: product.category || settings.defaultCategory || 'BANGELS GOLD COVERING',
        includePrice: false,
        price: product.price,
        priceUnit: product.priceUnit,
        includeStockStatus: false,
        stockStatus: product.stockStatus,
      });
    }
  }, [product, isOpen, settings]);

  const updateCanvasPreview = async (
    prod: Product,
    options: ShareCardOptions
  ) => {
    try {
      setIsGenerating(true);
      const canvas = await renderProductCardToCanvas(prod, options);
      setPreviewDataUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Failed to generate preview canvas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionsChange = (newIncludePrice: boolean, newIncludeStock: boolean, newBrand: string, newSubtitle: string) => {
    if (!product) return;
    const opts: ShareCardOptions = {
      brandName: newBrand,
      productCode: product.code,
      sizes: product.sizes,
      categorySubtitle: newSubtitle,
      includePrice: newIncludePrice,
      price: product.price,
      priceUnit: product.priceUnit,
      includeStockStatus: newIncludeStock,
      stockStatus: product.stockStatus,
    };
    updateCanvasPreview(product, opts);
  };

  if (!isOpen || !product) return null;

  const currentOptions: ShareCardOptions = {
    brandName,
    productCode: product.code,
    sizes: product.sizes,
    categorySubtitle,
    includePrice,
    price: product.price,
    priceUnit: product.priceUnit,
    includeStockStatus,
    stockStatus: product.stockStatus,
    phoneNumber: settings.whatsappNumber,
  };

  const handleDownload = async () => {
    await downloadProductCardImage(product, currentOptions);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const handleCopyImage = async () => {
    const success = await copyCardImageToClipboard(product, currentOptions);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } else {
      alert('Clipboard copy failed. Please use the Download button.');
    }
  };

  const handleWhatsAppShare = async () => {
    setShareStatus('Opening WhatsApp...');
    const result = await shareProductCard(product, currentOptions);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
    setTimeout(() => setShareStatus(''), 3000);
  };

  const whatsAppText = `*${brandName}*\nCode: *${product.code}*\nSizes: ${product.sizes.join(', ')}\n${categorySubtitle}${includePrice && product.price ? `\nPrice: ₹${product.price} ${product.priceUnit || ''}` : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Playfair_Display']">
                Share WhatsApp Photo Card
              </h2>
              <p className="text-xs text-stone-400">
                Design matching Jeet Gold catalog format (100% natural photo ratio)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Live Card Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                Live Card Preview
              </span>
              <span className="text-[11px] text-stone-400">
                High-Resolution Output
              </span>
            </div>

            {/* Rendered Preview Box */}
            <div
              ref={cardRef}
              className="relative w-full max-w-sm bg-white rounded-2xl border border-stone-300 shadow-xl overflow-hidden p-3 flex flex-col items-center justify-center min-h-[380px]"
            >
              {isGenerating ? (
                <div className="py-20 text-center">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-500">
                    Generating crystal-clear card...
                  </p>
                </div>
              ) : previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt={`${product.code} Card`}
                  className="w-full h-auto object-contain rounded-lg shadow-xs"
                />
              ) : (
                <div className="py-20 text-stone-400 text-xs">Previewing...</div>
              )}
            </div>

            <p className="text-[11px] text-stone-500 text-center mt-3">
              ✨ Image stays 100% natural in scale without compression or stretching.
            </p>
          </div>

          {/* Right Column: Customization & Share Triggers */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Option 1: Include Price Toggle (User emphasized this!) */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-extrabold text-amber-950 uppercase tracking-wide block">
                      Include Price on Card
                    </label>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      {includePrice
                        ? `Showing: ₹${product.price || 0} ${product.priceUnit || ''}`
                        : 'Price is hidden (Wholesale safety)'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !includePrice;
                      setIncludePrice(nextVal);
                      handleOptionsChange(nextVal, includeStockStatus, brandName, categorySubtitle);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      includePrice ? 'bg-amber-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        includePrice ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Option 2: Brand & Subtitle customization */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Card Brand Header (Red Text)
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                      handleOptionsChange(includePrice, includeStockStatus, e.target.value, categorySubtitle);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-red-600 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Footer Subtitle (Green Text)
                  </label>
                  <input
                    type="text"
                    value={categorySubtitle}
                    onChange={(e) => {
                      setCategorySubtitle(e.target.value);
                      handleOptionsChange(includePrice, includeStockStatus, brandName, e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#5A7365] bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Option 3: Quick Info Summary */}
              <div className="text-xs text-stone-600 space-y-1.5 bg-stone-100/70 p-3.5 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-stone-500">Product Code:</span>
                  <span className="font-bold text-stone-800">{product.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Sizes List:</span>
                  <span className="font-bold text-stone-800">{product.sizes.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Stock Status:</span>
                  <span
                    className={`font-bold ${
                      product.stockStatus === 'OUT_OF_STOCK' ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Action Buttons */}
            <div className="pt-3 border-t border-stone-200 space-y-2.5">
              {/* Main Green WhatsApp Share Button */}
              <button
                id="modal-share-whatsapp-btn"
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to WhatsApp (Photo Card)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Download Button */}
                <button
                  id="modal-download-hd-btn"
                  onClick={handleDownload}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                {/* Copy Image Button */}
                <button
                  id="modal-copy-clipboard-btn"
                  onClick={handleCopyImage}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                    copied
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
                </button>
              </div>

              {shareStatus && (
                <p className="text-xs text-center font-semibold text-emerald-700 animate-pulse">
                  {shareStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
