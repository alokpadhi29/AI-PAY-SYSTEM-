import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ScanLine, 
  HandCoins, 
  Building, 
  Smartphone, 
  Zap, 
  Wifi, 
  Tv, 
  Droplet, 
  Flame, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

export const PaymentsHubScreen: React.FC = () => {
  const { openModal, setActiveTab, bankAccounts, audioEnabled } = useApp();
  const primaryBank = bankAccounts.find(b => b.isDefault) || bankAccounts[0];

  return (
    <div className="flex-1 px-4 py-4 space-y-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Payments Hub
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Transfer money, scan QR, and clear bills instantly
        </p>
      </div>

      {/* Main Payment Actions 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => openModal('send')}
          className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 dark:from-indigo-950/60 dark:to-slate-800/60 border border-indigo-200 dark:border-indigo-800/80 flex flex-col justify-between text-left group hover:border-indigo-400 transition-all active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Send Money
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              To contact, mobile, or UPI ID
            </p>
          </div>
        </button>

        <button
          onClick={() => openModal('scan')}
          className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 dark:from-cyan-950/60 dark:to-slate-800/60 border border-cyan-200 dark:border-cyan-800/80 flex flex-col justify-between text-left group hover:border-cyan-400 transition-all active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center mb-3 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Scan & Pay
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Scan QR code at any store
            </p>
          </div>
        </button>

        <button
          onClick={() => openModal('receive')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between text-left group hover:border-slate-400 transition-all active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Receive Money
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Display or share personal QR
            </p>
          </div>
        </button>

        <button
          onClick={() => openModal('request')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between text-left group hover:border-slate-400 transition-all active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <HandCoins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Request Split
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Collect dues from friends
            </p>
          </div>
        </button>
      </div>

      {/* Linked Bank Status Row */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {primaryBank.bankName}
            </h4>
            <p className="text-[10px] text-slate-500">
              Active primary debit account {primaryBank.accountNumber}
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('add-money')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
        >
          Add Cash
        </button>
      </div>

      {/* Quick Utilities List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Recharge & Pay Bills
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-blue-500' },
            { id: 'electricity', label: 'Electricity', icon: Zap, color: 'text-amber-500' },
            { id: 'internet', label: 'Broadband', icon: Wifi, color: 'text-purple-500' },
            { id: 'water', label: 'Water', icon: Droplet, color: 'text-cyan-500' },
            { id: 'dth', label: 'DTH TV', icon: Tv, color: 'text-red-500' },
            { id: 'gas', label: 'Piped Gas', icon: Flame, color: 'text-orange-500' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => openModal('bill-pay', { category: item.id })}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 hover:border-indigo-400/50 transition-all active:scale-95 group shadow-sm"
              >
                <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
