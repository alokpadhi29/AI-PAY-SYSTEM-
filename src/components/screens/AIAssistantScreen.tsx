import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  PieChart, 
  TrendingUp, 
  ShieldAlert, 
  RotateCcw,
  Zap,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

export const AIAssistantScreen: React.FC = () => {
  const { user, transactions, setActiveTab, audioEnabled } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]}! I'm **AI Pay AI**, your intelligent financial co-pilot.\n\nI've analyzed your recent transactions and account activity. I can evaluate your spending habits, discover hidden savings, project monthly cash flow, or create customized budgets! What would you like to explore today?`,
      timestamp: 'Just now',
      suggestions: [
        'How much did I spend this month?',
        'Where am I spending the most?',
        'What were my biggest expenses?',
        'How can I save money?',
        'Create a monthly budget.',
      ],
      breakdown: [
        { label: 'Food & Dining', amount: 680.50, percentage: 28 },
        { label: 'Shopping', amount: 540.20, percentage: 22 },
        { label: 'Bills & Utilities', amount: 420.00, percentage: 17 },
        { label: 'Travel & Commute', amount: 310.00, percentage: 13 },
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const samplePrompts = [
    'How much did I spend this month?',
    'Where am I spending the most?',
    'What were my biggest expenses?',
    'How can I save money?',
    'Create a monthly budget.',
    'Analyze my spending.',
  ];

  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim() || loading) return;
    playTapSound(audioEnabled);

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    // Compute live user stats for the server prompt
    const monthlySpent = transactions
      .filter(t => t.type === 'sent' || t.type === 'bill')
      .reduce((acc, t) => acc + t.amount, 0);

    const categoryMap: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'sent' || t.type === 'bill') {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          context: {
            balance: user.walletBalance,
            monthlyIncome: 6500.00,
            monthlySpent: +monthlySpent.toFixed(2),
            categories: categoryMap,
            transactions: transactions.slice(0, 10),
          },
        }),
      });

      const data = await res.json();
      playSuccessSound(audioEnabled);

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here is the summary of your account activity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Show detailed analytics',
          'Open Budget Planner',
          'How can I save more?',
        ],
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: `Based on your recent payments, you have spent a total of **$${monthlySpent.toFixed(2)}**. Your leading category is **Food & Dining** ($680.50), followed by **Shopping** ($540.20).\n\n💡 **Tip**: Trimming your weekend food delivery orders could save you over $150 this month!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    // Basic parser for bold and bullet points
    return text.split('\n\n').map((paragraph, pIdx) => {
      if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={pIdx} className="space-y-1.5 my-2 pl-1">
            {items.map((it, i) => {
              const clean = it.replace(/^[•-]\s*/, '');
              return (
                <li key={i} className="flex items-start gap-1.5 text-xs">
                  <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInline(clean) }} />
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p 
          key={pIdx} 
          className="text-xs leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }}
        />
      );
    });
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-cyan-300 italic">$1</em>');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-white animate-in fade-in duration-300">
      {/* AI Header Strip */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
              <span>AI Pay AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Online · Gemini
              </span>
            </h2>
            <p className="text-[10px] text-slate-400">Intelligent Personal Financial Advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className="p-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-1"
            title="Open Visual Analytics"
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className="p-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-1"
            title="Open Budget Planner"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Budget</span>
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
          Ask:
        </span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-indigo-950/80 hover:border-indigo-400/50 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors active:scale-95 shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[92%] ${isAI ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                isAI 
                  ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-indigo-500/20' 
                  : 'bg-slate-700 text-white'
              }`}>
                {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble Card */}
              <div className={`p-4 rounded-3xl text-xs space-y-2.5 ${
                isAI
                  ? 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-lg'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">{isAI ? 'AI Pay AI' : user.name}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Formatted Text */}
                <div className="text-slate-200">
                  {renderFormattedText(msg.text)}
                </div>

                {/* Optional Embedded Spending Breakdown Card */}
                {msg.breakdown && (
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 mt-2">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Current Spending Breakdown
                    </span>
                    <div className="space-y-1.5">
                      {msg.breakdown.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="font-bold text-white">${item.amount.toFixed(2)} ({item.percentage}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions Follow-up Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-800/80">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (s.includes('analytics')) setActiveTab('analytics');
                          else if (s.includes('Budget')) setActiveTab('budget');
                          else handleSendMessage(s);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-[10px] font-medium text-cyan-300 hover:text-white transition-colors"
                      >
                        {s} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>AI is analyzing transactions with Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI Disclaimer Strip */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-900 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
        <ShieldAlert className="w-3 h-3 text-amber-500/80 shrink-0" />
        <span>AI-generated financial intelligence. Not certified financial advice.</span>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputPrompt);
          }}
          placeholder="Ask AI Pay AI about spending, budgeting, savings..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500 placeholder:text-slate-500 transition-colors"
        />

        <button
          onClick={() => handleSendMessage(inputPrompt)}
          disabled={!inputPrompt.trim() || loading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md disabled:opacity-40 transition-all active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
