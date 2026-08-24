import React, { useState } from 'react';
import { Product, PdfExportConfig, CatalogSettings } from '../types';
import { generateBanglesPdfCatalog } from '../services/pdfGenerator';
import {
  X,
  FileText,
  Download,
  Eye,
  Check,
  Sparkles,
  AlertCircle,
  Share2,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  allProducts: Product[];
  settings: CatalogSettings;
  onRemoveSelected: (id: string) => void;
  onSelectAll: () => void;
  onSelectInStockOnly: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  allProducts,
  settings,
  onRemoveSelected,
  onSelectAll,
  onSelectInStockOnly,
}) => {
  const [brandName, setBrandName] = useState(settings.pdfBrandName || 'JEET GOLD');
  const [categorySubtitle, setCategorySubtitle] = useState(settings.defaultCategory || 'BANGELS GOLD COVERING');
  const [includePrice, setIncludePrice] = useState(false); // Default to FALSE per user request
  const [includeStockStatus, setIncludeStockStatus] = useState(false);
  const [layout, setLayout] = useState<'1_per_page' | '2_per_page'>('1_per_page');
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [whatsappContact, setWhatsappContact] = useState(settings.whatsappNumber || '');
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState(settings.pdfBrandName || 'JEET GOLD');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.12); // Default 12% brightness
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  if (!isOpen) return null;

  const productsToExport = selectedProducts.length > 0 ? selectedProducts : allProducts;

  const handleGeneratePdf = async (action: 'download' | 'preview') => {
    if (productsToExport.length === 0) {
      alert('Please select at least one bangle product to generate a PDF.');
      return;
    }

    try {
      setIsGenerating(true);
      setProgress({ current: 0, total: productsToExport.length });

      const config: PdfExportConfig = {
        brandName: brandName.trim() || 'JEET GOLD',
        categorySubtitle: categorySubtitle.trim() || 'BANGELS GOLD COVERING',
        includePrice,
        includeStockStatus,
        layout,
        showPageNumbers,
        whatsappContact: whatsappContact.trim() || undefined,
        watermarkEnabled,
        watermarkText: watermarkText.trim() || brandName.trim() || 'JEET GOLD',
        watermarkOpacity: watermarkEnabled ? watermarkOpacity : 0,
      };

      const doc = await generateBanglesPdfCatalog(productsToExport, config, (current, total) => {
        setProgress({ current, total });
      });

      const filename = `${config.brandName.replace(/\s+/g, '_')}_Bangles_Catalog_${Date.now()}.pdf`;

      if (action === 'download') {
        doc.save(filename);
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
      } else {
        // Preview PDF in new tab
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('An error occurred while building the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Playfair_Display']">
                Export Bangles PDF Catalog
              </h2>
              <p className="text-xs text-stone-400">
                Generates a multi-page PDF formatted as Jeet Gold catalog pages
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

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Selected Products Preview Bar */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Products in this PDF:
                </span>
                <span className="bg-red-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {productsToExport.length} Bangles
                </span>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="text-stone-600 hover:text-stone-900 font-semibold px-2 py-1 rounded-md hover:bg-stone-200 transition-colors"
                >
                  Select All ({allProducts.length})
                </button>
                <span className="text-stone-300">|</span>
                <button
                  type="button"
                  onClick={onSelectInStockOnly}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  In-Stock Only
                </button>
              </div>
            </div>

            {/* Thumbnail Scroll Strip */}
            <div className="flex items-center gap-2.5 overflow-x-auto py-2">
              {productsToExport.map((prod) => (
                <div
                  key={prod.id}
                  className="relative group shrink-0 w-20 bg-white rounded-xl border border-stone-200 p-1.5 flex flex-col items-center shadow-xs"
                >
                  <img
                    src={prod.image}
                    alt={prod.code}
                    className="w-16 h-12 object-contain rounded-sm"
                  />
                  <span className="text-[10px] font-extrabold text-stone-800 mt-1 truncate max-w-full">
                    {prod.code}
                  </span>
                  {selectedProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onRemoveSelected(prod.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                      title="Remove from PDF"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Branding Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  PDF Header Brand (Red Text)
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="JEET GOLD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-red-600 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  App shows "Shanti Kangan", PDF shows "{brandName}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Bottom Right Footer Subtitle
                </label>
                <input
                  type="text"
                  value={categorySubtitle}
                  onChange={(e) => setCategorySubtitle(e.target.value)}
                  placeholder="BANGELS GOLD COVERING"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#5A7365] focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Layout Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLayout('1_per_page')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      layout === '1_per_page'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-300'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div>1 Bangle Per Page ⭐</div>
                    <div className="text-[10px] font-normal text-stone-500 mt-0.5">
                      Exact match to reference photo
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayout('2_per_page')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      layout === '2_per_page'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-300'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div>2 Bangles Per Page</div>
                    <div className="text-[10px] font-normal text-stone-500 mt-0.5">
                      Compact catalog layout
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Price & Privacy Options */}
            <div className="space-y-4">
              {/* CRITICAL FEATURE: OPTIONAL PRICE IN PDF */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {includePrice ? (
                      <Unlock className="w-4 h-4 text-amber-700" />
                    ) : (
                      <Lock className="w-4 h-4 text-stone-600" />
                    )}
                    <label className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                      Include Prices in PDF
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludePrice(!includePrice)}
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
                <p className="text-[11px] text-amber-900/80">
                  {includePrice
                    ? '⚠️ Prices will be printed on each page of the PDF.'
                    : '🔒 Prices are completely hidden (Safe for sharing with general customers).'}
                </p>
              </div>

              {/* WATERMARK SETTINGS PER USER REQUIREMENT */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <label className="text-xs font-extrabold text-stone-800 uppercase tracking-wide">
                      Page Watermark (JEET GOLD)
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      watermarkEnabled ? 'bg-amber-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        watermarkEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {watermarkEnabled && (
                  <div className="space-y-3 pt-1 border-t border-stone-200">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-stone-600">Watermark Text</span>
                      </div>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="JEET GOLD"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-amber-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Watermark Brightness Slider & Presets */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-stone-600">Watermark Brightness / Opacity</span>
                        <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {Math.round(watermarkOpacity * 100)}%
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0.04"
                        max="0.40"
                        step="0.02"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
                      />

                      {/* Quick Presets */}
                      <div className="grid grid-cols-4 gap-1 mt-2">
                        {[
                          { label: 'Subtle', val: 0.06 },
                          { label: 'Standard', val: 0.12 },
                          { label: 'Visible', val: 0.20 },
                          { label: 'Bold', val: 0.30 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setWatermarkOpacity(preset.val)}
                            className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                              Math.abs(watermarkOpacity - preset.val) < 0.02
                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {preset.label} ({Math.round(preset.val * 100)}%)
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Numbers Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer">
                <span>Show Page Numbers (e.g. Page 1 of {productsToExport.length})</span>
                <input
                  type="checkbox"
                  checked={showPageNumbers}
                  onChange={(e) => setShowPageNumbers(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
              </label>

              {/* Optional WhatsApp Contact Footer */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  WhatsApp Contact on PDF (Optional)
                </label>
                <input
                  type="text"
                  value={whatsappContact}
                  onChange={(e) => setWhatsappContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Progress Indicator when generating */}
          {isGenerating && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 font-bold text-amber-900 text-sm">
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span>
                  Rendering High-Res Catalog (Page {progress?.current || 1} of {progress?.total || productsToExport.length})...
                </span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-2 transition-all duration-200"
                  style={{
                    width: `${((progress?.current || 1) / (progress?.total || 1)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-amber-800">
                Preserving 100% true aspect ratio for every bangle photo.
              </p>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors"
            >
              Close
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              {/* Preview PDF */}
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGeneratePdf('preview')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-stone-600" />
                <span>Preview PDF</span>
              </button>

              {/* Download PDF */}
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGeneratePdf('download')}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download PDF ({productsToExport.length} Pages)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
