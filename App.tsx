import React, { useState, useEffect, useMemo } from 'react';
import { Product, CatalogSettings, FilterStock, SortOption } from './types';
import {
  getAllProducts,
  saveProduct,
  saveMultipleProducts,
  deleteProduct as deleteProductFromDb,
  getSettings,
  saveSettings as saveSettingsToDb,
  DEFAULT_SETTINGS,
} from './services/storageService';
import { INITIAL_PRODUCTS } from './data/sampleProducts';
import { sortBangleSizes } from './utils/bangleSizes';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { SharePhotoModal } from './components/SharePhotoModal';
import { PdfExportModal } from './components/PdfExportModal';
import { SettingsModal } from './components/SettingsModal';
import { PhotoAdjustModal } from './components/PhotoAdjustModal';
import { ProductPhotoViewerModal } from './components/ProductPhotoViewerModal';
import {
  Plus,
  FileText,
  Sparkles,
  AlertCircle,
  Package,
  Layers,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<CatalogSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<FilterStock>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('NEWEST');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [productToShare, setProductToShare] = useState<Product | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // High-Res View Product Photo modal (Eye button)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Direct Photo Adjust modal for an existing bangle
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load from IndexedDB on startup
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [savedProducts, savedSettings] = await Promise.all([
          getAllProducts(),
          getSettings(),
        ]);

        if (savedProducts.length > 0) {
          setProducts(savedProducts);
        } else {
          // Preload initial sample products (like MK806, MK902 etc.)
          await saveMultipleProducts(INITIAL_PRODUCTS);
          setProducts(INITIAL_PRODUCTS);
        }

        setSettings(savedSettings);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setProducts(INITIAL_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Direct Save Adjusted Photo to Bangle
  const handleSaveAdjustedPhoto = async (newImageDataUrl: string) => {
    if (!adjustingProduct) return;

    const updatedProduct: Product = {
      ...adjustingProduct,
      image: newImageDataUrl,
      updatedAt: Date.now(),
    };

    await saveProduct(updatedProduct);
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    // If currently sharing or viewing this product, update targets too
    if (productToShare?.id === updatedProduct.id) {
      setProductToShare(updatedProduct);
    }
    if (viewingProduct?.id === updatedProduct.id) {
      setViewingProduct(updatedProduct);
    }

    setAdjustingProduct(null);
    showToast(`✅ Saved edited photo to Bangle ${updatedProduct.code}!`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (product: Product) => {
    await saveProduct(product);
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = product;
        return copy;
      }
      return [product, ...prev];
    });

    if (viewingProduct?.id === product.id) {
      setViewingProduct(product);
    }

    showToast(`Bangle ${product.code} saved successfully!`);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
  };

  // Delete product
  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete bangle ${product.code}?`)) {
      await deleteProductFromDb(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setSelectedProductIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      if (viewingProduct?.id === product.id) {
        setViewingProduct(null);
      }
      showToast(`Deleted ${product.code}`);
    }
  };

  // Toggle stock status directly
  const handleToggleStock = async (product: Product) => {
    const nextStatus = product.stockStatus === 'IN_STOCK' ? 'OUT_OF_STOCK' : 'IN_STOCK';
    const updated: Product = {
      ...product,
      stockStatus: nextStatus,
      updatedAt: Date.now(),
    };
    await saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    if (viewingProduct?.id === product.id) {
      setViewingProduct(updated);
    }
    showToast(
      nextStatus === 'OUT_OF_STOCK'
        ? `Marked ${product.code} as OUT OF STOCK`
        : `Marked ${product.code} as IN STOCK`
    );
  };

  // Save settings
  const handleSaveSettings = async (newSettings: CatalogSettings) => {
    await saveSettingsToDb(newSettings);
    setSettings(newSettings);
    showToast('Shop & PDF branding updated');
  };

  // Reset sample data
  const handleResetSampleData = async () => {
    await saveMultipleProducts(INITIAL_PRODUCTS);
    setProducts(INITIAL_PRODUCTS);
    setSelectedProductIds(new Set());
    showToast('Reset catalog to sample Jeet Gold bangles');
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Available Sizes list (Indian Bangle numerical ordering: 1.8 -> 2.0 -> 2.14)
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.sizes?.forEach((s) => set.add(s));
    });
    return sortBangleSizes(Array.from(set), true);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Stock filter
        if (stockFilter === 'IN_STOCK' && p.stockStatus !== 'IN_STOCK') return false;
        if (stockFilter === 'OUT_OF_STOCK' && p.stockStatus !== 'OUT_OF_STOCK') return false;

        // Category filter
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

        // Size filter
        if (selectedSize !== 'ALL' && (!p.sizes || !p.sizes.includes(selectedSize))) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchCode = p.code.toLowerCase().includes(q);
          const matchName = p.name?.toLowerCase().includes(q);
          const matchSizes = p.sizes?.some((s) => s.toLowerCase().includes(q));
          const matchCat = p.category?.toLowerCase().includes(q);
          return matchCode || matchName || matchSizes || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'STOCK_FIRST') {
          if (a.stockStatus === 'IN_STOCK' && b.stockStatus !== 'IN_STOCK') return -1;
          if (a.stockStatus !== 'IN_STOCK' && b.stockStatus === 'IN_STOCK') return 1;
          return b.createdAt - a.createdAt;
        }
        if (sortOption === 'CODE_ASC') return a.code.localeCompare(b.code);
        if (sortOption === 'CODE_DESC') return b.code.localeCompare(a.code);
        if (sortOption === 'OLDEST') return a.createdAt - b.createdAt;
        return b.createdAt - a.createdAt; // NEWEST
      });
  }, [products, stockFilter, selectedCategory, selectedSize, searchQuery, sortOption]);

  // Multi-select toggle
  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedProductIds.size === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProductIds(new Set());
    } else {
      const allIds = new Set(filteredProducts.map((p) => p.id));
      setSelectedProductIds(allIds);
    }
  };

  const handleSelectInStockOnly = () => {
    const inStockIds = new Set(
      products.filter((p) => p.stockStatus === 'IN_STOCK').map((p) => p.id)
    );
    setSelectedProductIds(inStockIds);
  };

  // Stock Counters
  const inStockCount = useMemo(
    () => products.filter((p) => p.stockStatus === 'IN_STOCK').length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stockStatus === 'OUT_OF_STOCK').length,
    [products]
  );

  const selectedProductsList = useMemo(() => {
    return products.filter((p) => selectedProductIds.has(p.id));
  }, [products, selectedProductIds]);

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-stone-900 flex flex-col">
      {/* 1. Main Header with Branding and Stock Badges */}
      <Header
        settings={settings}
        totalProducts={products.length}
        inStockCount={inStockCount}
        outOfStockCount={outOfStockCount}
        selectedCount={selectedProductIds.size}
        onOpenAddModal={() => {
          setProductToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onFilterStock={(status) => setStockFilter(status)}
        currentStockFilter={stockFilter}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 2. Filter & Search Toolbar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          availableSizes={availableSizes}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalVisible={filteredProducts.length}
          totalSelected={selectedProductIds.size}
          onToggleSelectAll={handleToggleSelectAll}
          isAllSelected={
            filteredProducts.length > 0 &&
            selectedProductIds.size === filteredProducts.length
          }
        />

        {/* 3. Products Grid */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-stone-500">Loading your bangles catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProductIds.has(product.id)}
                onToggleSelect={() => toggleSelectProduct(product.id)}
                onViewPhoto={() => setViewingProduct(product)}
                onSharePhoto={() => {
                  setProductToShare(product);
                  setIsShareModalOpen(true);
                }}
                onAdjustPhoto={() => setAdjustingProduct(product)}
                onEdit={() => {
                  setProductToEdit(product);
                  setIsAddModalOpen(true);
                }}
                onDelete={() => handleDeleteProduct(product)}
                onToggleStock={() => handleToggleStock(product)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              No bangles found
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              {searchQuery || stockFilter !== 'ALL' || selectedCategory !== 'ALL'
                ? 'Try adjusting your search keywords or active filters.'
                : 'Your catalog is currently empty. Click below to add your first bangle design.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {(searchQuery || stockFilter !== 'ALL' || selectedCategory !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStockFilter('ALL');
                    setSelectedCategory('ALL');
                    setSelectedSize('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Bangle
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Selection Bar for Multi-Product PDF Export */}
      {selectedProductIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-[92vw]">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white font-extrabold flex items-center justify-center text-[11px]">
              {selectedProductIds.size}
            </span>
            <span className="hidden sm:inline">Bangles Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProductIds(new Set())}
              className="text-stone-400 hover:text-white text-xs font-medium px-2 py-1 cursor-pointer"
            >
              Deselect
            </button>

            <button
              id="floating-pdf-btn"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate PDF Catalog</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. Product Photo Viewer Modal (Eye Icon) */}
      <ProductPhotoViewerModal
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        product={viewingProduct}
        settings={settings}
        onEditProduct={(p) => {
          setProductToEdit(p);
          setIsAddModalOpen(true);
        }}
        onAdjustPhoto={(p) => setAdjustingProduct(p)}
        onSharePhoto={(p) => {
          setProductToShare(p);
          setIsShareModalOpen(true);
        }}
        onToggleStock={(p) => handleToggleStock(p)}
      />

      {/* 5. Direct Photo Adjust Modal for existing bangle */}
      {adjustingProduct && (
        <PhotoAdjustModal
          isOpen={!!adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          imageUrl={adjustingProduct.image}
          onApply={handleSaveAdjustedPhoto}
          bangleCode={adjustingProduct.code}
        />
      )}

      {/* 7. Modals */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        settings={settings}
      />

      <SharePhotoModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setProductToShare(null);
        }}
        product={productToShare}
        settings={settings}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        selectedProducts={selectedProductsList}
        allProducts={products}
        settings={settings}
        onRemoveSelected={(id) => toggleSelectProduct(id)}
        onSelectAll={handleToggleSelectAll}
        onSelectInStockOnly={handleSelectInStockOnly}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        products={products}
        onImportProducts={(imported) => {
          setProducts(imported);
          saveMultipleProducts(imported);
        }}
        onResetSampleData={handleResetSampleData}
      />
    </div>
  );
}
