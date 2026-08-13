import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { CustomerHeader } from './components/customer/CustomerHeader';
import { MobileBottomNav } from './components/customer/MobileBottomNav';
import { LocationModal } from './components/customer/LocationModal';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrderBoard } from './pages/admin/AdminOrderBoard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminLoyalty } from './pages/admin/AdminLoyalty';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminProfileSettings } from './pages/admin/AdminProfileSettings';

import { CustomerHome } from './pages/customer/CustomerHome';
import { CustomerMenu } from './pages/customer/CustomerMenu';
import { CustomerCart } from './pages/customer/CustomerCart';
import { CustomerCheckout } from './pages/customer/CustomerCheckout';
import { OrderConfirmation } from './pages/customer/OrderConfirmation';
import { CustomerLoyaltyPortal } from './pages/customer/CustomerLoyaltyPortal';
import { CustomerOrderHistory } from './pages/customer/CustomerOrderHistory';
import { CustomerProfileSettings } from './pages/customer/CustomerProfileSettings';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { SelectLocationPage } from './pages/customer/SelectLocationPage';

const queryClient = new QueryClient();

// Admin Layout Shell
const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

// Customer Layout Shell
const CustomerLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-between">
      <div>
        <CustomerHeader
          onOpenLocationModal={() => setShowLocationModal(true)}
          onOpenMobileDrawer={() => {}}
        />
        <main>{children}</main>
      </div>

      <MobileBottomNav />

      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} />
      )}
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayoutShell><AdminDashboard /></AdminLayoutShell>} />
          <Route path="/admin/orders" element={<AdminLayoutShell><AdminOrderBoard /></AdminLayoutShell>} />
          <Route path="/admin/products" element={<AdminLayoutShell><AdminProducts /></AdminLayoutShell>} />
          <Route path="/admin/customers" element={<AdminLayoutShell><AdminCustomers /></AdminLayoutShell>} />
          <Route path="/admin/loyalty" element={<AdminLayoutShell><AdminLoyalty /></AdminLayoutShell>} />
          <Route path="/admin/coupons" element={<AdminLayoutShell><AdminCoupons /></AdminLayoutShell>} />
          <Route path="/admin/settings" element={<AdminLayoutShell><AdminProfileSettings /></AdminLayoutShell>} />

          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayoutShell><CustomerHome /></CustomerLayoutShell>} />
          <Route path="/select-location" element={<CustomerLayoutShell><SelectLocationPage /></CustomerLayoutShell>} />
          <Route path="/menu" element={<CustomerLayoutShell><CustomerMenu /></CustomerLayoutShell>} />
          <Route path="/product/:productId" element={<CustomerLayoutShell><ProductDetailPage /></CustomerLayoutShell>} />
          <Route path="/cart" element={<CustomerLayoutShell><CustomerCart /></CustomerLayoutShell>} />
          <Route path="/checkout" element={<CustomerLayoutShell><CustomerCheckout /></CustomerLayoutShell>} />
          <Route path="/order-confirmation/:orderNumber" element={<CustomerLayoutShell><OrderConfirmation /></CustomerLayoutShell>} />
          <Route path="/loyalty" element={<CustomerLayoutShell><CustomerLoyaltyPortal /></CustomerLayoutShell>} />
          <Route path="/orders" element={<CustomerLayoutShell><CustomerOrderHistory /></CustomerLayoutShell>} />
          <Route path="/profile" element={<CustomerLayoutShell><CustomerProfileSettings /></CustomerLayoutShell>} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
