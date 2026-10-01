import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { 
  CheckCircle2, 
  X, 
  Share2, 
  Download, 
  RotateCcw, 
  AlertCircle, 
  Building, 
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface ReceiptModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const { openModal, audioEnabled } = useApp();
  const [copiedUtr, setCopiedUtr] = useState<boolean>(false);
  const [showDispute, setShowDispute] = useState<boolean>(false);

  const isIncoming = transaction.type === 'received' || transaction.type === 'refund';

  const handleCopyUtr = () => {
    playTapSound(audioEnabled);
    navigator.clipboard.writeText(transaction.referenceId);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleRepeatPayment = () => {
    onClose();
    openModal('send', {
      recipientName: transaction.recipientName,
      recipientUpi: transaction.recipientUpi,
      recipientAvatar: transaction.recipientAvatar,
      amount: transaction.amount,
      note: transaction.note,
    });
  };

  const handleShareReceipt = async () => {
    playTapSound(audioEnabled);
    const receiptText = `AI Pay Digital Receipt\nAmount: $${transaction.amount.toFixed(2)}\nStatus: ${transaction.status.toUpperCase()}\nTo: ${transaction.recipientName} (${transaction.recipientUpi})\nUTR: ${transaction.referenceId}\nDate: ${transaction.timestamp}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Pay Receipt',
          text: receiptText,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(receiptText);
      alert('Receipt details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              AI
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Transaction Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status Badge & Checkmark */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {transaction.status === 'success' ? 'Payment Successful' : transaction.status.toUpperCase()}
            </span>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
              ${transaction.amount.toFixed(2)}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {transaction.timestamp}
            </p>
          </div>

          {/* Receipt Details Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-start justify-between text-xs">
              <span className="text-slate-500">{isIncoming ? 'Received From' : 'Sent To'}</span>
              <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isIncoming ? transaction.senderName : transaction.recipientName}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {transaction.recipientUpi}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Category</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {transaction.category}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Payment Channel</span>
              <span className="font-medium text-slate-900 dark:text-white text-right">
                {transaction.paymentMethod}
              </span>
            </div>

            {transaction.note && (
              <div className="flex items-start justify-between text-xs">
                <span className="text-slate-500">Note</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-right max-w-[200px] italic">
                  "{transaction.note}"
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-500">UTR Reference No.</span>
              <button
                onClick={handleCopyUtr}
                className="font-mono text-indigo-600 dark:text-cyan-400 font-bold flex items-center gap-1 hover:underline"
                title="Copy reference number"
              >
                <span>{transaction.referenceId}</span>
                {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Simulated instant settlement on AI Pay Faster Payments Network.</span>
          </div>

          {showDispute && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <p className="font-bold">Need Help with this Payment?</p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Ticket created for Ref #{transaction.referenceId}. 24/7 AI Resolution desk has verified the simulated transaction status as final.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          {!isIncoming && (
            <button
              onClick={handleRepeatPayment}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-indigo-600/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat Pay</span>
            </button>
          )}

          <button
            onClick={handleShareReceipt}
            className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setShowDispute(!showDispute)}
            className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors"
            title="Help & Support"
          >
            <AlertCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
