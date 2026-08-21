import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { CustomerHeader } from './components/customer/CustomerHeader';
import { OrderingHeader } from './components/customer/OrderingHeader';
import { MobileDrawer } from './components/customer/MobileDrawer';
import { MobileBottomNav } from './components/customer/MobileBottomNav';
import { LocationModal } from './components/customer/LocationModal';
import { FloatingCartBar } from './components/customer/FloatingCartBar';

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
import { PublicMenuPage } from './pages/customer/PublicMenuPage';
import { CustomerCart } from './pages/customer/CustomerCart';
import { CustomerCheckout } from './pages/customer/CustomerCheckout';
import { OrderConfirmation } from './pages/customer/OrderConfirmation';
import { CustomerLoyaltyPortal } from './pages/customer/CustomerLoyaltyPortal';
import { CustomerOrderHistory } from './pages/customer/CustomerOrderHistory';
import { CustomerProfileSettings } from './pages/customer/CustomerProfileSettings';
import { CustomerAddresses } from './pages/customer/CustomerAddresses';
import { CustomerPaymentMethods } from './pages/customer/CustomerPaymentMethods';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { SelectLocationPage } from './pages/customer/SelectLocationPage';
import { CustomerLogin } from './pages/customer/CustomerLogin';
import { CustomerOffers } from './pages/customer/CustomerOffers';
import { CustomerContact } from './pages/customer/CustomerContact';
import { MockCheckoutPage } from './pages/customer/MockCheckoutPage';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();


// Admin Layout Shell with Protection Guard
const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuthStore();
  const isAdmin = token && user && (user.role === 'SUPER_ADMIN' || user.role === 'BRANCH_ADMIN');

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <AdminSidebar />
      <main className="pl-56 w-full min-h-screen">
        {children}
      </main>
    </div>
  );
};

// Customer Layout Shell
const CustomerLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const location = useLocation();

  const orderingPortalPages = ['/order', '/cart', '/checkout', '/orders', '/profile', '/addresses', '/payment-methods', '/mock-checkout'];
  const isOrderingPortal = orderingPortalPages.includes(location.pathname) || location.pathname.startsWith('/order-confirmation') || location.pathname.startsWith('/mock-checkout');

  const hideBottomNavPages = ['/', '/contact', '/select-location', '/menu'];
  const showBottomNav = !hideBottomNavPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <div>
        {isOrderingPortal ? (
          <OrderingHeader onOpenLocationModal={() => setShowLocationModal(true)} />
        ) : (
          <CustomerHeader
            onOpenLocationModal={() => setShowLocationModal(true)}
            onOpenMobileDrawer={() => setShowMobileDrawer(true)}
          />
        )}
        <main className={showBottomNav ? 'pb-16 md:pb-0' : ''}>{children}</main>
      </div>

      {showBottomNav && <MobileBottomNav />}
      <FloatingCartBar />

      {showMobileDrawer && (
        <MobileDrawer
          onClose={() => setShowMobileDrawer(false)}
          onOpenLocationModal={() => setShowLocationModal(true)}
        />
      )}

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
          <Route path="/menu" element={<CustomerLayoutShell><PublicMenuPage /></CustomerLayoutShell>} />
          <Route path="/order" element={<CustomerLayoutShell><CustomerMenu /></CustomerLayoutShell>} />
          <Route path="/offers" element={<CustomerLayoutShell><CustomerOffers /></CustomerLayoutShell>} />
          <Route path="/contact" element={<CustomerLayoutShell><CustomerContact /></CustomerLayoutShell>} />
          <Route path="/product/:productId" element={<CustomerLayoutShell><ProductDetailPage /></CustomerLayoutShell>} />
          <Route path="/cart" element={<CustomerLayoutShell><CustomerCart /></CustomerLayoutShell>} />
          <Route path="/checkout" element={<CustomerLayoutShell><CustomerCheckout /></CustomerLayoutShell>} />
          <Route path="/mock-checkout/:transactionId" element={<CustomerLayoutShell><MockCheckoutPage /></CustomerLayoutShell>} />
          <Route path="/mock-checkout" element={<CustomerLayoutShell><MockCheckoutPage /></CustomerLayoutShell>} />
          <Route path="/order-confirmation/:orderNumber" element={<CustomerLayoutShell><OrderConfirmation /></CustomerLayoutShell>} />
          <Route path="/loyalty" element={<CustomerLayoutShell><CustomerLoyaltyPortal /></CustomerLayoutShell>} />
          <Route path="/orders" element={<CustomerLayoutShell><CustomerOrderHistory /></CustomerLayoutShell>} />
          <Route path="/profile" element={<CustomerLayoutShell><CustomerProfileSettings /></CustomerLayoutShell>} />
          <Route path="/addresses" element={<CustomerLayoutShell><CustomerAddresses /></CustomerLayoutShell>} />
          <Route path="/payment-methods" element={<CustomerLayoutShell><CustomerPaymentMethods /></CustomerLayoutShell>} />
          <Route path="/login" element={<CustomerLogin />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
