import React from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-6 select-none overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/25 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/20 rounded-full blur-[90px]" />
      </div>

      {/* Top spacer */}
      <div className="h-6" />

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center z-10 max-w-xs">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl opacity-30 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-[2px] shadow-2xl">
            <div className="w-full h-full bg-slate-950/80 rounded-[22px] backdrop-blur-xl flex flex-col items-center justify-center border border-indigo-500/30">
              <span className="text-3xl font-black bg-gradient-to-tr from-white via-indigo-100 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
                AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mt-0.5">
                PAY
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Pay</span>
        </h1>

        <p className="text-lg font-semibold text-slate-200 tracking-tight mb-1">
          Pay Smart. Spend Smarter.
        </p>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Next-generation payment rail paired with real-time financial intelligence.
        </p>

        {/* Feature Highlights */}
        <div className="w-full flex flex-col gap-2.5 text-left mb-4">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Instant Payments & QR</p>
              <p className="text-[11px] text-slate-400">Send, scan, and settle in milliseconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">AI Financial Intelligence</p>
              <p className="text-[11px] text-slate-400">Gemini-driven expense analysis & budgeting</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Bank-Grade PIN Protection</p>
              <p className="text-[11px] text-slate-400">Biometric authorization & secure tokens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center gap-3">
        <button
          onClick={onDismiss}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[11px] text-slate-400">
          Simulated Sandbox · Zero Real Money Processed
        </span>
      </div>
    </div>
  );
};
