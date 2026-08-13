import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, Tag, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const MobileBottomNav: React.FC = () => {
  const { items } = useCartStore();
  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'MENU', path: '/menu', icon: UtensilsCrossed },
    { label: 'OFFERS', path: '/offers', icon: Tag },
    { label: 'CART', path: '/cart', icon: ShoppingBag, badge: totalCartCount },
    { label: 'PROFILE', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-lg border-t border-[#1F1F1F] md:hidden">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] font-bold tracking-wider relative transition-colors ${
                  isActive ? 'text-[#FF5500]' : 'text-[#6B7280] hover:text-white'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF5500] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
