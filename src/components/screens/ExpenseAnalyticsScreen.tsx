import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PiggyBank, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  Film,
  HeartPulse,
  Flame
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

export const ExpenseAnalyticsScreen: React.FC = () => {
  const { setActiveTab, audioEnabled } = useApp();
  const [timeframe, setTimeframe] = useState<'this-month' | 'last-month' | 'ytd'>('this-month');

  const categories = [
    { name: 'Food & Dining', amount: 680.50, percentage: 28, color: 'bg-amber-500', icon: Utensils },
    { name: 'Shopping & Gear', amount: 540.20, percentage: 22, color: 'bg-indigo-500', icon: ShoppingBag },
    { name: 'Bills & Utilities', amount: 420.00, percentage: 17, color: 'bg-cyan-500', icon: Zap },
    { name: 'Travel & Commute', amount: 310.00, percentage: 13, color: 'bg-blue-500', icon: Car },
    { name: 'Entertainment', amount: 210.00, percentage: 9, color: 'bg-purple-500', icon: Film },
    { name: 'Health & Wellness', amount: 120.00, percentage: 5, color: 'bg-emerald-500', icon: HeartPulse },
    { name: 'Other', amount: 159.60, percentage: 6, color: 'bg-slate-400', icon: Sparkles },
  ];

  const weeklySpending = [
    { label: 'W1', amount: 610, height: '65%' },
    { label: 'W2', amount: 780, height: '85%' },
    { label: 'W3', amount: 490, height: '52%' },
    { label: 'W4 (Current)', amount: 570, height: '60%', isCurrent: true },
  ];

  return (
    <div className="flex-1 px-4 py-4 space-y-5 animate-in fade-in duration-300">
      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Expense Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cashflow distribution & insights
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { playTapSound(audioEnabled); setTimeframe('this-month'); }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              timeframe === 'this-month' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            October
          </button>
          <button
            onClick={() => { playTapSound(audioEnabled); setTimeframe('last-month'); }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              timeframe === 'last-month' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sep
          </button>
        </div>
      </div>

      {/* Primary 4-Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
            <span>Monthly Expenses</span>
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            $2,450.30
          </span>
          <span className="text-[10px] text-emerald-500 font-semibold">
            ↓ 4.2% lower than September
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
            <span>Monthly Income</span>
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            $6,500.00
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            Salary + Freelance
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
          <span className="text-[11px] font-medium text-indigo-600 dark:text-cyan-400 flex items-center gap-1">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Net Savings Pool</span>
          </span>
          <span className="text-2xl font-extrabold text-indigo-950 dark:text-indigo-200 mt-1 block">
            $4,049.70
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-cyan-400 font-bold">
            62% Savings Rate 🚀
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Burn Rate</span>
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            $79.04
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            Target: $95.00/day
          </span>
        </div>
      </div>

      {/* Weekly Burn Bar Chart */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            Weekly Outflow Trend
          </h3>
          <span className="text-[10px] text-slate-400">Peak: Week 2 ($780)</span>
        </div>

        {/* Bar chart container */}
        <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100 dark:border-slate-700">
          {weeklySpending.map((w, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                ${w.amount}
              </span>
              <div
                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ${
                  w.isCurrent
                    ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-indigo-500/30 dark:bg-indigo-900/50 hover:bg-indigo-500/50'
                }`}
                style={{ height: w.height }}
              />
              <span className="text-[10px] font-semibold text-slate-500 mt-1">
                {w.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            Spending by Category
          </h3>
          <span className="text-[10px] text-slate-400">Top: Food (28%)</span>
        </div>

        <div className="space-y-3">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">${cat.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 w-7 text-right">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biggest Expense Spotlight */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            Biggest Expense of the Month
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Apple Store NY ($129.99)
          </h4>
          <p className="text-[11px] text-slate-300">
            Tech accessories · Sep 28
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ai')}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};
