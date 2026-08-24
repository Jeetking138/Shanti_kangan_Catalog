export interface BangleSizeInfo {
  size: string;
  category: 'BABY_KIDS' | 'STANDARD' | 'LARGE';
  label: string;
  numericDiameter: number; // approximate inner diameter in inches or numeric scale for sorting
}

export const ALL_BANGLE_SIZES: BangleSizeInfo[] = [
  // Baby / Kids sizes (Requested by user: 1.8, 1.10, 1.12, 1.14, 2.0)
  { size: '1.8', category: 'BABY_KIDS', label: '1.8 (Baby Small)', numericDiameter: 1.5 },
  { size: '1.10', category: 'BABY_KIDS', label: '1.10 (Baby Medium)', numericDiameter: 1.625 },
  { size: '1.12', category: 'BABY_KIDS', label: '1.12 (Baby / Kids)', numericDiameter: 1.75 },
  { size: '1.14', category: 'BABY_KIDS', label: '1.14 (Kids Large)', numericDiameter: 1.875 },
  { size: '2.0', category: 'BABY_KIDS', label: '2.0 (Kids / Extra Small)', numericDiameter: 2.0 },

  // Standard Adult Sizes
  { size: '2.2', category: 'STANDARD', label: '2.2 (Small)', numericDiameter: 2.125 },
  { size: '2.4', category: 'STANDARD', label: '2.4 (Medium - Popular)', numericDiameter: 2.25 },
  { size: '2.6', category: 'STANDARD', label: '2.6 (Regular - Popular)', numericDiameter: 2.375 },
  { size: '2.8', category: 'STANDARD', label: '2.8 (Large - Popular)', numericDiameter: 2.5 },
  { size: '2.10', category: 'STANDARD', label: '2.10 (XL - Popular)', numericDiameter: 2.625 },
  { size: '2.12', category: 'STANDARD', label: '2.12 (2XL)', numericDiameter: 2.75 },
  { size: '2.14', category: 'STANDARD', label: '2.14 (3XL)', numericDiameter: 2.875 },
  { size: '2.16', category: 'LARGE', label: '2.16 (4XL)', numericDiameter: 3.0 },
  { size: '3.0', category: 'LARGE', label: '3.0 (Special Large)', numericDiameter: 3.0 },
];

export const BABY_KIDS_SIZES = ['1.8', '1.10', '1.12', '1.14', '2.0'];
export const STANDARD_ADULT_SIZES = ['2.2', '2.4', '2.6', '2.8', '2.10', '2.12', '2.14'];

export const SIZE_PRESETS = [
  {
    id: 'mk_standard',
    label: 'MK Reference (2.10, 2.8, 2.6, 2.4)',
    badge: 'Popular',
    sizes: ['2.10', '2.8', '2.6', '2.4'],
  },
  {
    id: 'baby_kids',
    label: 'Baby & Kids (2.0, 1.14, 1.12, 1.10, 1.8)',
    badge: 'Kids / Choti',
    sizes: ['2.0', '1.14', '1.12', '1.10', '1.8'],
  },
  {
    id: 'common_four',
    label: '4 Regular Sizes (2.4, 2.6, 2.8, 2.10)',
    badge: 'Wholesale',
    sizes: ['2.4', '2.6', '2.8', '2.10'],
  },
  {
    id: 'full_standard',
    label: 'All Adult (2.2 to 2.12)',
    badge: 'Full Set',
    sizes: ['2.2', '2.4', '2.6', '2.8', '2.10', '2.12'],
  },
  {
    id: 'complete_range',
    label: 'Complete Range (1.8 to 2.12)',
    badge: 'All Sizes',
    sizes: ['1.8', '1.10', '1.12', '1.14', '2.0', '2.2', '2.4', '2.6', '2.8', '2.10', '2.12'],
  },
];

/**
 * Converts Indian bangle size string (e.g. '2.4' or '1.14' or '2.10') to numeric value for accurate sorting
 * '1.8' -> 1.5, '1.10' -> 1.625, '1.14' -> 1.875, '2.0' -> 2.0, '2.2' -> 2.125, '2.10' -> 2.625
 */
export function getBangleSizeNumeric(sizeStr: string): number {
  const clean = sizeStr.trim().replace(/[^\d.]/g, '');
  const parts = clean.split('.');
  if (parts.length === 2) {
    const inches = parseInt(parts[0], 10) || 0;
    const soot = parseInt(parts[1], 10) || 0; // sixteenths of an inch
    return inches + soot / 16;
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 999 : parsed;
}

/**
 * Accurately sorts an array of bangle size strings from smallest (1.8) to largest (3.0)
 */
export function sortBangleSizes(sizes: string[], descending = false): string[] {
  return [...sizes].sort((a, b) => {
    const numA = getBangleSizeNumeric(a);
    const numB = getBangleSizeNumeric(b);
    return descending ? numB - numA : numA - numB;
  });
}
