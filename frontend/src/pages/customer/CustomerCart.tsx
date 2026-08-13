import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Tag, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { api } from '../../api/client';

export const CustomerCart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    applyCoupon,
    couponCode,
    discountAmount,
    getSubtotal,
    getDeliveryFee,
    getServiceFee,
    getTotal
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = async () => {
    setPromoMsg('');
    try {
      const subtotal = getSubtotal();
      const res: any = await api.get(`/promotions/validate?code=${promoInput}&subtotal=${subtotal}`);
      applyCoupon(res.code, res.calculated_discount);
      setPromoMsg(res.message);
    } catch (err: any) {
      setPromoMsg(err.message || 'Invalid promo code');
    }
  };

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const service = getServiceFee();
  const total = getTotal();

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-8 pb-24 text-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#1A1A1A]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-hero tracking-tight">
            YOUR CART
          </h1>
          <p className="text-sm text-[#9CA3AF] font-medium mt-1">
            Review your selected items and options before checkout.
          </p>
        </div>

        <Link
          to="/menu"
          className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white font-semibold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF5500] group-hover:-translate-x-1 transition-transform" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-[#101010] border border-[#1F1F1F] rounded-3xl p-12 sm:p-16 text-center space-y-6 max-w-xl mx-auto shadow-2xl my-12">
          <div className="w-16 h-16 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Your cart is currently empty</h2>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Looks like you haven't added any burgers or sides to your order yet.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-block bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-xl shadow-[#FF5500]/30 transition-all hover:scale-[1.02]"
          >
            BROWSE MENU
          </Link>
        </div>
      ) : (
        /* 2-Column Main Desktop Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Cart Items List (~66% Width) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item, idx) => {
              const displayImg = item.product.image_url || '/placeholder-burger.svg';

              return (
                <div
                  key={idx}
                  className="bg-[#101010] border border-[#1F1F1F] hover:border-[#FF5500]/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl transition-all"
                >
                  {/* Product Image */}
                  <img
                    src={displayImg}
                    alt={item.product.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                    }}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-[#262626] shrink-0 bg-[#090909]"
                  />

                  {/* Product Details & Selected Add-ons */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="font-extrabold text-white text-base sm:text-lg truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#FF5500]">
                      Base price: £{item.product.base_price.toFixed(2)}
                    </p>

                    {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                          Selected Add-ons:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.selectedModifiers.map((mod, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-[#1A1A1A] border border-[#262626] text-[#D1D5DB] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5"
                            >
                              <span className="text-[#FF5500]">•</span>
                              <span>{mod.name} (+£{mod.price.toFixed(2)})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls, Line Total & Delete Button */}
                  <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center shrink-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#161616] border border-[#262626] rounded-xl px-3 py-1.5 text-white shadow-inner font-bold">
                      <button
                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                        className="text-base font-bold px-2 text-[#9CA3AF] hover:text-white cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-3 font-extrabold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        className="text-base font-bold px-2 text-[#9CA3AF] hover:text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[70px]">
                      <p className="font-black text-white text-base sm:text-lg">
                        £{item.lineTotal.toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeItem(idx)}
                      title="Remove item"
                      className="p-2 text-[#6B7280] hover:text-[#EF4444] rounded-xl hover:bg-[#1A1A1A] transition-all cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Promo Code & Order Summary Cards (~34% Width) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo Code Input Card */}
            <div className="bg-[#101010] border border-[#1F1F1F] p-5 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF5500]" />
                <h3 className="text-xs font-extrabold text-white tracking-widest uppercase">
                  PROMO CODE
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. WELCOME10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-[#161616] border border-[#262626] rounded-xl py-2.5 px-3 text-xs text-white uppercase placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-md shadow-[#FF5500]/20 cursor-pointer"
                >
                  APPLY
                </button>
              </div>

              {promoMsg && (
                <p className="text-[11px] text-[#FF5500] font-semibold">{promoMsg}</p>
              )}
            </div>

            {/* Order Summary Card matching Screenshot 2 */}
            <div className="bg-[#101010] border border-[#1F1F1F] p-6 rounded-3xl space-y-4 shadow-2xl">
              <h3 className="text-xs font-extrabold text-[#9CA3AF] tracking-widest uppercase">
                ORDER SUMMARY
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#9CA3AF]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (2 Mile Radius)</span>
                  <span className="text-white font-bold">£{delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="text-white font-bold">£{service.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#10B981] font-bold">
                    <span>Discount ({couponCode})</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
                <span className="text-base font-extrabold text-white">Total</span>
                <span className="text-2xl font-black text-[#FF5500]">£{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-sm font-black uppercase tracking-wider py-4 rounded-2xl shadow-2xl shadow-[#FF5500]/30 transition-all hover:scale-[1.01] cursor-pointer mt-4 flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
