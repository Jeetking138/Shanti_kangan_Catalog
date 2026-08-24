import React, { useState } from 'react';
import { CatalogSettings, Product } from '../types';
import {
  X,
  Save,
  Download,
  Upload,
  RotateCcw,
  Check,
  Sparkles,
  Smartphone,
  Tablet,
  Share2,
  HardDrive,
} from 'lucide-react';
import { JEET_GOLD_BRAND_LOGO } from '../assets/brandAssets';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CatalogSettings;
  onSaveSettings: (settings: CatalogSettings) => void;
  products: Product[];
  onImportProducts: (products: Product[]) => void;
  onResetSampleData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  products,
  onImportProducts,
  onResetSampleData,
}) => {
  const [activeTab, setActiveTab] = useState<'BRANDING' | 'DEVICE_SYNC'>('BRANDING');

  // Branding state
  const [shopName, setShopName] = useState(settings.shopName || 'Shanti Kangan');
  const [pdfBrandName, setPdfBrandName] = useState(settings.pdfBrandName || 'JEET GOLD');
  const [defaultCategory, setDefaultCategory] = useState(settings.defaultCategory || 'BANGELS GOLD COVERING');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [savedMessage, setSavedMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: CatalogSettings = {
      ...settings,
      shopName: shopName.trim() || 'Shanti Kangan',
      pdfBrandName: pdfBrandName.trim() || 'JEET GOLD',
      defaultCategory: defaultCategory.trim() || 'BANGELS GOLD COVERING',
      whatsappNumber: whatsappNumber.trim(),
      pinLock: {
        isEnabled: false,
      },
    };
    onSaveSettings(updated);
    setSavedMessage('Settings & branding saved successfully!');
    setTimeout(() => {
      setSavedMessage('');
      onClose();
    }, 1000);
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const data = {
      settings: {
        shopName,
        pdfBrandName,
        defaultCategory,
        whatsappNumber,
      },
      products,
      exportedAt: new Date().toISOString(),
      totalProducts: products.length,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shanti_Kangan_Catalog_Backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && Array.isArray(parsed.products)) {
          onImportProducts(parsed.products);
          if (parsed.settings) {
            onSaveSettings({ ...settings, ...parsed.settings });
          }
          alert(`✅ Successfully restored ${parsed.products.length} bangles and synced settings!`);
          onClose();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={JEET_GOLD_BRAND_LOGO}
                alt="Jeet Gold"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Playfair_Display']">
                Catalog & Shop Settings
              </h2>
              <p className="text-xs text-stone-400">
                Branding, WhatsApp contact & phone offline database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/80 px-4 pt-2 gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('BRANDING')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-t border-x -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === 'BRANDING'
                ? 'bg-white border-stone-200 text-amber-900 border-b-transparent shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Shop Branding & Watermark</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DEVICE_SYNC')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 border-t border-x -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === 'DEVICE_SYNC'
                ? 'bg-white border-stone-200 text-amber-900 border-b-transparent shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-600" />
            <span>Phone Storage & Backup</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: Shop Branding */}
          {activeTab === 'BRANDING' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Shop Name in App */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Shop Name (App Header)
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Shanti Kangan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* PDF & Share Brand Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Default Brand for PDF & WhatsApp Cards (Red Header)
                </label>
                <input
                  type="text"
                  value={pdfBrandName}
                  onChange={(e) => setPdfBrandName(e.target.value)}
                  placeholder="JEET GOLD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-red-600 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Printed on top of each product page in bold red text
                </p>
              </div>

              {/* Default Subtitle */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Default Footer Tagline
                </label>
                <input
                  type="text"
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value)}
                  placeholder="BANGELS GOLD COVERING"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#5A7365] focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* WhatsApp Contact */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Phone Storage & Backup */}
          {activeTab === 'DEVICE_SYNC' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Educational Explanation for Shopkeeper */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/90 space-y-2 text-stone-800">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>Phone & Tablet Storage Guide</span>
                  <Tablet className="w-4 h-4 text-amber-700" />
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <strong>Private Offline Storage:</strong> All your bangles, photos, and edits are securely saved directly in your phone storage (IndexedDB). No internet is required to browse or work!
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs space-y-2">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>🔄 To transfer changes between Phone & Tablet in seconds:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-stone-700 text-[11px] leading-normal pl-1">
                    <li>Click <strong>"Export Backup File"</strong> below to download your catalog.</li>
                    <li>Send the backup file to your WhatsApp or Google Drive.</li>
                    <li>Open this app on your other phone or tablet, go to <strong>"Import Backup File"</strong>, and pick that file.</li>
                    <li>All bangle photos, new codes, prices, and stock statuses will instantly load!</li>
                  </ol>
                </div>
              </div>

              {/* Backup & Restore Action Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Backup & Transfer Tools
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Backup ({products.length})</span>
                  </button>

                  <label className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Import Backup File</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportBackup}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset catalog to sample Jeet Gold bangles? Any custom added items will be replaced.')) {
                      onResetSampleData();
                      onClose();
                    }
                  }}
                  className="mt-2 w-full p-2.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 text-xs rounded-xl flex items-center justify-center gap-1 transition-colors border border-stone-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Original Sample Products</span>
                </button>
              </div>
            </div>
          )}

          {savedMessage && (
            <p className="text-xs font-bold text-emerald-600 text-center flex items-center justify-center gap-1 bg-emerald-50 py-2 rounded-xl border border-emerald-200 animate-in fade-in">
              <Check className="w-4 h-4" />
              {savedMessage}
            </p>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

