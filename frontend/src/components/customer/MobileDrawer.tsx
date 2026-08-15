import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { X, Home, UtensilsCrossed, Tag, Info, Headphones, ShoppingBag, User, MapPin, Gift, Package, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

interface Props {
  onClose: () => void;
  onOpenLocationModal: () => void;
}

export const MobileDrawer: React.FC<Props> = ({ onClose, onOpenLocationModal }) => {
  const { items, selectedBranch } = useCartStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const navLinks = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'MENU', path: '/menu', icon: UtensilsCrossed },
    { label: 'OFFERS', path: '/offers', icon: Tag },
    { label: 'ABOUT', path: '/about', icon: Info },
    { label: 'CONTACT', path: '/contact', icon: Headphones },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
      {/* Sidebar Drawer Container */}
      <div className="bg-[#0D0D0D] border-r border-[#222222] w-[320px] max-w-[85vw] h-full flex flex-col justify-between p-6 overflow-y-auto animate-slideRight relative shadow-2xl">
        
        <div>
          {/* Header Row: Logo & Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-[#1C1C1C] mb-6">
            <Link to="/" onClick={onClose} className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="Patty Project"
                className="w-12 h-12 rounded-full object-cover border border-[#282828]"
              />
              <span className="font-hero font-black text-white text-base uppercase tracking-tight">
                Patty Project
              </span>
            </Link>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#181818] border border-[#282828] text-[#9CA3AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Outlet Selector Card */}
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#FF5500] uppercase tracking-wider">
                CURRENT OUTLET
              </span>
              <button
                onClick={() => {
                  onClose();
                  navigate('/select-location');
                }}
                className="text-[10px] font-bold text-[#FF5500] hover:underline cursor-pointer"
              >
                Change Outlet
              </button>
            </div>

            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 text-[#FF5500] shrink-0" />
              <p className="text-xs font-extrabold truncate">
                {selectedBranch ? selectedBranch.name : 'Select Location'}
              </p>
            </div>
            {selectedBranch && (
              <p className="text-[10px] text-[#9CA3AF] pl-6 truncate">
                {selectedBranch.address_line1}, {selectedBranch.postcode}
              </p>
            )}
          </div>

          {/* Main Navigation Links List */}
          <div className="space-y-1 mb-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-extrabold tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/20'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-[#181818]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom User / Loyalty Account Section */}
        <div className="pt-6 border-t border-[#1C1C1C] space-y-4">
          {user ? (
            <div className="space-y-3">
              {/* User Avatar & Name */}
              <div
                onClick={() => handleNav('/profile')}
                className="flex items-center gap-3 p-3 bg-[#141414] border border-[#222222] hover:border-[#FF5500]/50 rounded-2xl cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF5500]/20 border border-[#FF5500] text-[#FF5500] font-black text-sm flex items-center justify-center">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-white truncate">{user.full_name}</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">{user.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#181818] border border-[#EF4444]/30 text-[#EF4444] text-xs font-extrabold rounded-xl hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('/login')}
              className="w-full bg-[#FF5500] hover:bg-[#FF6611] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>LOGIN / SIGN UP</span>
            </button>
          )}
        </div>

      </div>

      {/* Backdrop Area to click and close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
