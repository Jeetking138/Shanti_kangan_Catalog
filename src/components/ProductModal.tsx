import React, { useState, useEffect, useRef } from 'react';
import { Product, StockStatus, CatalogSettings } from '../types';
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  AlertCircle,
  Plus,
  Sparkles,
  Crop,
  Sliders,
  RotateCw,
  Baby,
  User,
} from 'lucide-react';
import { PhotoAdjustModal } from './PhotoAdjustModal';
import {
  ALL_BANGLE_SIZES,
  BABY_KIDS_SIZES,
  STANDARD_ADULT_SIZES,
  SIZE_PRESETS,
  sortBangleSizes,
} from '../utils/bangleSizes';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
  settings: CatalogSettings;
}

const COMMON_CATEGORIES = [
  'BANGELS GOLD COVERING',
  'RAJWADI KANGAN',
  'CNC GOLD FINISH',
  'MICRO GOLD PLATED',
  'ANTIQUE MATTE FINISH',
  'BRIDAL CHUDA SPECIAL',
  'BABY & KIDS SPECIAL',
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  settings,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['2.10', '2.8', '2.6', '2.4']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('IN_STOCK');
  const [category, setCategory] = useState(settings.defaultCategory || 'BANGELS GOLD COVERING');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState<string>('');
  const [priceUnit, setPriceUnit] = useState('/ set (4 Pcs)');
  const [pcsPerSet, setPcsPerSet] = useState('4 Pcs');
  const [brandName, setBrandName] = useState(settings.pdfBrandName || 'JEET GOLD');
  const [notes, setNotes] = useState('');
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Photo Adjust Modal State
  const [isPhotoAdjustOpen, setIsPhotoAdjustOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setCode(productToEdit.code);
      setName(productToEdit.name || '');
      setImage(productToEdit.image);
      setSelectedSizes(productToEdit.sizes || ['2.10', '2.8', '2.6', '2.4']);
      setStockStatus(productToEdit.stockStatus || 'IN_STOCK');
      setCategory(productToEdit.category || settings.defaultCategory || 'BANGELS GOLD COVERING');
      setPrice(productToEdit.price ? String(productToEdit.price) : '');
      setPriceUnit(productToEdit.priceUnit || '/ set (4 Pcs)');
      setPcsPerSet(productToEdit.pcsPerSet || '4 Pcs');
      setBrandName(productToEdit.brandName || settings.pdfBrandName || 'JEET GOLD');
      setNotes(productToEdit.notes || '');
    } else {
      // Defaults for new product
      setCode('');
      setName('');
      setImage('');
      setSelectedSizes(['2.10', '2.8', '2.6', '2.4']);
      setStockStatus('IN_STOCK');
      setCategory(settings.defaultCategory || 'BANGELS GOLD COVERING');
      setPrice('');
      setPriceUnit('/ set (4 Pcs)');
      setPcsPerSet('4 Pcs');
      setBrandName(settings.pdfBrandName || 'JEET GOLD');
      setNotes('');
    }
    setImageError('');
  }, [productToEdit, isOpen, settings]);

  if (!isOpen) return null;

  // File upload handler - converts file to Base64 data URL while keeping natural resolution
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setImageError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImage(result);
      }
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes(sortBangleSizes([...selectedSizes, size], true));
    }
  };

  const addCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes(sortBangleSizes([...selectedSizes, trimmed], true));
      setCustomSizeInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Please enter a Product Code (e.g. MK806)');
      return;
    }
    if (!image) {
      setImageError('Please upload a product photo.');
      return;
    }

    const finalCategory = customCategory.trim() || category;
    const finalPrice = price.trim() ? parseFloat(price) : undefined;

    const productData: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim() || undefined,
      image,
      sizes: selectedSizes.length > 0 ? selectedSizes : ['2.4', '2.6', '2.8'],
      stockStatus,
      category: finalCategory,
      price: finalPrice,
      priceUnit: finalPrice ? priceUnit : undefined,
      pcsPerSet: pcsPerSet.trim() || undefined,
      brandName: brandName.trim() || 'JEET GOLD',
      notes: notes.trim() || undefined,
      createdAt: productToEdit ? productToEdit.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    onSave(productData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Playfair_Display']">
                {productToEdit ? 'Edit Bangle Details' : 'Add New Bangle to Catalog'}
              </h2>
              <p className="text-xs text-stone-400">
                Product will be ready for WhatsApp sharing & Jeet Gold PDF catalog
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 1. Image Upload Area (Keeps natural aspect ratio) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Product Photo <span className="text-red-500">*</span>
              <span className="text-[11px] font-normal text-stone-500 ml-2">
                (Preserves 100% original aspect ratio)
              </span>
            </label>

            {image ? (
              <div className="relative border-2 border-amber-300/80 rounded-2xl p-3.5 bg-stone-900 text-white flex flex-col items-center shadow-lg">
                <div className="relative max-h-60 w-full flex items-center justify-center overflow-hidden rounded-xl bg-stone-950 border border-stone-800 p-2">
                  <img
                    src={image}
                    alt="Uploaded preview"
                    className="max-h-56 max-w-full object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between w-full gap-2 mt-3 pt-2 border-t border-stone-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoAdjustOpen(true)}
                      className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Free Adjust & Rotate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-xs font-semibold px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
                    : 'border-stone-300 hover:border-amber-400 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-stone-800">
                  Click or drag bangle photo here
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Supports JPG, PNG, WEBP from camera or gallery (100% natural photo ratio)
                </p>
                <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Free Adjust, Rotate & Crop tool included
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                }
              }}
            />
            {imageError && (
              <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {imageError}
              </p>
            )}
          </div>

          {/* 2. Product Code & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Product Code / Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. MK806 or RJ104"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-bold tracking-wider text-stone-900 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Shown inside the green badge in PDF & Photo Card
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                PDF / Share Brand Title
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="JEET GOLD"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-red-600 tracking-wider focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Shown in Red on top of product card
              </p>
            </div>
          </div>

          {/* 3. STOCK STATUS (CRITICAL REQUIREMENT: In Stock vs Out of Stock in Red) */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-2">
              Stock Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  stockStatus === 'IN_STOCK'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="stockStatus"
                  value="IN_STOCK"
                  checked={stockStatus === 'IN_STOCK'}
                  onChange={() => setStockStatus('IN_STOCK')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    IN STOCK
                  </span>
                  <span className="text-[11px] text-emerald-600/80 font-normal">
                    Ready for immediate order
                  </span>
                </div>
              </label>

              <label
                className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  stockStatus === 'OUT_OF_STOCK'
                    ? 'border-red-500 bg-red-50 text-red-950 font-bold shadow-xs ring-2 ring-red-400/20'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="stockStatus"
                  value="OUT_OF_STOCK"
                  checked={stockStatus === 'OUT_OF_STOCK'}
                  onChange={() => setStockStatus('OUT_OF_STOCK')}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    OUT OF STOCK
                  </span>
                  <span className="text-[11px] text-red-600/80 font-semibold">
                    Shows in RED across catalog
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Sizes Selection (Baby & Kids: 1.8, 1.10, 1.12, 1.14, 2.0 + Adult: 2.2, 2.4, 2.6, 2.8, 2.10, 2.12, 2.14) */}
          <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>Available Bangle Sizes</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-stone-500">
                Selected: <strong className="text-amber-800 font-bold">{selectedSizes.join(', ') || 'None'}</strong>
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Quick Size Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedSizes([...preset.sizes])}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors flex items-center gap-1"
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* A. Baby & Kids Sizes (1.8, 1.10, 1.12, 1.14, 2.0) - User Requested */}
            <div className="bg-amber-100/50 p-3 rounded-xl border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Baby className="w-3.5 h-3.5 text-amber-700" />
                  <span>Baby & Kids Sizes (Choti Bangles)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSizes(sortBangleSizes([...BABY_KIDS_SIZES], true))}
                  className="text-[10px] font-bold text-amber-800 hover:underline"
                >
                  Select All Baby (1.8 - 2.0)
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {BABY_KIDS_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs scale-105 ring-2 ring-amber-400'
                          : 'bg-white text-stone-700 hover:bg-stone-50 border border-amber-200/90'
                      }`}
                    >
                      <span>{size}</span>
                      {isSelected ? <Check className="w-3 h-3" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. Regular / Adult Sizes (2.2, 2.4, 2.6, 2.8, 2.10, 2.12, 2.14) */}
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-600" />
                  <span>Standard & Regular Sizes (Adult)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSizes(sortBangleSizes(['2.10', '2.8', '2.6', '2.4'], true))}
                  className="text-[10px] font-bold text-stone-600 hover:underline"
                >
                  Standard 4 (2.4 - 2.10)
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {STANDARD_ADULT_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs scale-105 ring-2 ring-amber-300'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      <span>{size}</span>
                      {isSelected ? <Check className="w-3 h-3" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Size Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSize();
                  }
                }}
                placeholder="Add custom size (e.g. 2.16 or 3.0)"
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Size
              </button>
            </div>
          </div>

          {/* 5. Category & Subtitle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Category / Footer Tagline
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCustomCategory('');
                }}
                className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value.toUpperCase())}
                placeholder="Or type custom category..."
                className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Shown in green uppercase on the bottom right of the photo & PDF
            </p>
          </div>

          {/* 6. Optional Price & Unit */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Price (Optional Wholesale / Retail)
              </label>
              <span className="text-[11px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-semibold">
                🔒 Hidden in WhatsApp/PDF by default
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="450"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <input
                  type="text"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  placeholder="/ set (4 Pcs)"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-1">
                <input
                  type="text"
                  value={pcsPerSet}
                  onChange={(e) => setPcsPerSet(e.target.value)}
                  placeholder="Set size: 4 Pcs"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
            <p className="text-[11px] text-amber-800/80 mt-2">
              💡 As requested: You can choose whether to include or exclude prices whenever you generate a PDF or share to WhatsApp.
            </p>
          </div>

          {/* 7. Optional Notes / Pattern Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Internal Notes / Pattern Details (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Wave pattern diamond cut, Box 14, High demand design"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-extrabold shadow-md shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {productToEdit ? 'Save Changes' : 'Add to Catalog'}
            </button>
          </div>
        </form>

        {/* Free Photo Adjust Modal */}
        {isPhotoAdjustOpen && image && (
          <PhotoAdjustModal
            isOpen={isPhotoAdjustOpen}
            onClose={() => setIsPhotoAdjustOpen(false)}
            imageSrc={image}
            title={`Free Adjust Photo (${code || 'Bangle'})`}
            onApply={(adjustedDataUrl) => {
              setImage(adjustedDataUrl);
            }}
          />
        )}
      </div>
    </div>
  );
};
