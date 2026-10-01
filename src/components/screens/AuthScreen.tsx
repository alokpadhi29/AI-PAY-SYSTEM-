import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Smartphone, ArrowRight, CheckCircle2, Lock, Mail, User as UserIcon } from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { updateUserProfile, audioEnabled } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
  
  const [phone, setPhone] = useState<string>('(555) 419-2048');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [name, setName] = useState<string>('Alex Morgan');
  const [email, setEmail] = useState<string>('alex.morgan@aipay.io');
  const [pin, setPin] = useState<string>('2468');
  const [confirmPin, setConfirmPin] = useState<string>('2468');
  const [timer, setTimer] = useState<number>(30);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError('');
    playTapSound(audioEnabled);
    setStep('otp');
    setTimer(30);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    playTapSound(audioEnabled);
    setOtp(['1', '2', '3', '4']);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter complete 4-digit code');
      return;
    }
    setError('');
    playSuccessSound(audioEnabled);

    if (mode === 'signup') {
      setStep('details');
    } else {
      updateUserProfile({ phone: `+1 ${phone}` });
      onSuccess();
    }
  };

  const handleCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and Email are required');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    updateUserProfile({
      name,
      email,
      phone: `+1 ${phone}`,
      pin,
      upiId: `${name.toLowerCase().replace(/\s+/g, '')}@aipay`,
    });

    playSuccessSound(audioEnabled);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 relative">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="pt-4 z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-cyan-400 flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-indigo-500/25">
            AI
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Pay</h2>
            <p className="text-xs text-slate-400">Secure Digital Banking</p>
          </div>
        </div>

        {/* Tab switcher: Sign In vs Sign Up */}
        {step === 'phone' && (
          <div className="flex p-1 bg-slate-800/90 rounded-xl mb-6 border border-slate-700/60">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="z-10 my-auto">
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-1">
                {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
              </h3>
              <p className="text-xs text-slate-400">
                Enter your mobile number to receive a verification OTP.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Mobile Number
              </label>
              <div className="flex rounded-xl bg-slate-800/90 border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all overflow-hidden">
                <span className="px-3.5 py-3 bg-slate-800 text-slate-400 text-sm font-semibold border-r border-slate-700 flex items-center gap-1.5">
                  🇺🇸 +1
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="flex-1 px-4 py-3 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <span>Get OTP Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-1">
                Verify Phone
              </h3>
              <p className="text-xs text-slate-400">
                Code sent to <span className="text-white font-semibold">+1 {phone}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* OTP Boxes */}
            <div className="flex justify-between gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-2xl bg-slate-800/90 border border-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-white transition-all"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Autofill Demo OTP (1234)
              </button>
              <span>
                {timer > 0 ? `Resend in ${timer}s` : (
                  <button
                    type="button"
                    onClick={() => setTimer(30)}
                    className="text-indigo-400 hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
              >
                <span>Verify & Continue</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}

        {step === 'details' && (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">
                Personalize Account
              </h3>
              <p className="text-xs text-slate-400">
                Setup your security PIN and account details
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700">
                <UserIcon className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-transparent text-sm text-white outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700">
                <Mail className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full bg-transparent text-sm text-white outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Set 4-Digit PIN</label>
                <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700">
                  <Lock className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-transparent text-sm text-white tracking-widest outline-none text-center"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm PIN</label>
                <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700">
                  <Lock className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-transparent text-sm text-white tracking-widest outline-none text-center"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <span>Complete Setup</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="z-10 text-center pt-4">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>256-bit Simulated Encryption · Sandbox Mode</span>
        </p>
      </div>
    </div>
  );
};
