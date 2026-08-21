import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ShoppingBag, MapPin, Clock, Lock, CheckCircle2, Building2, Plus, Star, ShieldCheck, Check, AlertTriangle } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../api/client';
import { CustomerAddress } from '../../types/address';
import { CustomerCard } from '../../types/card';

export const CustomerCheckout: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const {
    items,
    orderType,
    setOrderType,
    selectedBranch,
    nearestBranchForCollection,
    isDeliveryEligible,
    deliveryDistanceMiles,
    userCoords,
    getTotal,
    getSubtotal,
    getDeliveryFee,
    discountAmount,
    clearCart
  } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [phoneDigits, setPhoneDigits] = useState('');

  const [doorNumber, setDoorNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [instructions, setInstructions] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('As soon as possible (20 - 30 mins)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Saved Addresses State for Logged-In Loyalty Customers
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Saved Cards State for Logged-In Loyalty Customers
  const [savedCards, setSavedCards] = useState<CustomerCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      api.get<CustomerAddress[]>('/addresses')
        .then((addrs) => {
          setSavedAddresses(addrs);
          if (addrs && addrs.length > 0) {
            const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
            selectSavedAddress(defaultAddr);
          }
        })
        .catch(() => {});

      api.get<CustomerCard[]>('/payment-methods/cards')
        .then((cardsList) => {
          setSavedCards(cardsList);
          if (cardsList && cardsList.length > 0) {
            const defaultCard = cardsList.find((c) => c.is_default) || cardsList[0];
            setSelectedCardId(defaultCard.id);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const selectSavedAddress = (addr: CustomerAddress) => {
    setSelectedAddressId(addr.id);
    setAddressLine1(addr.address_line1 || '');
    setAddressLine2(addr.address_line2 || '');
    setCity(addr.city || 'London');
    setPostcode(addr.postcode || '');
    if (addr.phone) {
      const cleanPhone = addr.phone.replace(/\D/g, '');
      if (cleanPhone.length >= 11) {
        setPhoneDigits(cleanPhone.slice(-11));
      }
    }
  };

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const total = getTotal();

  const handleContinueToPayment = () => {
    setError('');
    if (!customerName.trim()) {
      setError('Full Name is mandatory.');
      return;
    }
    if (!customerEmail.trim()) {
      setError('Email address is mandatory.');
      return;
    }
    if (orderType === 'DELIVERY') {
      if (!addressLine1.trim()) {
        setError('Address line 1 is mandatory (*).');
        return;
      }
      if (!postcode.trim()) {
        setError('Post code is mandatory (*).');
        return;
      }
    }
    if (phoneDigits.length !== 11) {
      setError('Phone number is mandatory (*) and must contain exactly 11 digits (e.g. 07123456789).');
      return;
    }
    setStep(2);
  };

  const handleCreateOrderAndPay = async () => {
    setError('');
    if (items.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }
    if (!selectedBranch) {
      setError('Please select a branch before checking out.');
      return;
    }

    const outOfStockItem = items.find((i) => i.product.is_available === false || (i.product.stock_quantity !== undefined && i.product.stock_quantity <= 0));
    if (outOfStockItem) {
      setError(`'${outOfStockItem.product.name}' is currently out of stock at ${selectedBranch.name}. Please remove it from your cart before proceeding.`);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Order
      const fullPhone = `+44 ${phoneDigits}`;
      const orderPayload = {
        branch_id: selectedBranch.id,
        order_type: orderType,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: fullPhone,
        delivery_address: orderType === 'DELIVERY' ? { door_number: doorNumber, address_line1: addressLine1, address_line2: addressLine2, city, postcode, country, latitude: userCoords?.lat, longitude: userCoords?.lng } : null,
        delivery_instructions: instructions,
        latitude: userCoords?.lat,
        longitude: userCoords?.lng,
        delivery_postcode: postcode,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          selected_modifiers: i.selectedModifiers.map((m) => ({ name: m.name, price: m.price }))
        }))
      };

      const newOrder: any = await api.post('/orders', orderPayload);

      // Step 2: Create Payment Session with Canonical Contract
      const idempotencyKey = `idemp_${newOrder.id}_${Date.now()}`;
      const sessionRes: any = await api.post(
        '/payments/create-session',
        {
          order_id: newOrder.id,
          payment_method_type: 'CARD'
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey
          }
        }
      );

      if (sessionRes && sessionRes.transaction_id) {
        navigate(`/mock-checkout/${sessionRes.transaction_id}`);
      } else if (sessionRes && sessionRes.payment_url) {
        navigate(sessionRes.payment_url);
      } else {
        clearCart();
        navigate(`/order-confirmation/${newOrder.order_number}`);
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.detail?.message || err?.response?.data?.detail || err?.message || '';
      if (typeof errMsg === 'string' && (errMsg.includes('2 MILES') || errMsg.includes('RADIUS') || errMsg.includes('DELIVERY_OUTSIDE_RADIUS'))) {
        setError('WE PROVIDE DELIVERY UP TO 2 MILES ONLY. Please choose Collection or enter an address within 2 miles.');
      } else {
        setError(typeof errMsg === 'string' && errMsg ? errMsg : 'Payment initiation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20 text-[#F5F5F5]">
      {/* Page Title & Stepper Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight mb-6">
          Checkout
        </h1>

        {/* Stepper Navigation */}
        <div className="flex items-center gap-3 max-w-lg text-xs font-medium">
          {/* Step 1 Pill */}
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#F5F5F5]' : 'text-[#71717A]'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              step > 1 ? 'bg-[#22C55E] text-white' : step === 1 ? 'bg-[#FF5A00] text-white shadow-sm' : 'bg-[#151515] border border-[#242424] text-[#71717A]'
            }`}>
              {step > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
            </span>
            <span className="font-semibold">Delivery</span>
          </div>

          <div className="flex-1 h-[1px] bg-[#242424]" />

          {/* Step 2 Pill */}
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#F5F5F5]' : 'text-[#71717A]'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              step === 2 ? 'bg-[#FF5A00] text-white shadow-sm' : 'bg-[#151515] border border-[#242424] text-[#71717A]'
            }`}>
              2
            </span>
            <span className="font-semibold">Payment</span>
          </div>

          <div className="flex-1 h-[1px] bg-[#242424]" />

          {/* Step 3 Pill */}
          <div className="flex items-center gap-2 text-[#71717A]">
            <span className="w-7 h-7 rounded-full bg-[#151515] border border-[#242424] text-[#71717A] flex items-center justify-center text-xs font-semibold">
              3
            </span>
            <span className="font-medium">Confirmation</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-lg text-xs font-medium">
          {error}
        </div>
      )}

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Form Controls & Details */}
        <div className="lg:col-span-7 space-y-5">
          {step === 1 ? (
            <>
              {/* Delivery Method Selector Card */}
              <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 sm:p-6 space-y-4">
                <h2 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                  Delivery Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Delivery Option */}
                  <div
                    onClick={() => {
                      if (isDeliveryEligible && (deliveryDistanceMiles === null || deliveryDistanceMiles <= 2.0)) {
                        setOrderType('DELIVERY');
                      }
                    }}
                    className={`p-4 rounded-lg border transition-all ${
                      isDeliveryEligible && (deliveryDistanceMiles === null || deliveryDistanceMiles <= 2.0)
                        ? orderType === 'DELIVERY'
                          ? 'bg-[#241209] border-[#6B2A0D] text-[#F5F5F5] cursor-pointer'
                          : 'bg-[#151515] border-[#242424] text-[#A1A1AA] hover:border-[#333333] cursor-pointer'
                        : 'bg-[#121212]/60 border-[#222222] opacity-50 cursor-not-allowed select-none'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isDeliveryEligible ? 'bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00]' : 'bg-[#1A1A1A] text-[#71717A]'
                        }`}>
                          <Truck className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#F5F5F5]">Delivery</p>
                          <p className="text-xs text-[#A1A1AA]">
                            {isDeliveryEligible ? 'Direct home delivery' : 'Unavailable'}
                          </p>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        orderType === 'DELIVERY' && isDeliveryEligible ? 'border-[#FF5A00]' : 'border-[#242424]'
                      }`}>
                        {orderType === 'DELIVERY' && isDeliveryEligible && <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />}
                      </div>
                    </div>

                    {(!isDeliveryEligible || (deliveryDistanceMiles !== null && deliveryDistanceMiles > 2.0)) && (
                      <div className="mt-2.5 pt-2 border-t border-[#222222]">
                        <span className="text-[10px] font-extrabold text-[#FF5500] uppercase tracking-wider block">
                          WE PROVIDE DELIVERY UP TO 2 MILES ONLY
                        </span>
                      </div>
                    )}
                  </div>


                  {/* Collection Option */}
                  <div
                    onClick={() => setOrderType('COLLECTION')}
                    className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      orderType === 'COLLECTION'
                        ? 'bg-[#241209] border-[#6B2A0D] text-[#F5F5F5]'
                        : 'bg-[#151515] border-[#242424] text-[#A1A1AA] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 flex items-center justify-center text-[#FF5A00] shrink-0">
                        <ShoppingBag className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#F5F5F5]">Collection</p>
                        <p className="text-xs text-[#A1A1AA]">Store pickup</p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      orderType === 'COLLECTION' ? 'border-[#FF5A00]' : 'border-[#242424]'
                    }`}>
                      {orderType === 'COLLECTION' && <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details Card */}
              <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#1C1C1C]">
                  <h2 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                    Contact Details
                  </h2>
                  <span className="text-xs text-[#71717A]">* Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                      Full Name <span className="text-[#FF5A00]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                      Email Address <span className="text-[#FF5A00]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. alex@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Card (for orderType === 'DELIVERY') */}
              {orderType === 'DELIVERY' && (
                <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C1C1C]">
                    <h2 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FF5A00]" />
                      <span>Delivery Address</span>
                    </h2>
                    <span className="text-xs text-[#71717A]">* Required</span>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {/* Saved Addresses Selector */}
                    {user && savedAddresses.length > 0 && (
                      <div className="mb-4 pb-4 border-b border-[#1C1C1C] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#FF5A00]">
                            Saved Addresses
                          </label>
                          <Link
                            to="/addresses"
                            className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] underline transition-colors"
                          >
                            Manage Addresses
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {savedAddresses.map((addr) => {
                            const isSelected = selectedAddressId === addr.id;
                            return (
                              <div
                                key={addr.id}
                                onClick={() => selectSavedAddress(addr)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-[#241209] border-[#6B2A0D] text-[#F5F5F5]'
                                    : 'bg-[#151515] border-[#242424] text-[#A1A1AA] hover:border-[#333333]'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-xs text-[#F5F5F5]">{addr.label}</span>
                                    {addr.is_default && (
                                      <span className="bg-[#FF5A00] text-white text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded">
                                        DEF
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-[#A1A1AA] truncate">
                                    {addr.address_line1}, {addr.postcode}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Door number & Address line 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          Door number
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Flat 4B"
                          value={doorNumber}
                          onChange={(e) => setDoorNumber(e.target.value)}
                          className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          Address line 1 <span className="text-[#FF5A00]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Street name & number"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Address line 2 */}
                    <div>
                      <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                        Address line 2
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Town/city & Post code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          Town / City
                        </label>
                        <input
                          type="text"
                          placeholder="London"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          Post code <span className="text-[#FF5A00]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. W1U 6EP"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Country & Phone number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                          Phone number <span className="text-[#FF5A00]">* (11 Digits)</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="h-11 px-3 bg-[#151515] border border-[#242424] rounded-lg flex items-center justify-center text-xs font-semibold text-[#FF5A00] shrink-0">
                            +44
                          </span>
                          <input
                            type="tel"
                            placeholder="07123456789"
                            maxLength={11}
                            value={phoneDigits}
                            onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Instructions */}
                    <div>
                      <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                        Delivery Instructions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Leave at door, ring doorbell"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Store Collection Details Card (for orderType === 'COLLECTION') */}
              {orderType === 'COLLECTION' && (
                <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C1C1C]">
                    <h2 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#FF5A00]" />
                      <span>Store Collection Details</span>
                    </h2>
                    <span className="bg-[#FF5A00]/10 border border-[#6B2A0D] text-[#FF5A00] text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                      Store Pickup
                    </span>
                  </div>

                  <div className="bg-[#151515] border border-[#242424] p-4 rounded-lg space-y-1">
                    <p className="text-sm font-semibold text-[#F5F5F5]">{selectedBranch?.name || 'Patty Project'}</p>
                    <p className="text-xs text-[#A1A1AA]">
                      {selectedBranch?.address_line1}, {selectedBranch?.city} {selectedBranch?.postcode}
                    </p>
                    <p className="text-xs text-[#FF5A00] font-medium pt-1">
                      Phone: {selectedBranch?.phone || '07417 521128'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                      Phone number <span className="text-[#FF5A00]">* (11 Digits)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="h-11 px-3 bg-[#151515] border border-[#242424] rounded-lg flex items-center justify-center text-xs font-semibold text-[#FF5A00] shrink-0">
                        +44
                      </span>
                      <input
                        type="tel"
                        placeholder="07123456789"
                        maxLength={11}
                        value={phoneDigits}
                        onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className="w-full h-11 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Time Window Selector Card */}
              <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 sm:p-6 space-y-3">
                <h2 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                  {orderType === 'COLLECTION' ? 'Estimated Collection Time' : 'Estimated Delivery Time'}
                </h2>
                <div className="flex items-center gap-3 bg-[#151515] border border-[#242424] p-3 rounded-lg">
                  <Clock className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="bg-transparent text-[#F5F5F5] text-xs font-medium w-full focus:outline-none cursor-pointer"
                  >
                    {orderType === 'COLLECTION' ? (
                      <>
                        <option value="Ready for pickup in 15 - 20 mins" className="bg-[#151515]">
                          Ready for pickup in 15 - 20 mins
                        </option>
                        <option value="Collect in 30 mins" className="bg-[#151515]">Collect in 30 mins</option>
                        <option value="Collect in 45 mins" className="bg-[#151515]">Collect in 45 mins</option>
                        <option value="Collect in 60 mins" className="bg-[#151515]">Collect in 60 mins</option>
                      </>
                    ) : (
                      <>
                        <option value="As soon as possible (20 - 30 mins)" className="bg-[#151515]">
                          As soon as possible (20 - 30 mins)
                        </option>
                        <option value="18:00 - 18:30" className="bg-[#151515]">18:00 - 18:30</option>
                        <option value="18:30 - 19:00" className="bg-[#151515]">18:30 - 19:00</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Continue to Payment Action CTA Button */}
              <button
                onClick={handleContinueToPayment}
                className="w-full h-12 bg-[#FF5A00] hover:bg-[#E84F00] text-white text-sm font-semibold rounded-lg shadow-lg transition-colors cursor-pointer mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/50"
              >
                Continue to Payment
              </button>
            </>
          ) : (
            /* STEP 2: PAYMENT METHOD */
            <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 sm:p-6 space-y-4">
              <h2 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                Payment Method
              </h2>

              <div className="p-4 rounded-lg border border-[#6B2A0D] bg-[#241209] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 flex items-center justify-center text-[#FF5A00]">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#F5F5F5]">Client Payment Gateway</p>
                    <p className="text-xs text-[#A1A1AA]">Pay securely via our trusted payment partner</p>
                  </div>
                </div>
                <input type="radio" checked readOnly className="w-4 h-4 accent-[#FF5A00]" />
              </div>

              {/* Saved Cards Selector for Logged-In Loyalty Customers */}
              {user && savedCards.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#FF5A00]">
                      Saved Payment Cards
                    </label>
                    <Link
                      to="/payment-methods"
                      className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] underline transition-colors"
                    >
                      Manage Cards
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {savedCards.map((card) => {
                      const isSelected = selectedCardId === card.id;
                      return (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCardId(card.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#241209] border-[#6B2A0D] text-[#F5F5F5]'
                              : 'bg-[#151515] border-[#242424] text-[#A1A1AA] hover:border-[#333333]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#151515] border border-[#242424] flex items-center justify-center font-bold text-[10px] text-[#F5F5F5] shrink-0">
                              {card.card_brand.slice(0, 4)}
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-[#F5F5F5]">{card.card_brand}</p>
                              <p className="text-xs font-mono text-[#A1A1AA]">
                                •••• •••• •••• {card.last4}
                              </p>
                            </div>
                          </div>

                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#FF5A00]' : 'border-[#242424]'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-[#22C55E] font-medium pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>All payments are secure and encrypted</span>
              </div>

              <button
                onClick={handleCreateOrderAndPay}
                disabled={loading}
                className="w-full h-12 bg-[#FF5A00] hover:bg-[#E84F00] text-white text-sm font-semibold rounded-lg shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Creating Payment...' : `Pay Securely • £${total.toFixed(2)}`}</span>
              </button>


              <button
                onClick={() => setStep(1)}
                className="w-full text-xs text-[#A1A1AA] hover:text-[#F5F5F5] text-center pt-1 cursor-pointer transition-colors"
              >
                ← Back to Delivery
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Your Order Side Panel (Sticky) */}
        <div className="lg:col-span-5 space-y-5 sticky top-24">
          <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-6 space-y-4">
            {/* Header with Edit Cart link */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">
                Your Order
              </h2>
              <Link
                to="/cart"
                className="text-xs font-medium text-[#FF5A00] hover:text-[#E84F00] transition-colors"
              >
                Edit Cart
              </Link>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-[#1C1C1C] max-h-[300px] overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const displayImg = item.product.image_url || '/placeholder-burger.svg';

                return (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <img
                      src={displayImg}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                      }}
                      className="w-12 h-12 object-cover rounded-lg border border-[#1C1C1C] bg-[#111111] shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-semibold text-xs text-[#F5F5F5] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-[#71717A] truncate">
                        {item.selectedModifiers && item.selectedModifiers.length > 0
                          ? item.selectedModifiers.map((m) => m.name).join(', ')
                          : 'No Add-ons'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-[#71717A] mr-2">
                        x{item.quantity}
                      </span>
                      <span className="font-semibold text-xs text-[#F5F5F5]">
                        £{item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Totals Summary */}
            <div className="pt-3 border-t border-[#1C1C1C] space-y-2.5 text-sm text-[#A1A1AA]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F5F5F5] font-medium">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span className="text-[#F5F5F5] font-medium">£{delivery.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#22C55E] font-medium">
                  <span>Discount</span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
              <span className="text-base font-semibold text-[#F5F5F5]">Total</span>
              <span className="text-xl font-bold text-[#FF5A00]">£{total.toFixed(2)}</span>
            </div>

            {/* Loyalty Points Badge */}
            <div className="bg-[#151515] border border-[#242424] text-[#A1A1AA] text-xs font-medium py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#FF5A00] text-[#FF5A00]" />
              <span>Earn <strong className="text-[#F5F5F5]">{Math.round(total)}</strong> loyalty points on this order</span>
            </div>

            {/* Secure Checkout Notice */}
            <div className="pt-1 flex items-center gap-2 text-xs text-[#71717A]">
              <ShieldCheck className="w-4 h-4 text-[#71717A]" />
              <span>Encrypted 256-bit SSL secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
