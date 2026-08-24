import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const FloatingCartBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotal, isProductModalOpen } = useCartStore();

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = getTotal();

  // Pages where floating cart bar should never be shown (Landing page, Public menu, Cart, Checkout)
  const hideCartBarPages = ['/', '/menu', '/cart', '/checkout'];
  const isHidePage = hideCartBarPages.includes(location.pathname) || location.pathname.startsWith('/order-confirmation');

  const hideBottomNavPages = ['/', '/contact', '/select-location', '/menu', '/about', '/privacy', '/privacy-policy', '/offers'];
  const showBottomNav = !hideBottomNavPages.includes(location.pathname);

  // Hide completely when cart is empty, on landing/menu/cart/checkout pages, OR when Product Preview Modal is open!
  if (totalCount === 0 || isProductModalOpen || isHidePage) return null;

  return (
    <>
      {/* Mobile View Cart Bar: Pinned directly ABOVE bottom nav bar (or at bottom if no nav bar) */}
      <div
        className={`sm:hidden fixed left-0 right-0 z-40 bg-[#FF5500] text-white px-5 py-3.5 flex items-center justify-between shadow-2xl border-t border-[#FF7733]/40 cursor-pointer active:bg-[#E04B00] transition-all duration-200 ${
          showBottomNav ? 'bottom-[56px]' : 'bottom-0'
        }`}
      >
        <button
          onClick={() => navigate('/cart')}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 font-black text-sm text-white">
            <span>£{totalAmount.toFixed(2)}</span>
            <span className="opacity-60 font-normal">|</span>
            <span>{totalCount} {totalCount === 1 ? 'Item' : 'Items'}</span>
          </div>

          <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-white">
            <span>View Cart</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Desktop View Cart Bar: Floating pill */}
      <div className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-300">
        <button
          onClick={() => navigate('/cart')}
          className="bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-full px-6 py-3.5 shadow-2xl shadow-[#FF5500]/40 flex items-center gap-3.5 border border-[#FF7733]/50 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/20">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2 text-left">
            <span className="font-black text-sm sm:text-base tracking-wider uppercase font-hero">View Cart</span>
            <span className="text-xs sm:text-sm font-bold text-white/90 border-l border-white/30 pl-2.5">
              {totalCount} {totalCount === 1 ? 'Item' : 'Items'} | £{totalAmount.toFixed(2)}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform ml-1" />
        </button>
      </div>
    </>
  );
};
