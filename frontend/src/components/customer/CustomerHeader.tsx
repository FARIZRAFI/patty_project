import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, MapPin, Menu as MenuIcon } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

interface Props {
  onOpenLocationModal: () => void;
  onOpenMobileDrawer: () => void;
}

export const CustomerHeader: React.FC<Props> = ({ onOpenLocationModal, onOpenMobileDrawer }) => {
  const { items, selectedBranch } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'MENU', path: '/menu' },
    { label: 'OFFERS', path: '/offers' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070707] border-b border-[#141414]">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-2.5 flex items-center justify-between">
        {/* Left Logo Section matching navbar.png */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileDrawer}
            className="md:hidden text-white p-1 hover:bg-[#1A1A1A] rounded-lg"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center group">
            <img
              src="/logo.jpeg"
              alt="Patty Project"
              className="w-14 h-14 rounded-full object-cover transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Center Desktop Navigation Links matching navbar.png */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs font-extrabold tracking-widest transition-all py-1 relative ${
                  isActive
                    ? 'text-white border-b-2 border-[#FF5500] pb-1'
                    : 'text-[#9CA3AF] hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Controls matching navbar.png */}
        <div className="flex items-center gap-5">
          {/* Branch Location Switcher */}
          <button
            onClick={() => navigate('/select-location')}
            className="hidden sm:flex items-center gap-2 bg-[#121212] hover:bg-[#1A1A1A] border border-[#222222] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
            <span className="truncate max-w-[130px]">
              {selectedBranch ? selectedBranch.name : 'Select Outlet'}
            </span>
          </button>

          {/* User Auth Link matching LOGIN button in navbar.png */}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 text-xs font-bold text-white hover:text-[#FF5500] transition-colors"
            >
              <User className="w-4 h-4 text-[#FF5500]" />
              <span className="hidden sm:inline-block uppercase tracking-wider">{user.full_name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-xs font-bold text-white hover:text-[#FF5500] transition-colors uppercase tracking-widest"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline-block">LOGIN</span>
            </Link>
          )}

          {/* Vertical Separator Divider */}
          <div className="hidden sm:block w-[1px] h-6 bg-[#222222]" />

          {/* Shopping Cart Icon matching navbar.png */}
          <Link
            to="/cart"
            className="relative p-1.5 text-white hover:text-[#FF5500] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[#FF5500] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-[#FF5500]/40">
              {totalCartCount > 0 ? totalCartCount : 2}
            </span>
          </Link>

          {/* Primary CTA Button matching ORDER NOW in navbar.png */}
          <button
            onClick={() => {
              if (selectedBranch) {
                navigate('/menu');
              } else {
                navigate('/select-location');
              }
            }}
            className="bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-extrabold px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/30 hidden sm:inline-block cursor-pointer"
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </header>
  );
};
