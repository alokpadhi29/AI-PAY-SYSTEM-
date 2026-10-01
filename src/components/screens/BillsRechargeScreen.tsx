import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { billProviders } from '../../data/mockData';
import { BillProvider } from '../../types';
import { 
  Smartphone, 
  Zap, 
  Wifi, 
  Tv, 
  Droplet, 
  Flame, 
  ArrowLeft, 
  CheckCircle2, 
  Building, 
  ChevronRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

export const BillsRechargeScreen: React.FC = () => {
  const { executePayment, bankAccounts, audioEnabled } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProvider, setActiveProvider] = useState<BillProvider | null>(null);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [billAmount, setBillAmount] = useState<string>('65');
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Services', icon: CreditCard },
    { id: 'mobile', label: 'Mobile Prepaid', icon: Smartphone },
    { id: 'electricity', label: 'Electricity', icon: Zap },
    { id: 'internet', label: 'Broadband', icon: Wifi },
    { id: 'water', label: 'Water Utility', icon: Droplet },
    { id: 'dth', label: 'Cable & DTH', icon: Tv },
    { id: 'gas', label: 'Piped Gas', icon: Flame },
  ];

  const filteredProviders = billProviders.filter(
    p => selectedCategory === 'all' || p.category === selectedCategory
  );

  const handleSelectProvider = (prov: BillProvider) => {
    playTapSound(audioEnabled);
    setActiveProvider(prov);
    if (prov.plans && prov.plans.length > 0) {
      setSelectedPlan(prov.plans[0]);
      setBillAmount(String(prov.plans[0].price));
    } else {
      setSelectedPlan(null);
      setBillAmount('85.50');
    }
  };

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProvider) return;
    setIsPaying(true);
    playTapSound(audioEnabled);

    setTimeout(() => {
      executePayment({
        recipientName: activeProvider.name,
        recipientUpi: `${activeProvider.id}@billpay`,
        amount: parseFloat(billAmount),
        note: `Bill Payment Ref: ${accountNumber || 'ACC-89104'}`,
        category: 'Bills',
      });
      setIsPaying(false);
      setActiveProvider(null);
      setAccountNumber('');
    }, 600);
  };

  return (
    <div className="flex-1 px-4 py-4 space-y-5 animate-in fade-in duration-300">
      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Bills & Recharges
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Fast, simulated payments with zero surcharge
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => { playTapSound(audioEnabled); setSelectedCategory(c.id); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Provider List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Available Biller Network
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {filteredProviders.map((prov) => (
            <div
              key={prov.id}
              onClick={() => handleSelectProvider(prov)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/50 cursor-pointer transition-all shadow-sm group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{prov.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    {prov.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 capitalize">
                    {prov.category} · Instant confirmation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-400">Pay</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Payment Bottom Sheet Modal */}
      {activeProvider && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeProvider.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeProvider.name}
                  </h3>
                  <span className="text-[10px] text-emerald-500 font-semibold">
                    ✓ Verified Biller
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveProvider(null)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePayBill} className="space-y-4">
              {/* Account / Phone input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {activeProvider.category === 'mobile' ? 'Mobile Number' : 'Consumer / Account ID'}
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={activeProvider.category === 'mobile' ? '(555) 000-0000' : 'e.g. PGE-8910481'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-indigo-500 font-mono text-slate-900 dark:text-white"
                />
              </div>

              {/* Plans selector (if available) */}
              {activeProvider.plans && activeProvider.plans.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Plan
                  </label>
                  <div className="space-y-2">
                    {activeProvider.plans.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPlan(p);
                          setBillAmount(String(p.price));
                        }}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          selectedPlan?.id === p.id
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-slate-900 dark:text-white'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold">{p.name}</span>
                          <span className="font-extrabold text-indigo-600 dark:text-cyan-400">${p.price}</span>
                        </div>
                        <p className="text-[10px] mt-0.5 opacity-80">{p.details} · {p.validity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Amount to Pay ($)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-lg font-bold outline-none border border-slate-200 dark:border-slate-700 focus:border-indigo-500 font-display text-slate-900 dark:text-white"
                />
              </div>

              {/* Bank Source Strip */}
              <div className="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Debit from:</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {bankAccounts[0].bankName} {bankAccounts[0].accountNumber}
                </span>
              </div>

              <button
                type="submit"
                disabled={isPaying || !billAmount}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isPaying ? 'Processing Biller Payment...' : `Confirm & Pay $${billAmount}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
