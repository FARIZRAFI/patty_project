import React, { useState } from 'react';
import { X, User, MapPin, CreditCard, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../api/client';

interface Props {
  order: Order;
  onClose: () => void;
  onUpdateStatus: () => void;
}

export const AdminOrderDetailsModal: React.FC<Props> = ({ order, onClose, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: selectedStatus });
      onUpdateStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setLoading(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: 'CANCELLED', notes: 'Order cancelled by Admin' });
      onUpdateStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#262626] mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Order Details <span className="text-[#FF5500]">{order.order_number}</span></h2>
            <span className="px-3 py-1 bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/30 rounded-full text-xs font-bold">
              {order.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-white rounded-xl hover:bg-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card 1: Order Info */}
          <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#FF5500] font-semibold mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Order Information</span>
            </div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Order ID</span><span className="text-white font-bold">{order.order_number}</span></div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Order Type</span><span className="text-white">{order.order_type}</span></div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Payment Method</span><span className="text-white">{order.payment_method}</span></div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Payment Status</span><span className="text-[#10B981] font-semibold">{order.payment_status}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t border-[#262626]"><span className="text-white">Total Amount</span><span className="text-[#FF5500] text-sm">£{order.total_amount.toFixed(2)}</span></div>
          </div>

          {/* Card 2: Customer Info */}
          <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#FF5500] font-semibold mb-2">
              <User className="w-4 h-4" />
              <span>Customer Information</span>
            </div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Name</span><span className="text-white font-semibold">{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Phone</span><span className="text-white">{order.customer_phone}</span></div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Email</span><span className="text-white truncate max-w-[150px]">{order.customer_email}</span></div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Loyalty Points</span><span className="text-[#FF5500] font-bold">150 Points</span></div>
          </div>

          {/* Card 3: Delivery Address */}
          <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#FF5500] font-semibold mb-2">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address</span>
            </div>
            <p className="text-white font-medium">{order.delivery_address?.address_line1 || '123 Baker Street'}</p>
            <p className="text-[#9CA3AF]">{order.delivery_address?.postcode || 'London W1U 6EP, United Kingdom'}</p>
            <p className="text-xs text-[#FF5500] mt-2 font-medium">Instructions: {order.delivery_instructions || 'Leave at the door'}</p>
          </div>
        </div>

        {/* Bottom Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Ordered Items Table */}
          <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ordered Items</h3>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs pb-3 border-b border-[#262626] last:border-0">
                    <div>
                      <p className="font-semibold text-white">{item.product_name}</p>
                      <p className="text-[10px] text-[#9CA3AF]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-white">£{item.total_price.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-white space-y-2">
                  <div className="flex justify-between"><span>Classic Beef Burger (No onion, extra cheese)</span><span>£8.99</span></div>
                  <div className="flex justify-between"><span>French Fries (Regular)</span><span>£2.49</span></div>
                  <div className="flex justify-between"><span>Coca Cola 500ml x 2</span><span>£3.18</span></div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#262626] space-y-1.5 text-xs text-[#9CA3AF]">
              <div className="flex justify-between"><span>Subtotal</span><span>£{order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span>£{order.delivery_fee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Service Fee</span><span>£{order.service_fee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#262626]">
                <span>Total Amount</span>
                <span className="text-[#FF5500]">£{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Status Control */}
          <div className="space-y-4">
            <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-3 text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Payment Details</h3>
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Method</span><span className="text-white font-semibold">Online Card VISA</span></div>
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Transaction ID</span><span className="text-white font-mono">{order.payment_transaction_id || 'TXN4789632145'}</span></div>
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Paid On</span><span className="text-white">6 May 2025, 10:23 AM</span></div>
            </div>

            {/* Update Order Status Controls */}
            <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Update Order Status</h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#121212] border border-[#262626] text-white text-xs font-semibold p-3 rounded-xl focus:outline-none focus:border-[#FF5500]"
              >
                <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="READY">READY</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>

              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-[#FF5500]/20"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>

              <button
                onClick={handleCancelOrder}
                className="w-full border border-[#EF4444]/40 hover:bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
