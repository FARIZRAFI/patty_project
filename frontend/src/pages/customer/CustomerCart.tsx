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
    <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20 text-[#F5F5F5]">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#1C1C1C]">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">
            Your Cart
          </h1>
          <p className="text-sm text-[#A1A1AA] font-normal mt-1">
            Review your selected items and options before checkout.
          </p>
        </div>

        <Link
          to="/order"
          className="flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-[#F5F5F5] font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF5A00] group-hover:-translate-x-1 transition-transform" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-10 sm:p-14 text-center space-y-5 max-w-md mx-auto my-12 shadow-xl">
          <div className="w-14 h-14 rounded-lg bg-[#151515] border border-[#242424] flex items-center justify-center text-[#FF5A00] mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold text-[#F5F5F5]">Your cart is empty</h2>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Looks like you haven't added any items to your cart yet.
            </p>
          </div>
          <Link
            to="/order"
            className="inline-flex h-11 items-center justify-center bg-[#FF5A00] hover:bg-[#E84F00] text-white px-6 rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        /* 2-Column Main Desktop Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Cart Items List */}
          <div className="lg:col-span-7 space-y-3.5">
            {items.map((item, idx) => {
              const displayImg = item.product.image_url || '/placeholder-burger.svg';

              return (
                <div
                  key={idx}
                  className="bg-[#0D0D0D] border border-[#242424] hover:border-[#333333] rounded-[10px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  {/* Product Image & Info Container */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <img
                      src={displayImg}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                      }}
                      className="w-20 h-20 object-cover rounded-lg border border-[#1C1C1C] shrink-0 bg-[#111111]"
                    />

                    {/* Product Details & Selected Modifiers */}
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-semibold text-[#F5F5F5] text-base truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#FF5A00]">
                        £{item.product.base_price.toFixed(2)}
                      </p>

                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="pt-1 space-y-0.5">
                          <span className="text-[11px] font-medium text-[#71717A] block">
                            Add-ons:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.selectedModifiers.map((mod, i) => (
                              <span
                                key={i}
                                className="text-xs bg-[#151515] border border-[#242424] text-[#A1A1AA] px-2 py-0.5 rounded font-normal"
                              >
                                {mod.name} (+£{mod.price.toFixed(2)})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls, Line Total & Remove Action */}
                  <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                    {/* Quantity Control (Height 36px, 8px Radius) */}
                    <div className="flex items-center bg-[#151515] border border-[#242424] rounded-lg h-9 px-1 text-[#F5F5F5]">
                      <button
                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F5F5] rounded transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-2.5 font-semibold text-xs min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F5F5] rounded transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[65px]">
                      <p className="font-semibold text-[#F5F5F5] text-base">
                        £{item.lineTotal.toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      onClick={() => removeItem(idx)}
                      title="Remove item"
                      aria-label="Remove item"
                      className="p-2 text-[#71717A] hover:text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Promo Code & Order Summary Cards */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            
            {/* Promo Code Card */}
            <div className="bg-[#0D0D0D] border border-[#242424] p-5 rounded-[10px] space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF5A00]" />
                <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                  Promo Code
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 h-10 bg-[#151515] border border-[#242424] rounded-lg px-3 text-xs text-[#F5F5F5] uppercase placeholder-[#71717A] focus:outline-none focus:border-[#FF5A00] transition-colors"
                />
                <button
                  onClick={handleApplyPromo}
                  className="h-10 px-4 bg-[#151515] border border-[#242424] hover:border-[#FF5A00] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>

              {promoMsg && (
                <p className="text-xs text-[#FF5A00] font-medium">{promoMsg}</p>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#0D0D0D] border border-[#242424] p-6 rounded-[10px] space-y-4">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm text-[#A1A1AA]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F5F5F5] font-medium">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span className="text-[#F5F5F5] font-medium">£{delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span className="text-[#F5F5F5] font-medium">£{service.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#22C55E] font-medium">
                    <span>Discount ({couponCode})</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3.5 border-t border-[#242424] flex items-center justify-between">
                <span className="text-base font-semibold text-[#F5F5F5]">Total</span>
                <span className="text-xl font-bold text-[#FF5A00]">£{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full h-12 bg-[#FF5A00] hover:bg-[#E84F00] text-white text-sm font-semibold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/50"
              >
                <span>Proceed to checkout</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
