import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, DollarSign, Building, CheckCircle2 } from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface AddMoneyModalProps {
  onClose: () => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ onClose }) => {
  const { addMoneyToAccount, bankAccounts, audioEnabled } = useApp();
  const [amount, setAmount] = useState<string>('250');
  const [selectedBank, setSelectedBank] = useState<string>(bankAccounts[0].id);

  const presets = [50, 100, 250, 500, 1000];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    addMoneyToAccount(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Money to AI Pay</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="text-center py-2">
            <label className="text-xs text-slate-500 font-semibold block mb-1">
              Top-up Amount
            </label>
            <div className="inline-flex items-center justify-center">
              <span className="text-3xl text-slate-400 font-bold mr-1">$</span>
              <input
                type="number"
                step="any"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-44 text-center text-4xl font-extrabold bg-transparent outline-none text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { playTapSound(audioEnabled); setAmount(String(p)); }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                +${p}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Debit Source
            </label>
            <div className="space-y-1.5">
              {bankAccounts.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBank(b.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedBank === b.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h4 className="text-xs font-bold">{b.bankName}</h4>
                      <p className="text-[10px] text-slate-400">{b.accountNumber}</p>
                    </div>
                  </div>
                  {selectedBank === b.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
          >
            Confirm Top-up of ${amount || '0'}
          </button>
        </form>
      </div>
    </div>
  );
};
