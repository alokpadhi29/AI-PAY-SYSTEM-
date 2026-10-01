import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Sliders, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

export const AIBudgetPlannerScreen: React.FC = () => {
  const { audioEnabled, setActiveTab } = useApp();

  const [income, setIncome] = useState<string>('6500');
  const [fixedExpenses, setFixedExpenses] = useState<string>('2200');
  const [savingsGoal, setSavingsGoal] = useState<string>('1500');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Food & Dining',
    'Shopping',
    'Entertainment',
    'Transport',
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [budgetResult, setBudgetResult] = useState<{
    planText: string;
    discretionary: number;
    savingsRate: number;
  } | null>(null);

  const allCategories = [
    'Food & Dining',
    'Shopping',
    'Entertainment',
    'Transport',
    'Health & Fitness',
    'Subscriptions',
  ];

  const toggleCategory = (cat: string) => {
    playTapSound(audioEnabled);
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const handleGenerateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    playTapSound(audioEnabled);

    try {
      const res = await fetch('/api/ai/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: parseFloat(income) || 5000,
          fixedExpenses: parseFloat(fixedExpenses) || 2000,
          savingsGoal: parseFloat(savingsGoal) || 1000,
          categories: selectedCategories,
        }),
      });

      const data = await res.json();
      playSuccessSound(audioEnabled);
      setBudgetResult({
        planText: data.planText,
        discretionary: data.discretionary,
        savingsRate: data.savingsRate,
      });
    } catch (err) {
      console.error(err);
      const inc = parseFloat(income) || 6500;
      const fixed = parseFloat(fixedExpenses) || 2200;
      const sav = parseFloat(savingsGoal) || 1500;
      const disc = Math.max(0, inc - fixed - sav);
      setBudgetResult({
        planText: `Based on your inputs:\n\n• **Needs (Fixed)**: $${fixed} (${Math.round((fixed / inc) * 100)}%)\n• **Savings**: $${sav} (${Math.round((sav / inc) * 100)}%)\n• **Lifestyle (Discretionary)**: $${disc} (${Math.round((disc / inc) * 100)}%)\n\nRecommended split:\n- **Food**: $${Math.round(disc * 0.45)}\n- **Shopping**: $${Math.round(disc * 0.30)}\n- **Transport**: $${Math.round(disc * 0.15)}\n- **Entertainment**: $${Math.round(disc * 0.10)}`,
        discretionary: disc,
        savingsRate: Math.round((sav / inc) * 100),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-4 space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>AI Budget Planner</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 font-bold">
            Gemini Powered
          </span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalized allocation & savings model
        </p>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleGenerateBudget} className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Monthly Net Income ($)
          </label>
          <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <DollarSign className="w-4 h-4 text-slate-400 mr-1.5" />
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 6500"
              className="w-full bg-transparent text-sm font-semibold outline-none text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Fixed Costs ($)
            </label>
            <div className="flex items-center px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 mr-1">$</span>
              <input
                type="number"
                value={fixedExpenses}
                onChange={(e) => setFixedExpenses(e.target.value)}
                placeholder="2200"
                className="w-full bg-transparent text-xs font-semibold outline-none text-slate-900 dark:text-white"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400">Rent, Loans, Bills</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Savings Target ($)
            </label>
            <div className="flex items-center px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 mr-1">$</span>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                placeholder="1500"
                className="w-full bg-transparent text-xs font-semibold outline-none text-slate-900 dark:text-white"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400">Emergency & Investing</span>
          </div>
        </div>

        {/* Categories to optimize */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Active Spending Categories
          </label>
          <div className="flex flex-wrap gap-1.5">
            {allCategories.map((c) => {
              const selected = selectedCategories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c} {selected && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Budget Model...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Smart Budget</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Budget Result */}
      {budgetResult && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/40 text-white space-y-4 animate-in slide-in-from-bottom duration-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center">
                AI
              </div>
              <h3 className="text-sm font-bold text-white">Your Tailored Financial Plan</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {budgetResult.savingsRate}% Savings Rate
            </span>
          </div>

          {/* Allocation Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-indigo-300">Needs (${fixedExpenses})</span>
              <span className="text-emerald-300">Savings (${savingsGoal})</span>
              <span className="text-cyan-300">Lifestyle (${budgetResult.discretionary})</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-indigo-500 h-full" style={{ width: '34%' }} title="Needs (34%)" />
              <div className="bg-emerald-500 h-full" style={{ width: '23%' }} title="Savings (23%)" />
              <div className="bg-cyan-400 h-full" style={{ width: '43%' }} title="Discretionary (43%)" />
            </div>
          </div>

          {/* Formatted Text Content */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed text-slate-300 whitespace-pre-line font-mono">
            {budgetResult.planText}
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-indigo-900/30 rounded-xl border border-indigo-700/40 text-xs text-indigo-200">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
            <span>AI suggests setting automated salary splitting into an interest-bearing AI Vault.</span>
          </div>
        </div>
      )}
    </div>
  );
};
