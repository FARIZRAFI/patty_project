import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Package, Users, Star, Ticket, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminSidebar: React.FC = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const allNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Products & Stock', path: '/admin/products', icon: Package },
    { label: 'Customers', path: '/admin/customers', icon: Users, superAdminOnly: true },
    { label: 'Loyalty Points', path: '/admin/loyalty', icon: Star, superAdminOnly: true },
    { label: 'Coupons & Offers', path: '/admin/coupons', icon: Ticket, superAdminOnly: true },
    { label: 'Profile Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems = allNavItems.filter((item) => !item.superAdminOnly || user?.role === 'SUPER_ADMIN');

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-56 bg-[#080808] border-r border-[#1C1C1C] flex flex-col justify-between h-screen shrink-0 select-none z-40 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-3 border-b border-[#1C1C1C] h-16 shrink-0 bg-[#080808] sticky top-0 z-10">
          <img src="/logo.jpeg" alt="Patty Project" className="w-9 h-9 rounded-full object-cover border border-[#242424] shrink-0" />
          <div className="min-w-0">
            <h1 className="text-[#F5F5F5] font-bold text-sm tracking-tight truncate leading-tight">PATTY PROJECT</h1>
            <p className="text-[#FF5A00] text-[10px] font-semibold uppercase tracking-wider mt-0.5">
              {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Branch Admin'}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `h-10 flex items-center gap-3 px-3.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FF5A00] border-l-[3px] border-[#FF5A00]'
                      : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#121212]'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="p-3 border-t border-[#1C1C1C] bg-[#080808] sticky bottom-0 z-10">
        <button
          onClick={handleLogout}
          className="w-full h-10 flex items-center gap-3 px-3.5 rounded-lg text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
