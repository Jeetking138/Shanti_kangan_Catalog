import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast,
  Sparkles,
  RefreshCw,
  Check,
  Move,
  Sliders,
  Crop,
  Layers,
  Palette,
  Save,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  imageUrl?: string;
  onApply: (adjustedDataUrl: string) => void;
  title?: string;
  productCode?: string;
  bangleCode?: string;
  isDirectEdit?: boolean;
}

type AspectRatioOption = 'FREE' | '4:3' | '16:9' | '1:1' | '3:4';
type BgColorOption = 'BLACK' | 'WHITE' | 'IVORY' | 'DARK_VELVET';

export const PhotoAdjustModal: React.FC<PhotoAdjustModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageUrl,
  onApply,
  title = 'Free Photo Adjust & Crop',
  productCode,
  bangleCode,
  isDirectEdit,
}) => {
  const activeImage = imageSrc || imageUrl || '';
  const currentCode = productCode || bangleCode || '';
  // Transform State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0); // in degrees: 0, 90, 180, 270 + fine angle
  const [fineAngle, setFineAngle] = useState<number>(0); // -45 to +45
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Framing & Aspect Ratio
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('FREE');
  const [bgColor, setBgColor] = useState<BgColorOption>('WHITE');

  // Color & Jewelry Enhancements
  const [brightness, setBrightness] = useState<number>(100); // 50 to 150
  const [contrast, setContrast] = useState<number>(100); // 50 to 150
  const [saturation, setSaturation] = useState<number>(100); // 50 to 150
  const [goldEnhance, setGoldEnhance] = useState<boolean>(false); // Boosts yellow gold glow

  // UI Tabs for Mobile / Compact view
  const [activeTab, setActiveTab] = useState<'TRANSFORM' | 'COLOR' | 'FRAME'>('TRANSFORM');

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas and Image references
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Load Image
  useEffect(() => {
    if (!isOpen || !activeImage) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setIsImageLoaded(true);
      resetAdjustments();
    };
    img.src = activeImage;
  }, [isOpen, activeImage]);

  // Reset Adjustments
  const resetAdjustments = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFineAngle(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio('FREE');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGoldEnhance(false);
  };

  // 90-degree rotations
  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  // Toggle Gold Warmth Boost
  const handleToggleGoldEnhance = () => {
    if (!goldEnhance) {
      setGoldEnhance(true);
      setSaturation(125);
      setContrast(115);
      setBrightness(105);
    } else {
      setGoldEnhance(false);
      setSaturation(100);
      setContrast(100);
      setBrightness(100);
    }
  };

  // Mouse / Touch Drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPanRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: initialPanRef.current.x + dx,
      y: initialPanRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialPanRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: initialPanRef.current.x + dx,
      y: initialPanRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.25), 4));
  };

  // Render to Live Canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !isImageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine target canvas dimensions based on aspect ratio
    let targetW = 900;
    let targetH = 600;

    const imgNatW = img.naturalWidth || 800;
    const imgNatH = img.naturalHeight || 600;

    if (aspectRatio === 'FREE') {
      targetW = 900;
      targetH = Math.round((900 * imgNatH) / imgNatW);
    } else if (aspectRatio === '4:3') {
      targetW = 900;
      targetH = 675;
    } else if (aspectRatio === '16:9') {
      targetW = 960;
      targetH = 540;
    } else if (aspectRatio === '1:1') {
      targetW = 800;
      targetH = 800;
    } else if (aspectRatio === '3:4') {
      targetW = 675;
      targetH = 900;
    }

    // Set canvas dimensions
    canvas.width = targetW;
    canvas.height = targetH;

    // Fill Background
    if (bgColor === 'BLACK') ctx.fillStyle = '#0F0E0E';
    else if (bgColor === 'DARK_VELVET') ctx.fillStyle = '#1A1816';
    else if (bgColor === 'IVORY') ctx.fillStyle = '#FAF7EE';
    else ctx.fillStyle = '#FFFFFF';

    ctx.fillRect(0, 0, targetW, targetH);

    // Apply Filters (Brightness, Contrast, Saturation)
    ctx.save();
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (goldEnhance) {
      filterString += ` sepia(10%) hue-rotate(-5deg)`;
    }
    ctx.filter = filterString;

    // Coordinate transformation
    ctx.translate(targetW / 2 + pan.x, targetH / 2 + pan.y);

    const totalAngle = ((rotation + fineAngle) * Math.PI) / 180;
    ctx.rotate(totalAngle);
    ctx.scale((flipH ? -1 : 1) * zoom, (flipV ? -1 : 1) * zoom);

    // High quality interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Proportional dimensions to fit nicely inside canvas
    const scaleToFit = Math.min(targetW / imgNatW, targetH / imgNatH);
    const drawW = imgNatW * scaleToFit;
    const drawH = imgNatH * scaleToFit;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
  }, [
    isImageLoaded,
    aspectRatio,
    bgColor,
    zoom,
    pan,
    rotation,
    fineAngle,
    flipH,
    flipV,
    brightness,
    contrast,
    saturation,
    goldEnhance,
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Apply Changes & Generate High Quality Data URL
  const handleApply = () => {
    const img = imgRef.current;
    if (!img || !isImageLoaded) return;

    // Create an explicit offscreen canvas for crisp export
    let targetW = 900;
    let targetH = 600;
    const imgNatW = img.naturalWidth || 800;
    const imgNatH = img.naturalHeight || 600;

    if (aspectRatio === 'FREE') {
      targetW = 900;
      targetH = Math.round((900 * imgNatH) / imgNatW);
    } else if (aspectRatio === '4:3') {
      targetW = 900;
      targetH = 675;
    } else if (aspectRatio === '16:9') {
      targetW = 960;
      targetH = 540;
    } else if (aspectRatio === '1:1') {
      targetW = 800;
      targetH = 800;
    } else if (aspectRatio === '3:4') {
      targetW = 675;
      targetH = 900;
    }

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = targetW;
    exportCanvas.height = targetH;
    const ctx = exportCanvas.getContext('2d');

    if (ctx) {
      if (bgColor === 'BLACK') ctx.fillStyle = '#0F0E0E';
      else if (bgColor === 'DARK_VELVET') ctx.fillStyle = '#1A1816';
      else if (bgColor === 'IVORY') ctx.fillStyle = '#FAF7EE';
      else ctx.fillStyle = '#FFFFFF';

      ctx.fillRect(0, 0, targetW, targetH);

      ctx.save();
      let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      if (goldEnhance) {
        filterString += ` sepia(10%) hue-rotate(-5deg)`;
      }
      ctx.filter = filterString;

      ctx.translate(targetW / 2 + pan.x, targetH / 2 + pan.y);
      const totalAngle = ((rotation + fineAngle) * Math.PI) / 180;
      ctx.rotate(totalAngle);
      ctx.scale((flipH ? -1 : 1) * zoom, (flipV ? -1 : 1) * zoom);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const scaleToFit = Math.min(targetW / imgNatW, targetH / imgNatH);
      const drawW = imgNatW * scaleToFit;
      const drawH = imgNatH * scaleToFit;

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const adjustedDataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);
      onApply(adjustedDataUrl);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      onClose();
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const adjustedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onApply(adjustedDataUrl);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950 flex items-center justify-between border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[11px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                  Free Adjust & Rotate
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Drag to pan, pinch/wheel to zoom, rotate 90° or fine-tune gold jewelry luster
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAdjustments}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset all adjustments"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden min-h-[480px]">
          {/* Left Canvas Preview Area */}
          <div
            ref={containerRef}
            className="lg:col-span-8 bg-stone-950 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-stone-800/80"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Aspect Ratio Box Indicator */}
            <div className="relative max-w-full max-h-[55vh] flex items-center justify-center rounded-2xl overflow-hidden border-2 border-stone-700/60 shadow-2xl bg-black">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[55vh] w-auto h-auto object-contain pointer-events-none rounded-xl"
              />

              {/* Grid Guide Overlay (Subtle rule of thirds) */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-amber-500/20 opacity-40">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>
            </div>

            {/* Quick Floating Zoom Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700/80 flex items-center gap-3 shadow-xl z-20">
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.25))}
                className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-stone-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-amber-400 min-w-[45px] text-center">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoom((prev) => Math.min(prev + 0.15, 4))}
                className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-stone-800"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-stone-700" />

              <button
                onClick={() => setPan({ x: 0, y: 0 })}
                className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-stone-800"
                title="Center Framing"
              >
                <Move className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="lg:col-span-4 bg-stone-900 p-5 flex flex-col justify-between overflow-y-auto space-y-4 max-h-[55vh] lg:max-h-none">
            {/* Control Tabs */}
            <div className="space-y-4">
              <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
                <button
                  onClick={() => setActiveTab('TRANSFORM')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'TRANSFORM'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Transform & Rotate</span>
                </button>
                <button
                  onClick={() => setActiveTab('COLOR')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'COLOR'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Gold Luster</span>
                </button>
                <button
                  onClick={() => setActiveTab('FRAME')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'FRAME'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Aspect & Frame</span>
                </button>
              </div>

              {/* TAB 1: Transform, 90° Rotate, Fine Angle, Flip */}
              {activeTab === 'TRANSFORM' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* 90-deg Rotations */}
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                      Quick 90° Rotations & Flips
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={handleRotateLeft}
                        className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex flex-col items-center gap-1 transition-colors border border-stone-700"
                        title="Rotate 90° Left"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span className="text-[10px]">Left 90°</span>
                      </button>
                      <button
                        onClick={handleRotateRight}
                        className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex flex-col items-center gap-1 transition-colors border border-stone-700"
                        title="Rotate 90° Right"
                      >
                        <RotateCw className="w-4 h-4 text-amber-400" />
                        <span className="text-[10px]">Right 90°</span>
                      </button>
                      <button
                        onClick={() => setFlipH(!flipH)}
                        className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-colors border ${
                          flipH
                            ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                            : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
                        }`}
                        title="Flip Horizontal (Mirror)"
                      >
                        <FlipHorizontal className="w-4 h-4" />
                        <span className="text-[10px]">Flip H</span>
                      </button>
                      <button
                        onClick={() => setFlipV(!flipV)}
                        className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-colors border ${
                          flipV
                            ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                            : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
                        }`}
                        title="Flip Vertical"
                      >
                        <FlipVertical className="w-4 h-4" />
                        <span className="text-[10px]">Flip V</span>
                      </button>
                    </div>
                  </div>

                  {/* Fine Angle Straightening Slider */}
                  <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <span>Straighten / Fine Angle</span>
                      </label>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {fineAngle > 0 ? `+${fineAngle}°` : `${fineAngle}°`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="1"
                      value={fineAngle}
                      onChange={(e) => setFineAngle(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                      <span>-45°</span>
                      <button
                        onClick={() => setFineAngle(0)}
                        className="text-stone-400 hover:text-amber-400"
                      >
                        Level (0°)
                      </button>
                      <span>+45°</span>
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-stone-300">
                        Scale / Zoom Level
                      </label>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="3.5"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Gold Jewelry Luster & Enhancements */}
              {activeTab === 'COLOR' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  {/* 1-Click Gold Shine Boost */}
                  <button
                    onClick={handleToggleGoldEnhance}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      goldEnhance
                        ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-amber-950 font-black flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Auto Gold Luster Boost</div>
                        <div className="text-[10px] text-stone-400">
                          Enhances yellow gold reflections & diamond cut sparkle
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        goldEnhance ? 'bg-amber-500 text-black' : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {goldEnhance ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Brightness */}
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> Brightness
                      </span>
                      <span className="text-stone-400 font-mono">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="160"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Contrast className="w-3.5 h-3.5 text-amber-400" /> Contrast
                      </span>
                      <span className="text-stone-400 font-mono">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="160"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Gold Richness (Saturation)
                      </span>
                      <span className="text-stone-400 font-mono">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="180"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Aspect Ratio & Background Matting */}
              {activeTab === 'FRAME' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Aspect Ratios */}
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                      Crop & Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'FREE', label: 'Natural Ratio (Full Stand)', sub: 'Original Photo' },
                        { id: '4:3', label: '4:3 Jewelry Card', sub: 'Standard Catalog' },
                        { id: '16:9', label: '16:9 Wide Banner', sub: 'Long Bangle Rod' },
                        { id: '1:1', label: '1:1 Square', sub: 'Social Media' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setAspectRatio(opt.id as AspectRatioOption)}
                          className={`p-2.5 rounded-xl text-left border transition-all ${
                            aspectRatio === opt.id
                              ? 'bg-amber-600/30 border-amber-400 text-white shadow-md'
                              : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                          }`}
                        >
                          <div className="text-xs font-bold">{opt.label}</div>
                          <div className="text-[10px] text-stone-400">{opt.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Pad Tone */}
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                      Background Frame Tone
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'WHITE', label: 'Pure White', bg: 'bg-white text-black' },
                        { id: 'IVORY', label: 'Soft Ivory', bg: 'bg-[#FAF7EE] text-black' },
                        { id: 'DARK_VELVET', label: 'Velvet Black', bg: 'bg-[#1A1816] text-white' },
                        { id: 'BLACK', label: 'Deep Black', bg: 'bg-black text-white' },
                      ].map((bgOpt) => (
                        <button
                          key={bgOpt.id}
                          onClick={() => setBgColor(bgOpt.id as BgColorOption)}
                          className={`py-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                            bgColor === bgOpt.id
                              ? 'border-amber-400 ring-2 ring-amber-500/40 shadow-lg'
                              : 'border-stone-700 hover:border-stone-500'
                          } ${bgOpt.bg}`}
                        >
                          <span className="text-[10px]">{bgOpt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Apply / Cancel Action Buttons */}
            <div className="pt-3 border-t border-stone-800 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-900/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Update Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
