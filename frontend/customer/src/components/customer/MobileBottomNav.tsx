import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Tag, Gift, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isProductModalOpen } = useCartStore();
  const { user, token } = useAuthStore();

  // Hide bottom nav bar when Product Preview Modal is open so it doesn't overlap modal or Add to Cart button
  if (isProductModalOpen) return null;

  const isLoggedIn = !!(user && token);

  const isOrderPortal =
    location.pathname.startsWith('/order') ||
    location.pathname.startsWith('/product') ||
    location.pathname === '/cart' ||
    location.pathname === '/checkout';

  const menuPath = isOrderPortal ? '/order' : '/menu';

  const guestNavItems = [
    { label: 'MENU', path: menuPath, icon: UtensilsCrossed, isMenu: true },
    { label: 'OFFERS', path: '/offers', icon: Tag, isMenu: false },
  ];

  const loggedInNavItems = [
    { label: 'MENU', path: menuPath, icon: UtensilsCrossed, isMenu: true },
    { label: 'OFFERS', path: '/offers', icon: Tag, isMenu: false },
    { label: 'LOYALTY', path: '/loyalty', icon: Gift, isMenu: false },
    { label: 'MY ORDERS', path: '/orders', icon: Package, isMenu: false },
  ];

  const navItems = isLoggedIn ? loggedInNavItems : guestNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-lg md:hidden border-t border-[#1C1C1C]">
      <div className={`grid ${isLoggedIn ? 'grid-cols-4' : 'grid-cols-2'} items-center py-2.5 px-4 text-center`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => {
                const isItemActive = item.isMenu
                  ? location.pathname === '/order' || location.pathname === '/menu' || location.pathname.startsWith('/product')
                  : isActive;

                return `flex flex-col items-center gap-1 text-[10px] font-extrabold tracking-wider relative transition-colors ${
                  isItemActive ? 'text-[#FF5500]' : 'text-[#9CA3AF] hover:text-white'
                }`;
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="uppercase">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
