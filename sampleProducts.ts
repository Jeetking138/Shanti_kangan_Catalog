import { Product } from '../types';

// Helper to generate realistic high-resolution SVG Data URLs for classic Gold bangles patterns
function createBangleDataUrl(patternName: string, subText: string, goldTone: string, patternType: string): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
    <defs>
      <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF3C4" />
        <stop offset="25%" stop-color="#F59E0B" />
        <stop offset="50%" stop-color="#D97706" />
        <stop offset="75%" stop-color="#FBBF24" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
      <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#78350F" stop-opacity="0.9" />
      </linearGradient>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#2D2A26" />
        <stop offset="100%" stop-color="#141312" />
      </radialGradient>
      <pattern id="laserCut1" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 0,15 Q 7.5,0 15,15 Q 22.5,30 30,15" fill="none" stroke="#FDE68A" stroke-width="2.5"/>
        <circle cx="15" cy="15" r="2.5" fill="#FFF" />
        <path d="M 15,0 L 15,30" stroke="#B45309" stroke-width="1.2" stroke-dasharray="2,2"/>
      </pattern>
      <pattern id="laserCut2" width="24" height="24" patternUnits="userSpaceOnUse">
        <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="#FEF08A" stroke-width="2"/>
        <circle cx="12" cy="12" r="2" fill="#F59E0B"/>
      </pattern>
      <pattern id="laserCut3" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect x="2" y="2" width="16" height="16" fill="none" stroke="#FBBF24" stroke-width="1.5"/>
        <circle cx="10" cy="10" r="3" fill="#FFFBEB"/>
      </pattern>
    </defs>

    <!-- Display Stand Background -->
    <rect width="900" height="540" fill="url(#bgGlow)" />
    
    <!-- Display Stand Rod -->
    <rect x="0" y="220" width="900" height="90" fill="#E2E8F0" opacity="0.9" />
    <rect x="0" y="220" width="900" height="10" fill="#CBD5E1" />
    <rect x="0" y="300" width="900" height="10" fill="#94A3B8" />

    <!-- Top Label Bar (Shop Showcase) -->
    <rect x="0" y="0" width="900" height="55" fill="#0F172A" />
    <text x="450" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="#F59E0B" text-anchor="middle" letter-spacing="3">${patternName}</text>

    <!-- Set 1 (Left 4 Bangles) -->
    <g transform="translate(60, 80)">
      <!-- 4 Bangle stack -->
      <rect x="0" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="0" y="0" width="45" height="380" rx="20" fill="url(#laserCut1)" opacity="0.8" />
      <rect x="4" y="0" width="6" height="380" fill="url(#goldShine)" opacity="0.6"/>

      <rect x="42" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="42" y="0" width="45" height="380" rx="20" fill="url(#laserCut1)" opacity="0.8" />

      <rect x="84" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="84" y="0" width="45" height="380" rx="20" fill="url(#laserCut1)" opacity="0.8" />

      <rect x="126" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="126" y="0" width="45" height="380" rx="20" fill="url(#laserCut1)" opacity="0.8" />
      <rect x="130" y="0" width="8" height="380" fill="url(#goldShine)" opacity="0.7"/>
    </g>

    <!-- Set 2 (Middle 4 Bangles) -->
    <g transform="translate(345, 80)">
      <rect x="0" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="0" y="0" width="45" height="380" rx="20" fill="url(#laserCut2)" opacity="0.85" />
      <rect x="5" y="0" width="6" height="380" fill="url(#goldShine)" opacity="0.6"/>

      <rect x="42" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="42" y="0" width="45" height="380" rx="20" fill="url(#laserCut2)" opacity="0.85" />

      <rect x="84" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="84" y="0" width="45" height="380" rx="20" fill="url(#laserCut2)" opacity="0.85" />

      <rect x="126" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="126" y="0" width="45" height="380" rx="20" fill="url(#laserCut2)" opacity="0.85" />
      <rect x="130" y="0" width="8" height="380" fill="url(#goldShine)" opacity="0.7"/>
    </g>

    <!-- Set 3 (Right 4 Bangles) -->
    <g transform="translate(630, 80)">
      <rect x="0" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="0" y="0" width="45" height="380" rx="20" fill="url(#laserCut3)" opacity="0.85" />
      <rect x="5" y="0" width="6" height="380" fill="url(#goldShine)" opacity="0.6"/>

      <rect x="42" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="42" y="0" width="45" height="380" rx="20" fill="url(#laserCut3)" opacity="0.85" />

      <rect x="84" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="84" y="0" width="45" height="380" rx="20" fill="url(#laserCut3)" opacity="0.85" />

      <rect x="126" y="0" width="45" height="380" rx="20" fill="url(#gold1)" stroke="#78350F" stroke-width="2" />
      <rect x="126" y="0" width="45" height="380" rx="20" fill="url(#laserCut3)" opacity="0.85" />
      <rect x="130" y="0" width="8" height="380" fill="url(#goldShine)" opacity="0.7"/>
    </g>

    <!-- Bottom Showcase Text -->
    <rect x="0" y="490" width="900" height="50" fill="#0A0A0A" />
    <text x="450" y="522" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="2">${subText}</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-mk806',
    code: 'MK806',
    name: 'CNC Gold Covering Wave Pattern Bangles (4 Pcs Set)',
    image: createBangleDataUrl('MK 806 - 1 GRAM GOLD FINISH', 'CNC MACHINE CUT - GUARANTEED MICRO GOLD COVERING', '#F59E0B', 'laserCut1'),
    sizes: ['2.10', '2.8', '2.6', '2.4'],
    stockStatus: 'IN_STOCK',
    category: 'BANGELS GOLD COVERING',
    price: 450,
    priceUnit: '/ set (4 Pcs)',
    pcsPerSet: '4 Pcs',
    brandName: 'JEET GOLD',
    notes: 'Premium high-gloss wave laser cut. Most popular wholesale design.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'prod-mk902',
    code: 'MK902',
    name: 'Floral Rhombus Diamond Cut Bangles (4 Pcs)',
    image: createBangleDataUrl('MK 902 - DIAMOND CUT SERIES', 'BANGLES GOLD COVERING - LONG LASTING SHINE', '#FBBF24', 'laserCut2'),
    sizes: ['2.8', '2.6', '2.4'],
    stockStatus: 'OUT_OF_STOCK', // Out of stock to demonstrate the RED indicator requested by user!
    category: 'BANGELS GOLD COVERING',
    price: 520,
    priceUnit: '/ set (4 Pcs)',
    pcsPerSet: '4 Pcs',
    brandName: 'JEET GOLD',
    notes: 'Out of stock - new batch arriving next week.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'prod-rj405',
    code: 'RJ405',
    name: 'Rajwadi Antique Matte Finish Kada Bangles',
    image: createBangleDataUrl('RJ 405 - RAJWADI COLLECTION', 'TRADITIONAL KANGAN & BANGLES SPECIALIST', '#D97706', 'laserCut3'),
    sizes: ['2.10', '2.8', '2.6', '2.4', '2.2'],
    stockStatus: 'IN_STOCK',
    category: 'RAJWADI KANGAN',
    price: 680,
    priceUnit: '/ pair (2 Pcs)',
    pcsPerSet: '2 Pcs',
    brandName: 'JEET GOLD',
    notes: 'Heavy weight daily wear kada with side locking.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'prod-gp208',
    code: 'GP208',
    name: 'Micro Plated Sleek Daily Wear Bangles (6 Pcs)',
    image: createBangleDataUrl('GP 208 - MICRO GOLD PLATED', 'BANGELS GOLD COVERING - WATERPROOF COATING', '#F59E0B', 'laserCut1'),
    sizes: ['2.8', '2.6', '2.4'],
    stockStatus: 'IN_STOCK',
    category: 'BANGELS GOLD COVERING',
    price: 390,
    priceUnit: '/ set (6 Pcs)',
    pcsPerSet: '6 Pcs',
    brandName: 'JEET GOLD',
    notes: 'Lightweight everyday bangle set.',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'prod-ck512',
    code: 'CK512',
    name: 'Classic Chuda Kada Interlock Bangles',
    image: createBangleDataUrl('CK 512 - BRIDAL SPECIAL', 'PREMIUM JEWELLERY - JEET GOLD CATALOG', '#D97706', 'laserCut2'),
    sizes: ['2.10', '2.8', '2.6'],
    stockStatus: 'OUT_OF_STOCK', // Out of stock example
    category: 'BANGELS GOLD COVERING',
    price: 750,
    priceUnit: '/ set (4 Pcs)',
    pcsPerSet: '4 Pcs',
    brandName: 'JEET GOLD',
    notes: 'Bridal special design, currently on pre-order.',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: 'prod-bk101',
    code: 'BK101',
    name: 'Baby & Kids Choti Bangles Set (Gold Finish)',
    image: createBangleDataUrl('BK 101 - BABY & KIDS SPECIAL', 'JEET GOLD - 1.8 TO 2.0 CHOTI BANGLES RANGE', '#F59E0B', 'laserCut3'),
    sizes: ['2.0', '1.14', '1.12', '1.10', '1.8'],
    stockStatus: 'IN_STOCK',
    category: 'BABY & KIDS SPECIAL',
    price: 320,
    priceUnit: '/ set (2 Pcs)',
    pcsPerSet: '2 Pcs',
    brandName: 'JEET GOLD',
    notes: 'Special small size choti bangles for babies and young kids. Smooth edges safe for children.',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
];
