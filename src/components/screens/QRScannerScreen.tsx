import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { sampleMerchants } from '../../data/mockData';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Flashlight, 
  FlashlightOff, 
  Keyboard, 
  ScanLine, 
  Camera, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface QRScannerScreenProps {
  onClose: () => void;
  onScanSuccess: (merchant: {
    name: string;
    upiId: string;
    amount?: number;
    note?: string;
  }) => void;
}

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ onClose, onScanSuccess }) => {
  const { audioEnabled } = useApp();
  const [flashlight, setFlashlight] = useState<boolean>(false);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualUpi, setManualUpi] = useState<string>('');
  const [usingRealCamera, setUsingRealCamera] = useState<boolean>(false);
  const [showGalleryPresets, setShowGalleryPresets] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Request actual camera stream if user clicks enable
  const startCamera = async () => {
    try {
      playTapSound(audioEnabled);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setUsingRealCamera(true);
      }
    } catch {
      alert('Camera access unavailable or declined. Using interactive simulated viewfinder!');
      setUsingRealCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSelectPreset = (merchant: typeof sampleMerchants[0]) => {
    playSuccessSound(audioEnabled);
    onScanSuccess({
      name: merchant.name,
      upiId: merchant.upiId,
      amount: merchant.defaultAmount,
      note: merchant.note,
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUpi.trim()) return;
    playSuccessSound(audioEnabled);
    const cleaned = manualUpi.trim();
    onScanSuccess({
      name: cleaned.includes('@') ? cleaned.split('@')[0] : cleaned,
      upiId: cleaned.includes('@') ? cleaned : `${cleaned}@aipay`,
      amount: 15.00,
      note: 'Payment to ' + cleaned,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="z-20 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          aria-label="Close scanner"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <span className="text-sm font-bold tracking-tight">Scan Any QR or UPI</span>

        <button
          onClick={() => {
            playTapSound(audioEnabled);
            setFlashlight(!flashlight);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${
            flashlight ? 'bg-amber-400 text-black' : 'bg-white/10 text-white'
          }`}
          aria-label="Toggle flashlight"
        >
          {flashlight ? <Flashlight className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Viewfinder Center */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        {/* Real Camera Feed or High-Tech Simulated Matrix Feed */}
        {usingRealCamera ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient scanner grid lines */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* Background simulated merchant QR */}
            <div className="opacity-25 blur-xs scale-90">
              <div className="w-64 h-64 border-2 border-indigo-400/40 rounded-3xl flex items-center justify-center p-4">
                <div className="w-48 h-48 bg-white/10 rounded-2xl grid grid-cols-4 gap-2 p-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`rounded ${i % 2 === 0 ? 'bg-indigo-400/50' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Viewfinder Target Frame */}
        <div className="relative z-10 w-64 h-64 border-2 border-white/20 rounded-3xl flex flex-col items-center justify-between p-2 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]">
          {/* 4 Corner Markers */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />

          {/* Animated Laser Scanning Beam */}
          <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scan-laser pointer-events-none" />

          <span className="text-[11px] font-semibold text-cyan-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-cyan-400/30 mt-2">
            Align QR code inside frame
          </span>

          {!usingRealCamera && (
            <button
              onClick={startCamera}
              className="text-[11px] font-medium text-slate-300 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md mb-2 flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enable Device Camera</span>
            </button>
          )}
        </div>

        {/* Tap on a simulated target merchant */}
        <p className="text-xs text-slate-400 mt-4 text-center z-10 font-medium max-w-xs">
          Point at any UPI or merchant QR code, or pick a sample merchant below:
        </p>
      </div>

      {/* Bottom Actions Drawer */}
      <div className="z-20 p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl rounded-t-3xl space-y-3">
        {/* Quick Sample QR Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Quick Test Merchant QRs:</span>
            <span className="text-[10px] text-cyan-400">Tap to Scan</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sampleMerchants.slice(0, 2).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectPreset(m)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-2.5 text-left transition-all active:scale-95"
              >
                <span className="text-lg">{m.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold">${m.defaultAmount.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sampleMerchants.slice(2, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectPreset(m)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-2.5 text-left transition-all active:scale-95"
              >
                <span className="text-lg">{m.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold">${m.defaultAmount.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Upload & Manual UPI Input Toggle */}
        <div className="flex items-center gap-2 pt-1">
          <label className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Upload QR Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => handleSelectPreset(sampleMerchants[0])}
            />
          </label>

          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <span>Enter UPI ID</span>
          </button>
        </div>

        {/* Manual UPI Sheet */}
        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="pt-2 flex gap-2 animate-in fade-in duration-200">
            <input
              type="text"
              value={manualUpi}
              onChange={(e) => setManualUpi(e.target.value)}
              placeholder="e.g. coffee.shop@aipay"
              className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-indigo-500 rounded-xl text-xs text-white outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
