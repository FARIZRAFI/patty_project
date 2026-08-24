import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrderBoard } from './pages/admin/AdminOrderBoard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminLoyalty } from './pages/admin/AdminLoyalty';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminOfferSettings } from './pages/admin/AdminOfferSettings';
import { AdminProfileSettings } from './pages/admin/AdminProfileSettings';

import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

// Admin Layout Shell with Protection Guard & Sidebar Toggle
const AdminLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  const isAdmin = token && user && (user.role === 'SUPER_ADMIN' || user.role === 'BRANCH_ADMIN');

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Component */}
      <AdminSidebar isCollapsed={isCollapsed} onToggleCollapse={toggleSidebar} />

      {/* Main Content Area */}
      <main
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-0' : 'ml-64'
        }`}
      >
        {/* Floating/Top Bar Expand Button when Collapsed */}
        {isCollapsed && (
          <div className="sticky top-4 left-4 z-30 px-6 pt-4 pb-0">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#121212]/95 backdrop-blur-md hover:bg-[#1C1C1C] text-white border border-[#2E2E2E] hover:border-[#FF5500]/50 rounded-xl shadow-2xl transition-all text-xs font-semibold cursor-pointer group"
              title="Show sidebar"
            >
              <Menu className="w-4 h-4 text-[#FF5500] group-hover:scale-110 transition-transform" />
              <span>Sidebar</span>
            </button>
          </div>
        )}
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
          <Route path="/offers" element={<AdminLayoutShell><AdminOfferSettings /></AdminLayoutShell>} />
          <Route path="/settings" element={<AdminLayoutShell><AdminProfileSettings /></AdminLayoutShell>} />

          {/* Root redirect to login or dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
