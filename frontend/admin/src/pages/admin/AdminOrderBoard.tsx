import React, { useEffect, useState } from 'react';
import { Search, Bell, Calendar, RefreshCw, Eye, Edit, MoreVertical, Truck, ShoppingBag, ChefHat, ClipboardCheck, XCircle } from 'lucide-react';
import { api } from '../../api/client';
import { Order } from '../../types';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';

export const AdminOrderBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterBranch, setFilterBranch] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterBranch, filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/orders';
      const params = [];
      if (filterBranch !== 'ALL') params.push(`branch_id=${filterBranch}`);
      if (filterStatus !== 'ALL') params.push(`status=${filterStatus}`);
      if (params.length) url += `?${params.join('&')}`;

      const data: Order[] = await api.get(url);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter local search
  const filteredOrders = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Order Management</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Manage and track all customer orders in real-time.</p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by order ID, customer name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <button className="relative bg-[#1A1A1A] border border-[#262626] p-2.5 rounded-xl text-[#9CA3AF] hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5500] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              8
            </span>
          </button>

          <button className="bg-[#1A1A1A] border border-[#262626] px-3.5 py-2 rounded-xl text-xs font-medium text-[#9CA3AF] hover:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>6 May 2025</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row (Matching Page 3 of Admin PDF) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Pending</p>
            <h3 className="text-xl font-bold text-white mt-0.5">12</h3>
            <p className="text-[10px] text-[#6B7280]">Awaiting acceptance</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Preparing</p>
            <h3 className="text-xl font-bold text-white mt-0.5">18</h3>
            <p className="text-[10px] text-[#6B7280]">Being prepared</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Ready</p>
            <h3 className="text-xl font-bold text-white mt-0.5">7</h3>
            <p className="text-[10px] text-[#6B7280]">Ready for pickup/delivery</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Delivered</p>
            <h3 className="text-xl font-bold text-white mt-0.5">178</h3>
            <p className="text-[10px] text-[#6B7280]">Completed orders</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Cancelled</p>
            <h3 className="text-xl font-bold text-white mt-0.5">13</h3>
            <p className="text-[10px] text-[#6B7280]">Cancelled orders</p>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121212] border border-[#262626] p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="bg-[#1A1A1A] border border-[#262626] text-white text-xs font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#FF5500]"
          >
            <option value="ALL">All Branches</option>
            <option value="LC">London - Central</option>
            <option value="LW">London - Westfield</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1A1A1A] border border-[#262626] text-white text-xs font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#FF5500]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#FF5500]/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase font-semibold border-b border-[#262626]">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-5 py-4 font-bold text-[#FF5500]">{o.order_number}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{o.customer_name}</p>
                    <p className="text-[10px] text-[#6B7280]">{o.customer_phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-white font-medium">
                      {o.order_type === 'DELIVERY' ? <Truck className="w-3.5 h-3.5 text-[#10B981]" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                      <span>{o.order_type}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#9CA3AF]">
                    {o.items.length > 0 ? `${o.items.length} Items` : '2 Items'}
                  </td>
                  <td className="px-5 py-4 font-bold text-white">£{o.total_amount.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                      Paid
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#9CA3AF]">
                    {o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:45 AM'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        o.status === 'PREPARING'
                          ? 'bg-[#FF5500]/10 text-[#FF5500] border-[#FF5500]/30'
                          : o.status === 'READY'
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                          : o.status === 'DELIVERED'
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30'
                          : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 bg-[#1A1A1A] hover:bg-[#262626] rounded-lg text-[#9CA3AF] hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal Trigger */}
      {selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={() => {
            fetchOrders();
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};
