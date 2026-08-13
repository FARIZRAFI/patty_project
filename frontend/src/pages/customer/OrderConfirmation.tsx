import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, CreditCard, Phone, Mail, ChevronRight } from 'lucide-react';
import { api } from '../../api/client';
import { Order } from '../../types';

export const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      api.get<Order>(`/orders/${orderNumber}`).then(setOrder).catch(console.error);
    }
  }, [orderNumber]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-24 space-y-8 text-center">
      {/* Success Badge & Heading (Matching Page 8 of Customer PDF) */}
      <div className="space-y-3">
        <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-white">Thank You!</h1>
        <p className="text-base font-bold text-[#FF5500]">Your order has been placed.</p>
        <p className="text-xs text-[#9CA3AF]">Your order {orderNumber || '#PP12578'} has been confirmed and will be prepared as soon as possible.</p>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#121212] border border-[#262626] p-4 rounded-2xl shadow-xl text-xs">
        <div className="space-y-1">
          <p className="text-[10px] text-[#6B7280] uppercase font-bold">Order Number</p>
          <p className="font-bold text-[#FF5500]">{orderNumber || '#PP12578'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-[#6B7280] uppercase font-bold">Est. Delivery Time</p>
          <p className="font-bold text-white">20 - 30 mins</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-[#6B7280] uppercase font-bold">Delivery Address</p>
          <p className="font-semibold text-white truncate">123 Baker Street, London</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-[#6B7280] uppercase font-bold">Payment Method</p>
          <p className="font-bold text-[#FF5500]">Card Payment</p>
        </div>
      </div>

      {/* Support Contact Footer Card */}
      <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center justify-around text-xs text-[#9CA3AF]">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#FF5500]" />
          <div>
            <p className="text-[10px] text-[#6B7280]">Need help?</p>
            <p className="font-bold text-white">07417 521128</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#FF5500]" />
          <div>
            <p className="text-[10px] text-[#6B7280]">Email support</p>
            <p className="font-bold text-white">hellofoodychefs@gmail.com</p>
          </div>
        </div>
      </div>

      <Link
        to="/menu"
        className="inline-block bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5500]/25"
      >
        BACK TO MENU
      </Link>
    </div>
  );
};
