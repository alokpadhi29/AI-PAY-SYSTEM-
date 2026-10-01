import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Check } from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface AddContactModalProps {
  onClose: () => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ onClose }) => {
  const { addContact, audioEnabled } = useApp();
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('+1 (555) ');
  const [upiId, setUpiId] = useState<string>('');

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  ];
  const [selectedAvatar, setSelectedAvatar] = useState<string>(sampleAvatars[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addContact({
      name: name.trim(),
      phone: phone.trim(),
      upiId: upiId.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@aipay`,
      avatar: selectedAvatar,
      isFavorite: true,
      recentAmount: 20,
    });

    playSuccessSound(audioEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-500" />
            <span>Add New Contact</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Avatar selector */}
          <div className="flex items-center justify-center gap-3 py-1">
            {sampleAvatars.map((av, idx) => (
              <img
                key={idx}
                src={av}
                alt="avatar preview"
                onClick={() => { playTapSound(audioEnabled); setSelectedAvatar(av); }}
                className={`w-12 h-12 rounded-full object-cover cursor-pointer transition-all ${
                  selectedAvatar === av
                    ? 'ring-4 ring-indigo-500 scale-105 shadow-md'
                    : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!upiId) {
                  setUpiId(`${e.target.value.toLowerCase().replace(/\s+/g, '')}@aipay`);
                }
              }}
              placeholder="e.g. Jordan Smith"
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">UPI / Payment ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="jordansmith@aipay"
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all"
          >
            Save Contact
          </button>
        </form>
      </div>
    </div>
  );
};
