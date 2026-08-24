import { Product, CatalogSettings } from '../types';

const DB_NAME = 'ShantiKanganDB';
const DB_VERSION = 1;
const STORE_PRODUCTS = 'products';
const STORE_SETTINGS = 'settings';

export const DEFAULT_SETTINGS: CatalogSettings = {
  shopName: 'Shanti Kangan',
  pdfBrandName: 'JEET GOLD',
  defaultCategory: 'BANGELS GOLD COVERING',
  whatsappNumber: '',
  currencySymbol: '₹',
  pinLock: {
    isEnabled: true,
    pinCode: '1234',
    hint: 'Default PIN password is 1234 (Can be changed in Settings)',
    autoLockMinutes: 0,
  },
};

// IndexedDB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
        db.createObjectStore(STORE_PRODUCTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };
  });
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PRODUCTS], 'readonly');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.getAll();
      request.onsuccess = () => {
        const result = (request.result as Product[]) || [];
        // Sort by newest by default
        result.sort((a, b) => b.createdAt - a.createdAt);
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB read failed, trying localStorage fallback', err);
    const local = localStorage.getItem('sk_products');
    return local ? JSON.parse(local) : [];
  }
}

export async function saveProduct(product: Product): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PRODUCTS], 'readwrite');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.put(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB write failed, writing to localStorage', err);
    const current = await getAllProducts();
    const index = current.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      current[index] = product;
    } else {
      current.unshift(product);
    }
    try {
      localStorage.setItem('sk_products', JSON.stringify(current));
    } catch {
      console.error('LocalStorage quota exceeded');
    }
  }
}

export async function saveMultipleProducts(products: Product[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PRODUCTS], 'readwrite');
      const store = transaction.objectStore(STORE_PRODUCTS);
      products.forEach((p) => store.put(p));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('IndexedDB bulk save failed', err);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PRODUCTS], 'readwrite');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.delete(productId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed', err);
    const current = await getAllProducts();
    const filtered = current.filter((p) => p.id !== productId);
    localStorage.setItem('sk_products', JSON.stringify(filtered));
  }
}

export async function getSettings(): Promise<CatalogSettings> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_SETTINGS], 'readonly');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.get('app_settings');
      request.onsuccess = () => {
        if (request.result && request.result.value) {
          resolve({ ...DEFAULT_SETTINGS, ...request.result.value });
        } else {
          resolve(DEFAULT_SETTINGS);
        }
      };
      request.onerror = () => resolve(DEFAULT_SETTINGS);
    });
  } catch {
    const local = localStorage.getItem('sk_settings');
    return local ? { ...DEFAULT_SETTINGS, ...JSON.parse(local) } : DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: CatalogSettings): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SETTINGS], 'readwrite');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.put({ key: 'app_settings', value: settings });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB settings write failed', err);
    localStorage.setItem('sk_settings', JSON.stringify(settings));
  }
}
