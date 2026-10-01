import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isPhoneFrame } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formatted = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}`;
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneFrame) {
    // Fluid responsive desktop mode
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center">
        <div className="w-full max-w-2xl min-h-screen bg-white dark:bg-slate-900 shadow-2xl relative flex flex-col pb-20">
          {children}
        </div>
      </div>
    );
  }

  // Realistic Smartphone Device Bezel
  return (
    <div className="min-h-screen bg-slate-950 py-0 md:py-6 px-0 md:px-4 flex items-center justify-center selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full md:max-w-[420px] h-[100dvh] md:h-[890px] bg-white dark:bg-slate-900 md:rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-0 md:border-[10px] md:border-slate-800/90 relative flex flex-col overflow-hidden transition-all duration-300">
        {/* Device Status Bar */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md pt-2 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 select-none">
          <span className="tracking-tight text-[13px] font-bold">{currentTime}</span>
          
          {/* Dynamic Island simulation */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 space-x-1 shadow-inner">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-700/60" />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center">
              <span className="text-[10px] mr-0.5">88%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Scrollable Main Screen Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col pb-20">
          {children}
        </div>

        {/* iOS / Modern Android Home Gesture Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full z-40 pointer-events-none opacity-80" />
      </div>
    </div>
  );
};
