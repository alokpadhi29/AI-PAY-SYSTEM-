import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ScanLine, 
  HandCoins, 
  Eye, 
  EyeOff, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Smartphone, 
  Zap, 
  Wifi, 
  Tv, 
  Droplet, 
  Grid, 
  ShieldCheck,
  Send,
  Building,
  UserPlus
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

export const HomeScreen: React.FC = () => {
  const { 
    user, 
    bankAccounts, 
    contacts, 
    transactions, 
    openModal, 
    setActiveTab, 
    audioEnabled,
    viewReceipt 
  } = useApp();

  const [showBalance, setShowBalance] = useState<boolean>(true);

  // Calculate dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const primaryBank = bankAccounts.find(b => b.isDefault) || bankAccounts[0];
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="flex-1 px-4 py-4 space-y-5 animate-in fade-in duration-300">
      {/* User Greeting & Header Profile Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('profile')}
            className="relative cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-500 transition-all shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{getGreeting()}</span>
              <span>·</span>
              <span className="text-emerald-500 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {user.name}
            </h2>
          </div>
        </div>

        <button
          onClick={() => openModal('receive')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <span className="text-indigo-600 dark:text-cyan-400">QR</span>
          <span>My Code</span>
        </button>
      </div>

      {/* Hero Financial Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-950 text-white p-5 shadow-xl border border-indigo-500/20">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-indigo-200 tracking-wider uppercase flex items-center gap-1.5">
              Available Balance
              <button
                onClick={() => {
                  playTapSound(audioEnabled);
                  setShowBalance(!showBalance);
                }}
                className="text-indigo-300 hover:text-white transition-colors"
                aria-label="Toggle balance visibility"
              >
                {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </span>

            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-cyan-300 font-semibold border border-indigo-400/20">
              UPI: {user.upiId}
            </span>
          </div>

          {/* Amount Display */}
          <div className="mb-4">
            <span className="text-3xl font-extrabold tracking-tight font-display text-white">
              {showBalance ? `$${user.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
            </span>
            <div className="flex items-center gap-2 mt-1 text-xs text-indigo-200">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>{primaryBank.bankName}</span>
              <span className="opacity-60">{primaryBank.accountNumber}</span>
            </div>
          </div>

          {/* Card bottom quick links */}
          <div className="flex items-center gap-2 pt-3 border-t border-indigo-700/50">
            <button
              onClick={() => openModal('add-money')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all border border-white/10"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Cash</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all border border-white/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => openModal('receive')}
              className="ml-auto text-xs text-cyan-300 hover:text-white font-medium flex items-center gap-0.5"
            >
              <span>Bank Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Action Buttons */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Send */}
        <button
          onClick={() => openModal('send')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/50 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-inner">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            Send
          </span>
          <span className="text-[10px] text-slate-400">To Anyone</span>
        </button>

        {/* Scan & Pay */}
        <button
          onClick={() => openModal('scan')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-cyan-500/10 dark:from-indigo-950/80 dark:to-cyan-950/60 border border-indigo-500/30 dark:border-cyan-500/30 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-md shadow-indigo-500/20">
            <ScanLine className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 tracking-tight">
            Scan QR
          </span>
          <span className="text-[10px] text-slate-400">Merchant/UPI</span>
        </button>

        {/* Receive */}
        <button
          onClick={() => openModal('receive')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-400/50 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-inner">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            Receive
          </span>
          <span className="text-[10px] text-slate-400">Self QR</span>
        </button>

        {/* Request */}
        <button
          onClick={() => openModal('request')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-inner">
            <HandCoins className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            Request
          </span>
          <span className="text-[10px] text-slate-400">Collect split</span>
        </button>
      </div>

      {/* AI Financial Intelligence Spotlight */}
      <div 
        onClick={() => setActiveTab('ai')}
        className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white cursor-pointer hover:border-indigo-400/60 transition-all shadow-md group relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none" />
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                AI Pay AI
              </span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-medium">
                Live Insights
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-snug font-medium">
              "You spent $129.99 on tech this week. You have <strong className="text-emerald-400">$4,049.70</strong> projected savings remaining. Tap to optimize your budget."
            </p>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all self-center" />
        </div>
      </div>

      {/* Quick Pay Contacts Row */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Send Again
          </h3>
          <button
            onClick={() => openModal('send')}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
          >
            All Contacts
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {/* Add Contact Shortcut */}
          <button
            onClick={() => openModal('add-contact')}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-500 transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Add</span>
          </button>

          {/* Contact Avatars */}
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                openModal('send', {
                  recipientName: contact.name,
                  recipientUpi: contact.upiId,
                  recipientAvatar: contact.avatar,
                  amount: contact.recentAmount || 25,
                });
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform"
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all shadow-sm"
                />
                {contact.isFavorite && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-[10px] text-slate-950 font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                    ★
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[62px] truncate text-center">
                {contact.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bills & Recharges Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Bills & Recharges
          </h3>
          <button
            onClick={() => setActiveTab('payments')}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/80">
          <button
            onClick={() => openModal('bill-pay', { category: 'mobile' })}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-center">
              Recharge
            </span>
          </button>

          <button
            onClick={() => openModal('bill-pay', { category: 'electricity' })}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-center">
              Electricity
            </span>
          </button>

          <button
            onClick={() => openModal('bill-pay', { category: 'internet' })}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Wifi className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-center">
              Broadband
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-center">
              More Bills
            </span>
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Transactions
          </h3>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
          >
            <span>History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((txn) => {
            const isIncoming = txn.type === 'received' || txn.type === 'refund';
            return (
              <div
                key={txn.id}
                onClick={() => viewReceipt(txn)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  {txn.recipientAvatar ? (
                    <img
                      src={txn.recipientAvatar}
                      alt={txn.recipientName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                      isIncoming 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {isIncoming ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                      {isIncoming ? txn.senderName : txn.recipientName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {txn.timestamp} · {txn.category}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold tabular-nums ${
                    isIncoming ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {isIncoming ? '+' : '-'}${txn.amount.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {txn.status === 'success' ? 'Successful' : txn.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
