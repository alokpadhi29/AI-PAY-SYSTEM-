export type TransactionType = 'sent' | 'received' | 'bill' | 'recharge' | 'refund';
export type TransactionStatus = 'success' | 'pending' | 'failed';
export type ExpenseCategory = 
  | 'Food' 
  | 'Shopping' 
  | 'Travel' 
  | 'Bills' 
  | 'Entertainment' 
  | 'Health' 
  | 'Transfer' 
  | 'Income';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  upiId: string;
  pin: string;
  currency: string;
  isBiometricEnabled: boolean;
  walletBalance: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Checking' | 'Savings' | 'Credit Card';
  balance: number;
  isDefault: boolean;
  color: string;
  logo: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  avatar: string;
  isFavorite: boolean;
  recentAmount?: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  recipientName: string;
  recipientUpi: string;
  recipientAvatar?: string;
  senderName: string;
  category: ExpenseCategory;
  status: TransactionStatus;
  timestamp: string;
  note?: string;
  paymentMethod: string;
  referenceId: string;
  billProvider?: string;
}

export interface BillProvider {
  id: string;
  name: string;
  category: 'mobile' | 'electricity' | 'water' | 'internet' | 'dth' | 'gas';
  icon: string;
  plans?: { id: string; name: string; price: number; validity: string; details: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
  breakdown?: { label: string; amount: number; percentage: number }[];
  isThinking?: boolean;
}

export type ScreenTab = 'home' | 'payments' | 'transactions' | 'ai' | 'profile' | 'analytics' | 'budget';
