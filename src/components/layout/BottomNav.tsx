import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenTab } from '../../types';
import { 
  Home, 
  CreditCard, 
  Clock, 
  Sparkles, 
  User, 
  QrCode 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openModal } = useApp();

  const navItems: { id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'transactions', label: 'Activity', icon: Clock },
    { id: 'ai', label: 'AI Pay AI', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 transition-colors shadow-lg">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAI = item.id === 'ai';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all duration-200 active:scale-95 group relative ${
                isActive 
                  ? 'text-indigo-600 dark:text-cyan-400 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              {/* Active pill background effect */}
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
              )}
              
              <div className={`p-1 rounded-xl transition-all ${
                isActive && isAI
                  ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 text-indigo-600 dark:text-cyan-400'
                  : ''
              }`}>
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isAI && !isActive ? 'text-indigo-500 dark:text-cyan-400' : ''
                }`} />
              </div>
              
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
