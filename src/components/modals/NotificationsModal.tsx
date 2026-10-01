import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const { setActiveTab } = useApp();

  const notifications = [
    {
      id: 'n_1',
      title: 'AI Smart Tip Available',
      desc: 'You saved $64 this week by reducing duplicate streaming charges.',
      time: '15m ago',
      type: 'ai',
      unread: true,
    },
    {
      id: 'n_2',
      title: 'Direct ACH Deposit Credited',
      desc: 'Apex Innovations Corp credited $3,250.00 to your Chase Premier Checking.',
      time: '3h ago',
      type: 'payment',
      unread: true,
    },
    {
      id: 'n_3',
      title: 'Monthly Broadband Paid',
      desc: 'Automatic settlement of $89.50 to Verizon Fiber successful.',
      time: '1d ago',
      type: 'bill',
      unread: false,
    },
    {
      id: 'n_4',
      title: 'Security Audit Passed',
      desc: 'Biometric authorization tokens refreshed with bank-grade encryption.',
      time: '2d ago',
      type: 'security',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.type === 'ai') {
                  onClose();
                  setActiveTab('ai');
                }
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                n.unread
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  {n.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                  {n.type === 'payment' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  {n.type === 'security' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                </div>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                {n.desc}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};
