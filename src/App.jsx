import React from 'react';
import { PosProvider, usePos } from './context/PosContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Views
import LoginView from './components/Auth/LoginView';
import DashboardView from './components/Dashboard/DashboardView';
import PosView from './components/Pos/PosView';
import KitchenDisplayView from './components/Kitchen/KitchenDisplayView';
import BarDisplayView from './components/Bar/BarDisplayView';
import TableManagementView from './components/Tables/TableManagementView';
import CustomerManagementView from './components/Customers/CustomerManagementView';
import TransactionHistoryView from './components/Transactions/TransactionHistoryView';
import InventoryView from './components/Inventory/InventoryView';
import CategoryManagementView from './components/Categories/CategoryManagementView';
import BranchManagementView from './components/Branches/BranchManagementView';
import UserManagementView from './components/Users/UserManagementView';
import CustomerSelfOrderView from './components/CustomerOrder/CustomerSelfOrderView';

// Modals
import PaymentModal from './components/Pos/PaymentModal';
import OpenBillModal from './components/Pos/OpenBillModal';
import PreBillModal from './components/Pos/PreBillModal';
import ReceiptModal from './components/Receipt/ReceiptModal';
import ToastNotification from './components/Shared/ToastNotification';

function MainLayout() {
  const { activeTab, currentUser, showPreBillModal, setShowPreBillModal, selectedPreBill } = usePos();

  // 1. Standalone Customer Self-Order View (No Login Required for Customers)
  if (activeTab === 'self-order') {
    return (
      <div className="app-container" style={{ overflowY: 'auto' }}>
        <CustomerSelfOrderView />
        <ToastNotification />
      </div>
    );
  }

  // 2. Protected Staff / Admin Layout (Requires User Login)
  if (!currentUser) {
    return (
      <div className="app-container">
        <LoginView />
        <ToastNotification />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="app-main">
        <Sidebar />
        <main className="app-content">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'pos' && <PosView />}
          {activeTab === 'dapur' && <KitchenDisplayView />}
          {activeTab === 'bar' && <BarDisplayView />}
          {activeTab === 'meja' && <TableManagementView />}
          {activeTab === 'pelanggan' && <CustomerManagementView />}
          {activeTab === 'riwayat' && <TransactionHistoryView />}
          {activeTab === 'menu' && <InventoryView />}
          {activeTab === 'kategori' && <CategoryManagementView />}
          {activeTab === 'cabang' && <BranchManagementView />}
          {activeTab === 'user' && <UserManagementView />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <PaymentModal />
      <OpenBillModal />
      <PreBillModal 
        isOpen={showPreBillModal}
        onClose={() => setShowPreBillModal(false)}
        billData={selectedPreBill}
      />
      <ReceiptModal />
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <PosProvider>
      <MainLayout />
    </PosProvider>
  );
}
