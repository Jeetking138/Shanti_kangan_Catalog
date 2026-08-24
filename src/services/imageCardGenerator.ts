import { Product, ShareCardOptions } from '../types';

/**
 * Loads an image from a URL or data URL and returns an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

/**
 * Generates a high-resolution Canvas matching the exact JEET GOLD reference card
 * Crucial: Keeps original image aspect ratio completely intact (0 compression / distortion)
 */
export async function renderProductCardToCanvas(
  product: Product,
  options: ShareCardOptions
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Load the product image
  const img = await loadImage(product.image);

  // Standard high-resolution width for WhatsApp and crystal clear sharing
  const CARD_WIDTH = 1080;
  const PADDING_X = 40;
  const TOP_PADDING = 30;

  // Calculate image placement preserving 100% natural aspect ratio
  const imgNaturalW = img.naturalWidth || 800;
  const imgNaturalH = img.naturalHeight || 600;
  const imgAspect = imgNaturalH / imgNaturalW;

  // Calculate rendered image width and height
  const availableImgWidth = CARD_WIDTH - PADDING_X * 2;
  const renderedImgHeight = Math.round(availableImgWidth * imgAspect);

  // Calculate bottom info section height
  let infoHeight = 440;
  if (options.includePrice && (product.price || options.price)) {
    infoHeight += 70;
  }
  if (options.includeStockStatus) {
    infoHeight += 50;
  }

  const CARD_HEIGHT = TOP_PADDING + renderedImgHeight + infoHeight;

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  // 1. Draw Clean White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Draw Subtle Border & Soft background for top image container
  ctx.fillStyle = '#FBFBFB';
  ctx.fillRect(PADDING_X - 10, TOP_PADDING - 10, availableImgWidth + 20, renderedImgHeight + 20);

  // 3. Draw Product Image (Exact natural aspect ratio, crisp smoothing)
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    img,
    0,
    0,
    imgNaturalW,
    imgNaturalH,
    PADDING_X,
    TOP_PADDING,
    availableImgWidth,
    renderedImgHeight
  );

  // Border around image
  ctx.strokeStyle = '#EAEAEA';
  ctx.lineWidth = 2;
  ctx.strokeRect(PADDING_X, TOP_PADDING, availableImgWidth, renderedImgHeight);

  // 4. Content Area
  let currentY = TOP_PADDING + renderedImgHeight + 60;

  // --- BRAND NAME (e.g. "JEET GOLD" in bold Red) ---
  const brandName = options.brandName || 'JEET GOLD';
  ctx.fillStyle = '#E53935'; // Vibrant rich red
  ctx.font = '800 48px "Plus Jakarta Sans", "Cinzel", "Arial", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText(brandName.toUpperCase(), CARD_WIDTH / 2, currentY);

  currentY += 45;

  // --- PRODUCT CODE BADGE (e.g. Green block with "MK806" in white) ---
  const codeText = (options.productCode || product.code || 'CODE').toUpperCase();
  ctx.font = '800 42px "Plus Jakarta Sans", "Arial", sans-serif';
  const textMetrics = ctx.measureText(codeText);
  const badgeTextWidth = textMetrics.width;
  const badgePaddingX = 50;
  const badgeWidth = Math.max(badgeTextWidth + badgePaddingX * 2, 280);
  const badgeHeight = 70;
  const badgeX = (CARD_WIDTH - badgeWidth) / 2;
  const badgeY = currentY;

  // Draw rounded green badge (#5A825C)
  const badgeRadius = 14;
  ctx.fillStyle = '#5A825C'; // Sage / Olive green from reference photo
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeRadius);
  ctx.fill();

  // Draw badge text in pure white
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 40px "Plus Jakarta Sans", "Arial", sans-serif';
  ctx.fillText(codeText, CARD_WIDTH / 2, badgeY + badgeHeight / 2 + 2);

  currentY += badgeHeight + 50;

  // --- SIZES (e.g. "2.10, 2.8,2.6,2.4") ---
  const sizesList = options.sizes && options.sizes.length > 0
    ? options.sizes.join(', ')
    : product.sizes?.join(', ') || 'Standard Sizes';

  ctx.fillStyle = '#2D3142'; // Deep charcoal/brown
  ctx.textBaseline = 'alphabetic';
  ctx.font = '800 46px "Plus Jakarta Sans", "Arial", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(sizesList, CARD_WIDTH / 2, currentY);

  currentY += 45;

  // Optional: Price Display (if toggled ON)
  const priceVal = options.price ?? product.price;
  if (options.includePrice && priceVal) {
    const priceUnit = options.priceUnit || product.priceUnit || '';
    const priceString = `₹${priceVal.toLocaleString('en-IN')} ${priceUnit}`.trim();
    ctx.fillStyle = '#B45309'; // Warm amber/gold
    ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(priceString, CARD_WIDTH / 2, currentY);
    currentY += 45;
  }

  // Optional: Stock Status Banner
  if (options.includeStockStatus) {
    const isOutOfStock = (options.stockStatus || product.stockStatus) === 'OUT_OF_STOCK';
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    if (isOutOfStock) {
      ctx.fillStyle = '#DC2626';
      ctx.fillText('● OUT OF STOCK', CARD_WIDTH / 2, currentY);
    } else {
      ctx.fillStyle = '#16A34A';
      ctx.fillText('● IN STOCK - READY TO DISPATCH', CARD_WIDTH / 2, currentY);
    }
    currentY += 35;
  }

  // --- BOTTOM RIGHT FOOTER (e.g. "BANGELS GOLD COVERING") ---
  const footerCategory = (options.categorySubtitle || product.category || 'BANGELS GOLD COVERING').toUpperCase();
  ctx.fillStyle = '#5A7365'; // Muted dark green
  ctx.font = '600 28px "Plus Jakarta Sans", "Arial", sans-serif';
  ctx.textAlign = 'right';
  ctx.letterSpacing = '1px';
  ctx.fillText(footerCategory, CARD_WIDTH - PADDING_X - 10, CARD_HEIGHT - 35);

  // Optional Shop branding tag on bottom left
  if (options.phoneNumber) {
    ctx.fillStyle = '#718096';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`📱 WhatsApp: ${options.phoneNumber}`, PADDING_X + 10, CARD_HEIGHT - 35);
  }

  // --- OPTIONAL WATERMARK: "JEET GOLD" with Adjustable Brightness / Opacity ---
  if (options.watermarkEnabled !== false && options.watermarkOpacity && options.watermarkOpacity > 0) {
    const wmText = (options.watermarkText || options.brandName || 'JEET GOLD').toUpperCase();
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(options.watermarkOpacity, 0.02), 0.8);
    ctx.font = '900 76px "Playfair Display", "Cinzel", "Arial", sans-serif';
    ctx.fillStyle = '#C59B27'; // Metallic Gold
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw diagonal watermark across image area
    const centerImgX = CARD_WIDTH / 2;
    const centerImgY = TOP_PADDING + renderedImgHeight / 2;
    ctx.translate(centerImgX, centerImgY);
    ctx.rotate(-28 * Math.PI / 180);
    ctx.fillText(wmText, 0, 0);
    ctx.restore();
  }

  return canvas;
}

