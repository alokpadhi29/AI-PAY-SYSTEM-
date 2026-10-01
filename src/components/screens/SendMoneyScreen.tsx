import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, ExpenseCategory } from '../../types';
import { 
  ArrowLeft, 
  Search, 
  Check, 
  ShieldCheck, 
  Building, 
  Sparkles,
  Delete,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playTapSound, playErrorSound } from '../../utils/audio';

interface SendMoneyScreenProps {
  onClose: () => void;
  initialRecipient?: {
    recipientName: string;
    recipientUpi: string;
    recipientAvatar?: string;
    amount?: number;
    note?: string;
  };
}

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({ onClose, initialRecipient }) => {
  const { 
    contacts, 
    bankAccounts, 
    user, 
    executePayment, 
    audioEnabled 
  } = useApp();

  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm' | 'pin'> (
    initialRecipient ? 'amount' : 'recipient'
  );

  const [selectedRecipient, setSelectedRecipient] = useState<{
    name: string;
    upiId: string;
    avatar?: string;
  }>(
    initialRecipient
      ? {
          name: initialRecipient.recipientName,
          upiId: initialRecipient.recipientUpi,
          avatar: initialRecipient.recipientAvatar,
        }
      : {
          name: contacts[0].name,
          upiId: contacts[0].upiId,
          avatar: contacts[0].avatar,
        }
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [amount, setAmount] = useState<string>(initialRecipient?.amount ? String(initialRecipient.amount) : '');
  const [note, setNote] = useState<string>(initialRecipient?.note || '');
  const [category, setCategory] = useState<ExpenseCategory>('Transfer');
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [pinError, setPinError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const primaryBank = bankAccounts.find(b => b.isDefault) || bankAccounts[0];

  const quickAmounts = [10, 25, 50, 100, 250];
  const categories: ExpenseCategory[] = ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment', 'Transfer'];

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.upiId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleSelectContact = (c: Contact) => {
    playTapSound(audioEnabled);
    setSelectedRecipient({
      name: c.name,
      upiId: c.upiId,
      avatar: c.avatar,
    });
    setStep('amount');
  };

  const handleCustomRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    playTapSound(audioEnabled);
    setSelectedRecipient({
      name: searchQuery.includes('@') ? searchQuery.split('@')[0] : searchQuery,
      upiId: searchQuery.includes('@') ? searchQuery : `${searchQuery.toLowerCase()}@aipay`,
    });
    setStep('amount');
  };

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    if (num > user.walletBalance) {
      alert(`Insufficient funds! Your balance is $${user.walletBalance.toFixed(2)}`);
      return;
    }
    playTapSound(audioEnabled);
    setStep('confirm');
  };

  const handlePinKeyPress = (digit: string) => {
    playTapSound(audioEnabled);
    setPinError('');
    if (pinDigits.length < 4) {
      const nextDigits = [...pinDigits, digit];
      setPinDigits(nextDigits);

      if (nextDigits.length === 4) {
        // Automatically verify
        verifyAndSubmit(nextDigits.join(''));
      }
    }
  };

  const handlePinBackspace = () => {
    playTapSound(audioEnabled);
    setPinError('');
    setPinDigits(prev => prev.slice(0, -1));
  };

  const verifyAndSubmit = (enteredPin: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      // Compare with user.pin (or accept '2468' or user's custom PIN)
      if (enteredPin === user.pin || enteredPin === '2468' || enteredPin === '1234') {
        executePayment({
          recipientName: selectedRecipient.name,
          recipientUpi: selectedRecipient.upiId,
          recipientAvatar: selectedRecipient.avatar,
          amount: parseFloat(amount),
          note: note.trim() || undefined,
          category,
          paymentMethod: `${primaryBank.bankName} (${primaryBank.accountNumber})`,
        });
        setIsProcessing(false);
        onClose();
      } else {
        setIsProcessing(false);
        setPinDigits([]);
        setPinError('Incorrect 4-digit PIN. Try demo PIN 2468');
        playErrorSound(audioEnabled);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-200">
      {/* Top Header */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (step === 'pin') setStep('confirm');
              else if (step === 'confirm') setStep('amount');
              else if (step === 'amount' && !initialRecipient) setStep('recipient');
              else onClose();
            }}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold tracking-tight">
            {step === 'recipient' && 'Send Money'}
            {step === 'amount' && 'Enter Amount'}
            {step === 'confirm' && 'Confirm Payment'}
            {step === 'pin' && 'Enter AI Pay PIN'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* Step 1: Select Recipient */}
      {step === 'recipient' && (
        <div className="flex-1 p-4 space-y-4">
          <form onSubmit={handleCustomRecipient} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, or enter UPI ID..."
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800/90 rounded-2xl text-xs md:text-sm outline-none border border-transparent focus:border-indigo-500 transition-all placeholder:text-slate-500"
            />
          </form>

          {searchQuery && (
            <button
              onClick={handleCustomRecipient}
              className="w-full p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-cyan-400 text-xs font-bold text-left flex items-center justify-between"
            >
              <span>Pay directly to "{searchQuery}"</span>
              <span>→</span>
            </button>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Saved Contacts & Payees
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectContact(c)}
                  className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-11 h-11 rounded-full object-cover shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {c.upiId} · {c.phone}
                      </p>
                    </div>
                  </div>
                  {c.recentAmount && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Last: ${c.recentAmount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Amount & Note */}
      {step === 'amount' && (
        <form onSubmit={handleAmountSubmit} className="flex-1 p-5 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Recipient summary card */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              {selectedRecipient.avatar ? (
                <img
                  src={selectedRecipient.avatar}
                  alt={selectedRecipient.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-black text-base flex items-center justify-center">
                  {selectedRecipient.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Paying {selectedRecipient.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedRecipient.upiId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep('recipient')}
                className="text-xs text-indigo-600 dark:text-cyan-400 font-semibold"
              >
                Change
              </button>
            </div>

            {/* Giant Amount Input */}
            <div className="text-center py-4">
              <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block mb-1">
                Amount
              </span>
              <div className="inline-flex items-center justify-center font-display">
                <span className="text-3xl text-slate-400 font-semibold mr-1">$</span>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-48 text-center text-4xl font-extrabold bg-transparent outline-none text-slate-900 dark:text-white tracking-tight"
                  required
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Available Balance: <strong className="text-emerald-500">${user.walletBalance.toFixed(2)}</strong>
              </p>
            </div>

            {/* Quick Amount Suggestion Chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    playTapSound(audioEnabled);
                    setAmount(String(q));
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  +${q}
                </button>
              ))}
            </div>

            {/* Note & Category */}
            <div className="space-y-3 pt-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (e.g. Dinner, Rent split, Gift)"
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs md:text-sm outline-none border border-transparent focus:border-indigo-500 transition-all placeholder:text-slate-500"
              />

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Category Tag
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium shrink-0 transition-colors ${
                        category === cat
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            Proceed to Pay ${amount || '0'}
          </button>
        </form>
      )}

      {/* Step 3: Payment Confirmation Review */}
      {step === 'confirm' && (
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="text-center py-2">
              <span className="text-xs text-slate-500 font-medium">Transfer Amount</span>
              <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                ${parseFloat(amount).toFixed(2)}
              </h3>
              <p className="text-xs text-emerald-500 font-semibold mt-1">
                ✓ AI Pay Instant Settlement · Zero Transfer Fee
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">To</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {selectedRecipient.name} ({selectedRecipient.upiId})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">From Bank Account</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  {primaryBank.bankName} {primaryBank.accountNumber}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Transfer Type</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Real-time Fast Rail
                </span>
              </div>

              {note && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Note</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 italic">
                    "{note}"
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-900 dark:text-indigo-200">
                You will authorize this payment using your secure 4-digit UPI PIN. Never share your PIN with anyone.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound(audioEnabled);
              setStep('pin');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
          >
            Authorize with PIN
          </button>
        </div>
      )}

      {/* Step 4: Secure PIN Pad */}
      {step === 'pin' && (
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="text-center space-y-3 pt-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Enter 4-Digit Security PIN
            </h3>
            <p className="text-xs text-slate-500">
              Authorizing payment of <strong className="text-slate-900 dark:text-white">${parseFloat(amount).toFixed(2)}</strong> to {selectedRecipient.name}
            </p>

            {/* PIN Dots Display */}
            <div className="flex justify-center gap-4 py-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    pinDigits.length > idx
                      ? 'bg-indigo-600 dark:bg-cyan-400 scale-110 shadow-sm'
                      : 'border-2 border-slate-300 dark:border-slate-700'
                  }`}
                />
              ))}
            </div>

            {pinError ? (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold animate-shake">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pinError}</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Demo default PIN: <span className="font-bold text-indigo-500">2468</span> or <span className="font-bold text-indigo-500">1234</span>
              </p>
            )}

            {isProcessing && (
              <div className="py-2 flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-cyan-400 font-semibold">
                <div className="w-4 h-4 border-2 border-indigo-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Encrypting & Securing Payment...</span>
              </div>
            )}
          </div>

          {/* Keypad 0-9 */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full pb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handlePinKeyPress(digit)}
                disabled={isProcessing}
                className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center active:scale-95 transition-all shadow-sm"
              >
                {digit}
              </button>
            ))}

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setPinDigits(['2', '4', '6', '8']);
                  verifyAndSubmit('2468');
                }}
                className="text-[10px] text-indigo-600 dark:text-cyan-400 font-bold uppercase tracking-wider"
              >
                Autofill
              </button>
            </div>

            <button
              type="button"
              onClick={() => handlePinKeyPress('0')}
              disabled={isProcessing}
              className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center active:scale-95 transition-all shadow-sm"
            >
              0
            </button>

            <button
              type="button"
              onClick={handlePinBackspace}
              disabled={isProcessing || pinDigits.length === 0}
              className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center active:scale-95 transition-all shadow-sm disabled:opacity-40"
              aria-label="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
