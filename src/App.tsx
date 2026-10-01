/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { PaymentsHubScreen } from './components/screens/PaymentsHubScreen';
import { TransactionsScreen } from './components/screens/TransactionsScreen';
import { AIAssistantScreen } from './components/screens/AIAssistantScreen';
import { ExpenseAnalyticsScreen } from './components/screens/ExpenseAnalyticsScreen';
import { AIBudgetPlannerScreen } from './components/screens/AIBudgetPlannerScreen';
import { BillsRechargeScreen } from './components/screens/BillsRechargeScreen';
import { ProfileSettingsScreen } from './components/screens/ProfileSettingsScreen';
import { SendMoneyScreen } from './components/screens/SendMoneyScreen';
import { QRScannerScreen } from './components/screens/QRScannerScreen';
import { ReceiveMoneyScreen } from './components/screens/ReceiveMoneyScreen';
import { ReceiptModal } from './components/screens/ReceiptModal';
import { AddMoneyModal } from './components/modals/AddMoneyModal';
import { RequestMoneyModal } from './components/modals/RequestMoneyModal';
import { AddContactModal } from './components/modals/AddContactModal';
import { NotificationsModal } from './components/modals/NotificationsModal';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    activeModal, 
    closeModal, 
    selectedTransaction, 
    paymentDraft, 
    openModal,
    isLoggedIn,
    setIsLoggedIn
  } = useApp();

  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Only show splash once per session
    const seen = sessionStorage.getItem('aipay_splash_seen');
    return !seen;
  });

  const handleDismissSplash = () => {
    sessionStorage.setItem('aipay_splash_seen', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onDismiss={handleDismissSplash} />;
  }

  if (!isLoggedIn) {
    return <AuthScreen onSuccess={() => setIsLoggedIn(true)} />;
  }

  // Active Screen title mapping
  const getScreenTitle = () => {
    switch (activeTab) {
      case 'home':
        return undefined; // uses logo brand
      case 'payments':
        return 'Payments Hub';
      case 'transactions':
        return 'Activity & History';
      case 'ai':
        return 'AI Pay AI';
      case 'profile':
        return 'Profile & Settings';
      case 'analytics':
        return 'Expense Analytics';
      case 'budget':
        return 'AI Budget Planner';
      default:
        return undefined;
    }
  };

  return (
    <MobileFrame>
      <AppHeader title={getScreenTitle()} />

      {/* Main Tab Views */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'payments' && <PaymentsHubScreen />}
        {activeTab === 'transactions' && <TransactionsScreen />}
        {activeTab === 'ai' && <AIAssistantScreen />}
        {activeTab === 'profile' && <ProfileSettingsScreen />}
        {activeTab === 'analytics' && <ExpenseAnalyticsScreen />}
        {activeTab === 'budget' && <AIBudgetPlannerScreen />}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav />

      {/* Modals & Bottom Sheets */}
      {activeModal === 'send' && (
        <SendMoneyScreen
          onClose={closeModal}
          initialRecipient={paymentDraft || undefined}
        />
      )}

      {activeModal === 'scan' && (
        <QRScannerScreen
          onClose={closeModal}
          onScanSuccess={(scannedMerchant) => {
            closeModal();
            openModal('send', {
              recipientName: scannedMerchant.name,
              recipientUpi: scannedMerchant.upiId,
              amount: scannedMerchant.amount || 20,
              note: scannedMerchant.note,
            });
          }}
        />
      )}

      {activeModal === 'receive' && (
        <ReceiveMoneyScreen onClose={closeModal} />
      )}

      {activeModal === 'receipt' && selectedTransaction && (
        <ReceiptModal
          transaction={selectedTransaction}
          onClose={closeModal}
        />
      )}

      {activeModal === 'add-money' && (
        <AddMoneyModal onClose={closeModal} />
      )}

      {activeModal === 'request' && (
        <RequestMoneyModal onClose={closeModal} />
      )}

      {activeModal === 'add-contact' && (
        <AddContactModal onClose={closeModal} />
      )}

      {activeModal === 'notifications' && (
        <NotificationsModal onClose={closeModal} />
      )}

      {activeModal === 'bill-pay' && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 overflow-y-auto p-2">
          <div className="flex justify-end p-2">
            <button
              onClick={closeModal}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Done
            </button>
          </div>
          <BillsRechargeScreen />
        </div>
      )}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
