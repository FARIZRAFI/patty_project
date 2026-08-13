import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowLeft, Download, Calendar, Plus } from 'lucide-react';
import { api } from '../../api/client';
import { Branch, Order } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const data: Branch[] = await api.get('/branches');
      setBranches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBranch = async (branch: Branch) => {
    setSelectedBranch(branch);
    try {
      const branchOrders: Order[] = await api.get(`/orders?branch_id=${branch.id}`);
      setOrders(branchOrders);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Dashboard</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">View and manage orders for each branch.</p>
        </div>
        <button className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#FF5500]/20">
          <Plus className="w-4 h-4" />
          <span>Create Branch</span>
        </button>
      </div>

      {/* Main Branch Summary Table */}
      {!selectedBranch ? (
        <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#1F1F1F]">
            <h2 className="text-lg font-bold text-white">All Branches Overview</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase text-xs font-semibold border-b border-[#262626]">
                <tr>
                  <th className="px-6 py-4">Branch Name</th>
                  <th className="px-6 py-4 text-center">Total Orders</th>
                  <th className="px-6 py-4 text-center">Completed Orders</th>
                  <th className="px-6 py-4 text-center">Cancelled Orders</th>
                  <th className="px-6 py-4 text-center">Pending Orders</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {branches.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => handleSelectBranch(b)}
                    className="hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#FF5500]/10 text-[#FF5500] font-bold flex items-center justify-center border border-[#FF5500]/30">
                        {b.code}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{b.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{b.postcode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-white">{b.code === 'LC' ? 512 : 342}</td>
                    <td className="px-6 py-4 text-center text-[#10B981] font-semibold">{b.code === 'LC' ? 462 : 308}</td>
                    <td className="px-6 py-4 text-center text-[#EF4444] font-semibold">{b.code === 'LC' ? 20 : 14}</td>
                    <td className="px-6 py-4 text-center text-[#FF5500] font-semibold">{b.code === 'LC' ? 30 : 20}</td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-[#6B7280] inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Branch Detail Order View */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedBranch(null)}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Branches</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-[#FF5500]/10 text-[#FF5500] font-bold text-lg flex items-center justify-center border border-[#FF5500]/30">
                {selectedBranch.code}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedBranch.name}</h2>
                <p className="text-[#9CA3AF] text-sm">512 Total Orders</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-[#1A1A1A] border border-[#262626] text-[#9CA3AF] hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>6 May 2025 - 6 May 2025</span>
              </button>
              <button className="bg-[#1A1A1A] border border-[#262626] text-[#9CA3AF] hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase text-xs font-semibold border-b border-[#262626]">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ordered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]">
                  {orders.length > 0 ? (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="px-6 py-4 font-bold text-[#FF5500]">{o.order_number}</td>
                        <td className="px-6 py-4 text-white font-medium">{o.customer_name}</td>
                        <td className="px-6 py-4 text-[#9CA3AF]">
                          {o.items.map((i) => `${i.product_name} (${i.quantity})`).join(', ') || 'Classic Beef Burger, French Fries'}
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">£{o.total_amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              o.status === 'PREPARING'
                                ? 'bg-[#FF5500]/10 text-[#FF5500] border-[#FF5500]/30'
                                : o.status === 'DELIVERED'
                                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                                : 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#9CA3AF]">{o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:15 AM'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#6B7280]">
                        No orders recorded for this branch yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
