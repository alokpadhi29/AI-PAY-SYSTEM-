import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BankAccount, Contact, Transaction, ScreenTab, ExpenseCategory } from '../types';
import { initialUser, initialBankAccounts, initialContacts, initialTransactions } from '../data/mockData';
import { playSuccessSound, playTapSound } from '../utils/audio';

interface PaymentPayload {
  recipientName: string;
  recipientUpi: string;
  recipientAvatar?: string;
  amount: number;
  note?: string;
  category?: ExpenseCategory;
  paymentMethod?: string;
}

interface AppContextType {
  user: User;
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  contacts: Contact[];
  theme: 'dark' | 'light';
  activeTab: ScreenTab;
  activeModal: string | null;
  selectedTransaction: Transaction | null;
  paymentDraft: PaymentPayload | null;
  audioEnabled: boolean;
  isPhoneFrame: boolean;
  isLoggedIn: boolean;
  unreadNotifications: number;
  setActiveTab: (tab: ScreenTab) => void;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;
  toggleTheme: () => void;
  toggleAudio: () => void;
  togglePhoneFrame: () => void;
  setIsLoggedIn: (status: boolean) => void;
  executePayment: (payload: PaymentPayload) => Transaction;
  addMoneyToAccount: (amount: number) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  resetDemoData: () => void;
  viewReceipt: (txn: Transaction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('aipay_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('aipay_banks');
    return saved ? JSON.parse(saved) : initialBankAccounts;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('aipay_txns');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('aipay_contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('aipay_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTabState] = useState<ScreenTab>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [paymentDraft, setPaymentDraft] = useState<PaymentPayload | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  // Sync theme with HTML document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('aipay_theme', theme);
  }, [theme]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('aipay_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aipay_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('aipay_banks', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  const setActiveTab = (tab: ScreenTab) => {
    playTapSound(audioEnabled);
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (modalName: string, payload?: any) => {
    playTapSound(audioEnabled);
    if (payload) {
      if (modalName === 'send' || modalName === 'pin-pad') {
        setPaymentDraft(payload);
      }
    }
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const toggleTheme = () => {
    playTapSound(audioEnabled);
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  const togglePhoneFrame = () => {
    playTapSound(audioEnabled);
    setIsPhoneFrame(prev => !prev);
  };

  const executePayment = (payload: PaymentPayload): Transaction => {
    const newTxnId = `TXN_${Math.floor(100000 + Math.random() * 900000)}`;
    const newUtr = `UTR${Math.floor(10000000000 + Math.random() * 90000000000)}`;

    const newTxn: Transaction = {
      id: newTxnId,
      type: payload.category === 'Bills' ? 'bill' : 'sent',
      amount: payload.amount,
      recipientName: payload.recipientName,
      recipientUpi: payload.recipientUpi,
      recipientAvatar: payload.recipientAvatar,
      senderName: user.name,
      category: payload.category || 'Transfer',
      status: 'success',
      timestamp: 'Just now',
      note: payload.note || 'Payment via AI Pay',
      paymentMethod: payload.paymentMethod || `${bankAccounts[0].bankName} (${bankAccounts[0].accountNumber})`,
      referenceId: newUtr,
    };

    // Update state
    setTransactions(prev => [newTxn, ...prev]);

    // Deduct user balance
    setUser(prev => ({
      ...prev,
      walletBalance: Math.max(0, +(prev.walletBalance - payload.amount).toFixed(2)),
    }));

    // Update primary bank balance
    setBankAccounts(prev =>
      prev.map((b, idx) =>
        idx === 0 ? { ...b, balance: Math.max(0, +(b.balance - payload.amount).toFixed(2)) } : b
      )
    );

    playSuccessSound(audioEnabled);
    setSelectedTransaction(newTxn);
    setActiveModal('receipt');
    return newTxn;
  };

  const addMoneyToAccount = (amount: number) => {
    playSuccessSound(audioEnabled);
    setUser(prev => ({
      ...prev,
      walletBalance: +(prev.walletBalance + amount).toFixed(2),
    }));

    setBankAccounts(prev =>
      prev.map((b, idx) => (idx === 0 ? { ...b, balance: +(b.balance + amount).toFixed(2) } : b))
    );

    const newTxn: Transaction = {
      id: `TXN_${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'received',
      amount,
      recipientName: user.name,
      recipientUpi: user.upiId,
      senderName: 'External Linked Card / ACH',
      category: 'Income',
      status: 'success',
      timestamp: 'Just now',
      note: 'Funds Added to AI Pay Balance',
      paymentMethod: 'Instant ACH Top-up',
      referenceId: `UTR${Math.floor(10000000000 + Math.random() * 90000000000)}`,
    };

    setTransactions(prev => [newTxn, ...prev]);
    closeModal();
  };

  const addContact = (newContact: Omit<Contact, 'id'>) => {
    const contact: Contact = {
      ...newContact,
      id: `cnt_${Date.now()}`,
    };
    setContacts(prev => [contact, ...prev]);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const viewReceipt = (txn: Transaction) => {
    playTapSound(audioEnabled);
    setSelectedTransaction(txn);
    setActiveModal('receipt');
  };

  const resetDemoData = () => {
    setUser(initialUser);
    setBankAccounts(initialBankAccounts);
    setTransactions(initialTransactions);
    setContacts(initialContacts);
    localStorage.removeItem('aipay_user');
    localStorage.removeItem('aipay_banks');
    localStorage.removeItem('aipay_txns');
    localStorage.removeItem('aipay_contacts');
    playSuccessSound(audioEnabled);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        bankAccounts,
        transactions,
        contacts,
        theme,
        activeTab,
        activeModal,
        selectedTransaction,
        paymentDraft,
        audioEnabled,
        isPhoneFrame,
        isLoggedIn,
        unreadNotifications,
        setActiveTab,
        openModal,
        closeModal,
        toggleTheme,
        toggleAudio,
        togglePhoneFrame,
        setIsLoggedIn,
        executePayment,
        addMoneyToAccount,
        addContact,
        updateUserProfile,
        resetDemoData,
        viewReceipt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
