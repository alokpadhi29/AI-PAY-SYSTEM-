import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, HandCoins, Check, Share2, Copy } from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface RequestMoneyModalProps {
  onClose: () => void;
}

export const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({ onClose }) => {
  const { contacts, user, audioEnabled } = useApp();
  const [selectedContact, setSelectedContact] = useState<string>(contacts[0].id);
  const [amount, setAmount] = useState<string>('35');
  const [note, setNote] = useState<string>('Dinner & Drinks split 🍕');
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const targetContact = contacts.find(c => c.id === selectedContact) || contacts[0];

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound(audioEnabled);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HandCoins className="w-4 h-4 text-amber-500" />
            <span>Request Money / Split</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Payment Request Sent!
            </h4>
            <p className="text-xs text-slate-500">
              Notified {targetContact.name} for ${amount} via instant push link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Request From
              </label>
              <select
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.upiId})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Amount to Request ($)
              </label>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xl font-bold outline-none text-slate-900 dark:text-white font-display border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Note for Split
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What was this for?"
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              Send Request for ${amount}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
