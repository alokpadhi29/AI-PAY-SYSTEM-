import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, showBack, onBack }) => {
  const { 
    theme, 
    toggleTheme, 
    audioEnabled, 
    toggleAudio, 
    isPhoneFrame, 
    togglePhoneFrame,
    unreadNotifications,
    activeTab,
    setActiveTab,
    openModal
  } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveTab('home');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 transition-colors">
      <div className="flex items-center gap-2.5">
        {showBack || (activeTab !== 'home' && !title) ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : null}

        {title ? (
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
        ) : (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-sm">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                AI <span className="text-indigo-600 dark:text-cyan-400">Pay</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Smart Finance</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title={audioEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          aria-label="Toggle Sound"
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Device Frame Toggle (desktop helpful) */}
        <button
          onClick={togglePhoneFrame}
          className="hidden md:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title={isPhoneFrame ? 'Switch to Expanded View' : 'Switch to Mobile Frame'}
          aria-label="Toggle device frame"
        >
          {isPhoneFrame ? (
            <Monitor className="w-4 h-4 text-slate-500" />
          ) : (
            <Smartphone className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => openModal('notifications')}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 dark:bg-cyan-400 rounded-full animate-ping" />
          )}
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 dark:bg-cyan-400 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};
