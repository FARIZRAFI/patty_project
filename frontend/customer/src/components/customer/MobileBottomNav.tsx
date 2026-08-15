import React from 'react';
import { NavLink } from 'react-router-dom';
import { UtensilsCrossed, Tag, Gift, Package } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const navItems = [
    { label: 'MENU', path: '/menu', icon: UtensilsCrossed },
    { label: 'OFFERS', path: '/offers', icon: Tag },
    { label: 'LOYALTY', path: '/loyalty', icon: Gift },
    { label: 'MY ORDERS', path: '/orders', icon: Package },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-4 items-center py-2 px-1 text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] font-extrabold tracking-wider relative transition-colors ${
                  isActive ? 'text-[#FF5500]' : 'text-[#9CA3AF] hover:text-white'
                }`
              }
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
