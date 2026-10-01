import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Building, 
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface ReceiveMoneyScreenProps {
  onClose: () => void;
}

export const ReceiveMoneyScreen: React.FC<ReceiveMoneyScreenProps> = ({ onClose }) => {
  const { user, bankAccounts, audioEnabled } = useApp();
  const [copied, setCopied] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showAmountInput, setShowAmountInput] = useState<boolean>(false);

  const primaryBank = bankAccounts.find(b => b.isDefault) || bankAccounts[0];

  const handleCopyUpi = () => {
    playSuccessSound(audioEnabled);
    navigator.clipboard.writeText(user.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    playTapSound(audioEnabled);
    const textToShare = customAmount
      ? `Pay $${customAmount} to ${user.name} via AI Pay: ${user.upiId}`
      : `Pay ${user.name} via AI Pay: ${user.upiId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Pay Payment Request',
          text: textToShare,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyUpi();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-base font-bold tracking-tight">Receive Money</h2>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-slate-400 hover:text-white"
        >
          Done
        </button>
      </div>

      {/* Main QR Card */}
      <div className="flex-1 p-5 flex flex-col items-center justify-center max-w-sm mx-auto w-full space-y-4">
        <div className="w-full bg-white text-slate-900 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden border border-slate-100">
          {/* Subtle top brand band */}
          <div className="w-full pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                AI
              </div>
              <span className="text-xs font-extrabold text-slate-900">AI Pay</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              UPI Accepted Here
            </span>
          </div>

          {/* User profile inside card */}
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {user.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {user.phone}
              </p>
            </div>
          </div>

          {/* Dynamic QR Code Render */}
          <div className="relative p-3 bg-white rounded-2xl border-2 border-slate-900/10 shadow-inner mb-3">
            {/* SVG Generative QR Matrix */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Corner position markers */}
              <rect x="5" y="5" width="24" height="24" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="13" y="13" width="8" height="8" rx="1" fill="#4f46e5" />

              <rect x="71" y="5" width="24" height="24" rx="4" fill="#0f172a" />
              <rect x="75" y="9" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="79" y="13" width="8" height="8" rx="1" fill="#4f46e5" />

              <rect x="5" y="71" width="24" height="24" rx="4" fill="#0f172a" />
              <rect x="9" y="75" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="13" y="79" width="8" height="8" rx="1" fill="#4f46e5" />

              {/* Data matrix dots */}
              <circle cx="38" cy="12" r="3" fill="#0f172a" />
              <circle cx="50" cy="12" r="3" fill="#0f172a" />
              <circle cx="62" cy="12" r="3" fill="#0f172a" />

              <circle cx="38" cy="24" r="3" fill="#0f172a" />
              <circle cx="50" cy="24" r="3" fill="#0f172a" />
              <circle cx="62" cy="24" r="3" fill="#0f172a" />

              <circle cx="12" cy="38" r="3" fill="#0f172a" />
              <circle cx="24" cy="38" r="3" fill="#0f172a" />
              <circle cx="38" cy="38" r="3" fill="#0f172a" />
              <circle cx="62" cy="38" r="3" fill="#0f172a" />
              <circle cx="76" cy="38" r="3" fill="#0f172a" />
              <circle cx="88" cy="38" r="3" fill="#0f172a" />

              <circle cx="12" cy="50" r="3" fill="#0f172a" />
              <circle cx="24" cy="50" r="3" fill="#0f172a" />
              <circle cx="76" cy="50" r="3" fill="#0f172a" />
              <circle cx="88" cy="50" r="3" fill="#0f172a" />

              <circle cx="12" cy="62" r="3" fill="#0f172a" />
              <circle cx="24" cy="62" r="3" fill="#0f172a" />
              <circle cx="38" cy="62" r="3" fill="#0f172a" />
              <circle cx="62" cy="62" r="3" fill="#0f172a" />
              <circle cx="76" cy="62" r="3" fill="#0f172a" />
              <circle cx="88" cy="62" r="3" fill="#0f172a" />

              <circle cx="38" cy="76" r="3" fill="#0f172a" />
              <circle cx="50" cy="76" r="3" fill="#0f172a" />
              <circle cx="62" cy="76" r="3" fill="#0f172a" />

              <circle cx="38" cy="88" r="3" fill="#0f172a" />
              <circle cx="50" cy="88" r="3" fill="#0f172a" />
              <circle cx="62" cy="88" r="3" fill="#0f172a" />

              {/* Center AI Pay Badge */}
              <circle cx="50" cy="50" r="11" fill="#4f46e5" />
              <text x="50" y="54" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">AI</text>
            </svg>
          </div>

          {customAmount && (
            <div className="mb-2 py-1 px-3 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-extrabold text-xs">
              Requesting ${parseFloat(customAmount).toFixed(2)}
            </div>
          )}

          {/* Copy UPI Section */}
          <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                Your Payment ID
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {user.upiId}
              </span>
            </div>

            <button
              onClick={handleCopyUpi}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              title="Copy Payment ID"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Set Specific Amount Toggle */}
        <div className="w-full">
          {showAmountInput ? (
            <div className="flex gap-2">
              <div className="flex-1 flex items-center px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl">
                <span className="text-sm text-slate-400 mr-1">$</span>
                <input
                  type="number"
                  placeholder="Enter amount to request"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setShowAmountInput(false)}
                className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Set
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playTapSound(audioEnabled);
                setShowAmountInput(true);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
              <span>{customAmount ? `Change Requested Amount ($${customAmount})` : 'Set Custom Request Amount'}</span>
            </button>
          )}
        </div>

        {/* Credit Bank Info */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Credits directly into:</span>
          </div>
          <span className="font-semibold text-white">
            {primaryBank.bankName} {primaryBank.accountNumber}
          </span>
        </div>
      </div>

      {/* Bottom Share Buttons */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
        >
          <Share2 className="w-4 h-4" />
          <span>Share QR Code</span>
        </button>

        <button
          onClick={handleCopyUpi}
          className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy ID'}</span>
        </button>
      </div>
    </div>
  );
};
