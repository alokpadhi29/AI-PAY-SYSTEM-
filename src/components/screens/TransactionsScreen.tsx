import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType } from '../../types';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Receipt, 
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

export const TransactionsScreen: React.FC = () => {
  const { transactions, viewReceipt, audioEnabled } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'received' | 'bill' | 'failed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Food', 'Shopping', 'Travel', 'Bills', 'Entertainment', 'Transfer', 'Income'];

  // Filter transactions
  const filtered = useMemo(() => {
    return transactions.filter((txn) => {
      // Search
      const matchesSearch =
        txn.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.recipientUpi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.note && txn.note.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Status/Type filter
      if (activeFilter === 'sent' && (txn.type !== 'sent')) return false;
      if (activeFilter === 'received' && (txn.type !== 'received' && txn.type !== 'refund')) return false;
      if (activeFilter === 'bill' && (txn.type !== 'bill' && txn.type !== 'recharge')) return false;
      if (activeFilter === 'failed' && txn.status !== 'failed') return false;

      // Category filter
      if (selectedCategory !== 'all' && txn.category !== selectedCategory) return false;

      return true;
    });
  }, [transactions, searchQuery, activeFilter, selectedCategory]);

  // Aggregate stats
  const totalSent = useMemo(() => {
    return transactions
      .filter(t => (t.type === 'sent' || t.type === 'bill' || t.type === 'recharge') && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalReceived = useMemo(() => {
    return transactions
      .filter(t => (t.type === 'received' || t.type === 'refund' || t.category === 'Income') && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const handleExportCSV = () => {
    playTapSound(audioEnabled);
    const headers = 'ID,Type,Recipient,Sender,Amount,Status,Date,Category,Reference\n';
    const rows = filtered.map(t => 
      `"${t.id}","${t.type}","${t.recipientName}","${t.senderName}","${t.amount}","${t.status}","${t.timestamp}","${t.category}","${t.referenceId}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Pay_Statement_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="flex-1 px-4 py-4 space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Transaction Activity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time ledger with digital receipts
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Statement</span>
        </button>
      </div>

      {/* Aggregate Flow Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
            Total Spent Outflow
          </span>
          <span className="text-lg font-bold text-indigo-950 dark:text-indigo-200 tabular-nums">
            -${totalSent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
            Total Inflow
          </span>
          <span className="text-lg font-bold text-emerald-950 dark:text-emerald-200 tabular-nums">
            +${totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, note, or UTR..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl text-xs outline-none border border-transparent focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Primary Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'All' },
          { id: 'sent', label: 'Debited' },
          { id: 'received', label: 'Credited' },
          { id: 'bill', label: 'Bills' },
          { id: 'failed', label: 'Failed' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              playTapSound(audioEnabled);
              setActiveFilter(f.id as any);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === f.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap capitalize transition-colors ${
              selectedCategory === c
                ? 'bg-slate-800 text-cyan-300 dark:bg-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-2 pt-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Receipt className="w-10 h-10 mx-auto opacity-30 text-indigo-400" />
            <p className="text-xs font-semibold">No transactions match your search</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); setSelectedCategory('all'); }}
              className="text-xs text-indigo-600 dark:text-cyan-400 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((txn) => {
            const isIncoming = txn.type === 'received' || txn.type === 'refund';
            const isFailed = txn.status === 'failed';

            return (
              <div
                key={txn.id}
                onClick={() => viewReceipt(txn)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-400/40 transition-all cursor-pointer shadow-sm group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  {txn.recipientAvatar ? (
                    <img
                      src={txn.recipientAvatar}
                      alt={txn.recipientName}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isFailed
                        ? 'bg-red-500/10 text-red-500'
                        : isIncoming 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {isIncoming ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {isIncoming ? txn.senderName : txn.recipientName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {txn.timestamp} · {txn.category}
                    </p>
                    {txn.note && (
                      <p className="text-[10px] text-slate-400 italic truncate max-w-[170px]">
                        "{txn.note}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-extrabold tabular-nums ${
                    isFailed 
                      ? 'text-red-500 line-through' 
                      : isIncoming 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {isIncoming ? '+' : '-'}${txn.amount.toFixed(2)}
                  </span>
                  
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className={`text-[10px] font-semibold ${
                      isFailed ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {txn.status === 'success' ? 'Successful' : txn.status}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
