import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ShoppingBag, MapPin, Clock, Lock, CheckCircle2, Building2, Plus, Star, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../api/client';

export const CustomerCheckout: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const { items, orderType, setOrderType, selectedBranch, getTotal, getSubtotal, getDeliveryFee, discountAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.full_name || 'John Smith');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'johnsmith@email.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+44 7123 456789');

  const [addressLine1, setAddressLine1] = useState('123 Baker Street');
  const [postcode, setPostcode] = useState('W1U 6EP');
  const [instructions, setInstructions] = useState('Leave at the door');
  const [deliveryTime, setDeliveryTime] = useState('As soon as possible (20 - 30 mins)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const total = getTotal();

  const handleCreateOrderAndPay = async () => {
    setError('');
    setLoading(true);
    try {
      if (!selectedBranch) {
        throw new Error('Please select a branch before checking out.');
      }

      // Step 1: Create Order
      const orderPayload = {
        branch_id: selectedBranch.id,
        order_type: orderType,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: orderType === 'DELIVERY' ? { address_line1: addressLine1, postcode, city: 'London' } : null,
        delivery_instructions: instructions,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          selected_modifiers: i.selectedModifiers.map((m) => ({ name: m.name, price: m.price }))
        }))
      };

      const newOrder: any = await api.post('/orders', orderPayload);

      // Step 2: Create Payment Session with Pluggable Gateway Provider
      await api.post(`/payments/create-session?order_id=${newOrder.id}`, {});

      // Simulate payment webhook success callback for mock adapter
      await api.post('/payments/webhook', {
        order_id: newOrder.id,
        status: 'SUCCESS'
      });

      clearCart();
      navigate(`/order-confirmation/${newOrder.order_number}`);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1450px] mx-auto px-6 sm:px-10 lg:px-12 py-8 pb-24 text-white">
      {/* Checkout Title & Stepper Bar matching Screenshot 2 */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-hero tracking-tight mb-6">
          Checkout
        </h1>

        {/* Stepper Header */}
        <div className="flex items-center gap-4 max-w-xl text-xs sm:text-sm font-bold">
          {/* Step 1 Pill */}
          <div className={`flex items-center gap-2.5 ${step >= 1 ? 'text-white' : 'text-[#6B7280]'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
              step >= 1 ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30' : 'bg-[#1A1A1A] text-[#6B7280]'
            }`}>
              1
            </span>
            <span className="font-bold">Delivery</span>
          </div>

          <div className="flex-1 h-[2px] bg-[#1A1A1A]" />

          {/* Step 2 Pill */}
          <div className={`flex items-center gap-2.5 ${step >= 2 ? 'text-white' : 'text-[#6B7280]'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
              step >= 2 ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30' : 'bg-[#1A1A1A] text-[#6B7280]'
            }`}>
              2
            </span>
            <span className="font-bold">Payment</span>
          </div>

          <div className="flex-1 h-[2px] bg-[#1A1A1A]" />

          {/* Step 3 Pill */}
          <div className="flex items-center gap-2.5 text-[#6B7280]">
            <span className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#6B7280] flex items-center justify-center text-xs font-black">
              3
            </span>
            <span className="font-bold">Confirm</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#2A1212] border border-[#EF4444]/40 text-[#EF4444] rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 2-Column Desktop Layout matching Screenshot 2 (~62% Left / ~38% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Stepper Details & Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {step === 1 ? (
            <>
              {/* Delivery Method Card matching Screenshot 2 */}
              <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-6 space-y-4 shadow-xl">
                <h2 className="text-xs font-black text-white uppercase tracking-widest">
                  Delivery Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Option */}
                  <div
                    onClick={() => setOrderType('DELIVERY')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      orderType === 'DELIVERY'
                        ? 'bg-[#FF5500]/10 border-[#FF5500] text-white shadow-md shadow-[#FF5500]/20'
                        : 'bg-[#141414] border-[#222222] text-[#9CA3AF] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-white">Delivery</p>
                        <p className="text-[11px] text-[#9CA3AF]">Free delivery within 2 miles</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      orderType === 'DELIVERY' ? 'border-[#FF5500]' : 'border-[#444444]'
                    }`}>
                      {orderType === 'DELIVERY' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />}
                    </div>
                  </div>

                  {/* Collection Option */}
                  <div
                    onClick={() => setOrderType('COLLECTION')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      orderType === 'COLLECTION'
                        ? 'bg-[#FF5500]/10 border-[#FF5500] text-white shadow-md shadow-[#FF5500]/20'
                        : 'bg-[#141414] border-[#222222] text-[#9CA3AF] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-white">Collection</p>
                        <p className="text-[11px] text-[#9CA3AF]">Pick up from our store</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      orderType === 'COLLECTION' ? 'border-[#FF5500]' : 'border-[#444444]'
                    }`}>
                      {orderType === 'COLLECTION' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Card matching Screenshot 2 */}
              {orderType === 'DELIVERY' && (
                <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest">
                      Delivery Address
                    </h2>
                  </div>

                  {/* Address Card */}
                  <div className="bg-[#141414] border border-[#222222] p-4 rounded-2xl relative flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-extrabold text-sm text-white">Home</p>
                        <span className="px-2 py-0.5 bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] rounded text-[10px] font-bold">
                          DEFAULT
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] font-medium">
                        {addressLine1}, London {postcode}
                      </p>
                    </div>
                  </div>

                  {/* Add / Edit Address Inputs */}
                  {showAddressForm ? (
                    <div className="space-y-3 pt-2">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full bg-[#141414] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                      />
                      <input
                        type="text"
                        placeholder="Postcode"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full bg-[#141414] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                      />
                      <input
                        type="text"
                        placeholder="Delivery Instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full bg-[#141414] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="w-full border border-dashed border-[#2A2A2A] hover:border-[#FF5500]/50 py-3 rounded-2xl text-xs font-bold text-[#FF5500] flex items-center justify-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Address</span>
                    </button>
                  )}
                </div>
              )}

              {/* Delivery Time Window Selector matching Screenshot 2 */}
              <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-6 space-y-3 shadow-xl">
                <h2 className="text-xs font-black text-white uppercase tracking-widest">
                  Delivery Time
                </h2>
                <div className="flex items-center gap-3 bg-[#141414] border border-[#222222] p-3.5 rounded-2xl">
                  <Clock className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="bg-transparent text-white text-xs font-bold w-full focus:outline-none cursor-pointer"
                  >
                    <option value="As soon as possible (20 - 30 mins)" className="bg-[#141414]">
                      As soon as possible (20 - 30 mins)
                    </option>
                    <option value="18:00 - 18:30" className="bg-[#141414]">18:00 - 18:30</option>
                    <option value="18:30 - 19:00" className="bg-[#141414]">18:30 - 19:00</option>
                  </select>
                  <span className="text-xs font-semibold text-[#FF5500] shrink-0">
                    20 - 30 mins
                  </span>
                </div>
              </div>

              {/* Continue to Payment CTA */}
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-sm font-black uppercase tracking-wider py-4 rounded-2xl shadow-2xl shadow-[#FF5500]/30 transition-all hover:scale-[1.01] cursor-pointer mt-4"
              >
                CONTINUE TO PAYMENT
              </button>
            </>
          ) : (
            /* STEP 2: PAYMENT METHOD */
            <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-6 space-y-5 shadow-2xl">
              <h2 className="text-xs font-black text-white uppercase tracking-widest">
                Payment Method
              </h2>

              <div className="p-4 rounded-2xl border border-[#FF5500] bg-[#FF5500]/10 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5500]/20 flex items-center justify-center text-[#FF5500]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-white">Client Payment Gateway</p>
                    <p className="text-[11px] text-[#9CA3AF]">Pay securely via our trusted payment partner</p>
                  </div>
                </div>
                <input type="radio" checked readOnly className="w-4 h-4 accent-[#FF5500]" />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>All payments are secure and encrypted</span>
              </div>

              <button
                onClick={handleCreateOrderAndPay}
                disabled={loading}
                className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-sm font-black uppercase tracking-wider py-4 rounded-2xl shadow-2xl shadow-[#FF5500]/30 transition-all hover:scale-[1.01] cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Processing...' : `PAY SECURELY • £${total.toFixed(2)}`}</span>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-xs text-[#FF5500] font-bold text-center hover:underline pt-2 cursor-pointer"
              >
                ← Back to Delivery
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Your Order Side Panel matching Screenshot 2 (~38% Width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-6 space-y-5 shadow-2xl">
            {/* Header with Edit Cart link */}
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-white font-hero">
                Your Order
              </h2>
              <Link
                to="/cart"
                className="text-xs font-semibold text-[#FF5500] hover:underline transition-all"
              >
                Edit Cart
              </Link>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-[#1A1A1A] max-h-[320px] overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const displayImg = item.product.image_url || '/placeholder-burger.svg';

                return (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <img
                      src={displayImg}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                      }}
                      className="w-14 h-14 object-cover rounded-xl border border-[#222222] bg-[#070707] shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-extrabold text-xs text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-[#9CA3AF] truncate">
                        {item.selectedModifiers && item.selectedModifiers.length > 0
                          ? item.selectedModifiers.map((m) => m.name).join(', ')
                          : 'No Add-ons'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#9CA3AF] mr-2">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-extrabold text-xs text-white">
                        £{item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Totals Summary */}
            <div className="pt-3 border-t border-[#1C1C1C] space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Subtotal</span>
                <span className="text-white font-bold">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Delivery (2 Miles)</span>
                <span className="text-white font-bold">£{delivery.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#10B981] font-bold">
                  <span>Discount</span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-2xl font-black text-[#FF5500]">£{total.toFixed(2)}</span>
            </div>

            {/* Loyalty Points Badge matching Screenshot 2 */}
            <div className="bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-bold py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-md">
              <Star className="w-3.5 h-3.5 fill-[#FF5500]" />
              <span>You'll earn {Math.round(total)} points on this order</span>
            </div>

            {/* Secure Checkout Notice matching Screenshot 2 */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#9CA3AF]">
              <ShieldCheck className="w-4 h-4 text-[#9CA3AF]" />
              <div>
                <p className="font-bold text-white">Secure Checkout</p>
                <p className="text-[10px] text-[#6B7280]">Your data is protected and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
