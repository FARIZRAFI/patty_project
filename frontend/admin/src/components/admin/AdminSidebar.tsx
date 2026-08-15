import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Package, Users, Star, Ticket, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminSidebar: React.FC = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: ClipboardList },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Loyalty Points', path: '/loyalty', icon: Star },
    { label: 'Coupons & Offers', path: '/coupons', icon: Ticket },
    { label: 'Profile Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-black border-r border-[#262626] flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Logo Header */}
        <div className="p-6 flex items-center gap-3 border-b border-[#1F1F1F]">
          <img src="/logo.jpeg" alt="Patty Project" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide leading-tight">PATTY PROJECT</h1>
            <p className="text-[#FF5500] text-xs font-semibold uppercase">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Branch Admin'}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FF5500] border-l-4 border-[#FF5500] shadow-sm'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#141414]'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-[#1F1F1F]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-[#1F1212] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
