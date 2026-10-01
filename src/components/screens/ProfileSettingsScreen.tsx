import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User as UserIcon, 
  Building, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Globe, 
  HelpCircle, 
  FileText, 
  LogOut, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Check, 
  Plus,
  Fingerprint,
  RotateCcw
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

export const ProfileSettingsScreen: React.FC = () => {
  const { 
    user, 
    bankAccounts, 
    theme, 
    toggleTheme, 
    audioEnabled, 
    toggleAudio, 
    resetDemoData, 
    setIsLoggedIn,
    updateUserProfile 
  } = useApp();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English (US)');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(user.isBiometricEnabled);

  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);
  const [pinChangeError, setPinChangeError] = useState<string>('');

  const [newBankName, setNewBankName] = useState<string>('Bank of America');
  const [newBankNumber, setNewBankNumber] = useState<string>('•••• 7721');

  const languages = [
    'English (US)',
    'Español (América Latina)',
    'Français',
    'Deutsch',
    'Hindi (हिंदी)',
    '日本語',
  ];

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPin !== user.pin && oldPin !== '2468' && oldPin !== '1234') {
      setPinChangeError('Current PIN is incorrect');
      return;
    }
    if (newPin.length !== 4) {
      setPinChangeError('New PIN must be 4 digits');
      return;
    }

    updateUserProfile({ pin: newPin });
    playSuccessSound(audioEnabled);
    setPinChangeSuccess(true);
    setPinChangeError('');
    setTimeout(() => {
      setPinChangeSuccess(false);
      setActiveModal(null);
      setOldPin('');
      setNewPin('');
    }, 1200);
  };

  const handleToggleBiometrics = () => {
    playTapSound(audioEnabled);
    const updated = !biometricEnabled;
    setBiometricEnabled(updated);
    updateUserProfile({ isBiometricEnabled: updated });
  };

  return (
    <div className="flex-1 px-4 py-4 space-y-5 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-950 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-400/80 shadow-md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white tracking-tight truncate">
                {user.name}
              </h2>
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                ✓
              </span>
            </div>
            <p className="text-xs text-indigo-200 font-mono mt-0.5">
              {user.upiId}
            </p>
            <p className="text-[11px] text-slate-300">
              {user.phone} · {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Linked Bank Accounts & UPI
          </h3>
          <button
            onClick={() => setActiveModal('link-bank')}
            className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bank</span>
          </button>
        </div>

        <div className="space-y-2">
          {bankAccounts.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {b.bankName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b.accountType} · {b.accountNumber}
                  </p>
                </div>
              </div>

              {b.isDefault ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Primary
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Linked</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Options List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Preferences & Security
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Change Security PIN */}
          <div
            onClick={() => setActiveModal('change-pin')}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-indigo-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Security & PIN</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Change 4-digit transaction PIN</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Biometrics Toggle */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Biometric Login & Pay</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Face ID / Touch ID authorization</p>
              </div>
            </div>
            <button
              onClick={handleToggleBiometrics}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                biometricEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Theme Toggle */}
          <div
            onClick={toggleTheme}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Appearance</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Current: {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-400">Toggle</span>
          </div>

          {/* Sound Feedback Toggle */}
          <div
            onClick={toggleAudio}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Audio & Micro-tones</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Tactile chime on successful payment</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">{audioEnabled ? 'Enabled' : 'Muted'}</span>
          </div>

          {/* Language Selector */}
          <div
            onClick={() => setActiveModal('language')}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-blue-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Language</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedLanguage}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Help & Support */}
          <div
            onClick={() => setActiveModal('support')}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Help & 24/7 AI Desk</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">FAQs, disputes & live support</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Privacy & Terms */}
          <div
            onClick={() => setActiveModal('privacy')}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-purple-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Privacy & Policies</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Sandbox terms & encryption notes</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset & Logout */}
      <div className="space-y-2 pt-2">
        <button
          onClick={resetDemoData}
          className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Balances & Transactions</span>
        </button>

        <button
          onClick={() => setIsLoggedIn(false)}
          className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>

      {/* Change PIN Modal */}
      {activeModal === 'change-pin' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Change Security PIN
            </h3>
            
            {pinChangeSuccess ? (
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 text-xs text-center font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>PIN Updated Successfully!</span>
              </div>
            ) : (
              <form onSubmit={handlePinChangeSubmit} className="space-y-3">
                {pinChangeError && (
                  <p className="text-xs text-red-500">{pinChangeError}</p>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Current PIN (demo: 2468)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-center tracking-widest text-lg outline-none font-bold"
                    placeholder="••••"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-center tracking-widest text-lg outline-none font-bold"
                    placeholder="••••"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Update PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Language Modal */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Choose App Language
            </h3>
            <div className="space-y-1">
              {languages.map((l) => (
                <div
                  key={l}
                  onClick={() => { setSelectedLanguage(l); setActiveModal(null); }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-semibold"
                >
                  <span className="text-slate-900 dark:text-white">{l}</span>
                  {selectedLanguage === l && <Check className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />}
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Support FAQ Modal */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Help & Support</h3>
              <button onClick={() => setActiveModal(null)} className="text-xs text-slate-400">Close</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">How does simulated payment work?</p>
                <p className="text-slate-500 dark:text-slate-400">All transactions in AI Pay are simulated locally in real-time. No real money or bank accounts are debited.</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">What is the default PIN?</p>
                <p className="text-slate-500 dark:text-slate-400">The demo user PIN is <strong className="text-indigo-500">2468</strong> or <strong className="text-indigo-500">1234</strong>.</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">How does AI Pay AI work?</p>
                <p className="text-slate-500 dark:text-slate-400">It is powered by Google Gemini API to analyze your category spending, suggest budgets, and provide financial intelligence.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Privacy & Security</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI Pay is designed with zero-knowledge tokenization. All AI recommendations are generated for educational and budgeting visualization only. Financial intelligence is non-binding and does not constitute certified investment advice.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
