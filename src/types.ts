export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK';

export interface Product {
  id: string;
  code: string; // e.g. "MK806"
  name?: string; // Optional descriptive name
  image: string; // Data URL or Image URL
  imageWidth?: number;
  imageHeight?: number;
  sizes: string[]; // e.g. ["2.10", "2.8", "2.6", "2.4"]
  stockStatus: StockStatus; // IN_STOCK or OUT_OF_STOCK (shown in red)
  category: string; // e.g. "BANGELS GOLD COVERING"
  price?: number; // Optional wholesale / retail price
  priceUnit?: string; // e.g. "per dozen", "per set", "per pair"
  pcsPerSet?: string; // e.g. "4 Pcs", "2 Pcs", "6 Pcs", "12 Pcs"
  brandName?: string; // e.g. "JEET GOLD" for the photo/pdf
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PinLockConfig {
  isEnabled: boolean;
  pinCode: string; // 4 to 6 digit numeric PIN (e.g. "1234")
  hint?: string; // Optional PIN reminder hint
  autoLockMinutes: number; // 0 for immediate on reload, 5, 15, 30, or -1 for manual only
  lastUnlockedAt?: number;
}

export interface CatalogSettings {
  shopName: string; // "Shanti Kangan"
  pdfBrandName: string; // "JEET GOLD"
  defaultCategory: string; // "BANGELS GOLD COVERING"
  whatsappNumber: string;
  currencySymbol: string;
  pinLock?: PinLockConfig;
}

export interface ShareCardOptions {
  brandName: string; // "JEET GOLD"
  productCode: string;
  sizes: string[];
  categorySubtitle: string;
  includePrice: boolean;
  price?: number;
  priceUnit?: string;
  includeStockStatus: boolean;
  stockStatus?: StockStatus;
  customNote?: string;
  phoneNumber?: string;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  watermarkOpacity?: number;
}

export interface PdfExportConfig {
  brandName: string; // "JEET GOLD"
  categorySubtitle: string; // "BANGELS GOLD COVERING"
  includePrice: boolean; // default false
  includeStockStatus: boolean; // default false
  layout: '1_per_page' | '2_per_page' | '4_grid';
  showPageNumbers: boolean;
  whatsappContact?: string;
  watermarkEnabled?: boolean;
  watermarkText?: string; // "JEET GOLD"
  watermarkOpacity?: number; // e.g. 0.10 (10% brightness)
}

export type FilterStock = 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK';
export type SortOption = 'NEWEST' | 'OLDEST' | 'CODE_ASC' | 'CODE_DESC' | 'STOCK_FIRST';
