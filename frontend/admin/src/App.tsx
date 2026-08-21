import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminSidebar } from './components/admin/AdminSidebar';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrderBoard } from './pages/admin/AdminOrderBoard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminLoyalty } from './pages/admin/AdminLoyalty';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminProfileSettings } from './pages/admin/AdminProfileSettings';

import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

// Admin Layout Shell with Protection Guard
const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuthStore();
  const isAdmin = token && user && (user.role === 'SUPER_ADMIN' || user.role === 'BRANCH_ADMIN');

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Admin Routes Only */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminLayoutShell><AdminDashboard /></AdminLayoutShell>} />
          <Route path="/orders" element={<AdminLayoutShell><AdminOrderBoard /></AdminLayoutShell>} />
          <Route path="/products" element={<AdminLayoutShell><AdminProducts /></AdminLayoutShell>} />
          <Route path="/customers" element={<AdminLayoutShell><AdminCustomers /></AdminLayoutShell>} />
          <Route path="/loyalty" element={<AdminLayoutShell><AdminLoyalty /></AdminLayoutShell>} />
          <Route path="/coupons" element={<AdminLayoutShell><AdminCoupons /></AdminLayoutShell>} />
          <Route path="/settings" element={<AdminLayoutShell><AdminProfileSettings /></AdminLayoutShell>} />

          {/* Root redirect to login or dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