/**
 * Converts canvas to Blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas to Blob conversion failed'));
    }, type, quality);
  });
}

/**
 * Downloads a canvas as a high-quality PNG image
 */
export async function downloadProductCardImage(
  product: Product,
  options: ShareCardOptions,
  filename?: string
): Promise<void> {
  const canvas = await renderProductCardToCanvas(product, options);
  const blob = await canvasToBlob(canvas, 'image/png');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${options.brandName || 'JEET_GOLD'}_${product.code || 'Bangle'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Shares the product card directly via Web Share API (WhatsApp on mobile) or fallback
 */
export async function shareProductCard(
  product: Product,
  options: ShareCardOptions
): Promise<{ success: boolean; method: 'web_share' | 'download_fallback' | 'whatsapp_link' }> {
  try {
    const canvas = await renderProductCardToCanvas(product, options);
    const blob = await canvasToBlob(canvas, 'image/png');
    const fileName = `${options.brandName || 'JEET_GOLD'}_${product.code || 'Bangle'}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    const shareText = `*${options.brandName || 'JEET GOLD'}*\nProduct: *${product.code}*\nSizes: ${product.sizes.join(', ')}\nCategory: ${product.category}${options.includePrice && product.price ? `\nPrice: ₹${product.price} ${product.priceUnit || ''}` : ''}`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `${options.brandName || 'JEET GOLD'} - ${product.code}`,
        text: shareText,
        files: [file],
      });
      return { success: true, method: 'web_share' };
    }
  } catch (err: unknown) {
    if ((err as Error)?.name === 'AbortError') {
      return { success: false, method: 'web_share' };
    }
    console.warn('Web Share failed, falling back', err);
  }

  // Fallback: Download image and open WhatsApp with formatted message
  await downloadProductCardImage(product, options);
  const msg = encodeURIComponent(
    `*${options.brandName || 'JEET GOLD'}*\nCode: *${product.code}*\nSizes: ${product.sizes.join(', ')}\n${product.category}`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
  return { success: true, method: 'whatsapp_link' };
}

/**
 * Copies the high resolution card image to clipboard
 */
export async function copyCardImageToClipboard(
  product: Product,
  options: ShareCardOptions
): Promise<boolean> {
  try {
    const canvas = await renderProductCardToCanvas(product, options);
    const blob = await canvasToBlob(canvas, 'image/png');
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error('Clipboard write failed', err);
    return false;
  }
}
