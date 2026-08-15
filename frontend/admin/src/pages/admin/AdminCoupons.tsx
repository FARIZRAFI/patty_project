import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../../api/client';
import { AdminCreateCouponModal } from './AdminCreateCouponModal';

interface CouponItem {
  id: string;
  code: string;
  name: string;
  coupon_type: string;
  discount_value: number;
  min_order_value: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  created_at?: string;
}

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/promotions/coupons');
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/promotions/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert('Failed to delete coupon.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Coupons & Offers</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Create, manage and track all discounts and offers</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="p-2.5 bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
            title="Refresh Coupons"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#FF5500]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Search by coupon code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5500]"
        />
      </div>

      {/* Coupons Table */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase font-semibold border-b border-[#262626]">
            <tr>
              <th className="px-5 py-3.5">Coupon Code</th>
              <th className="px-5 py-3.5">Coupon Name</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Discount</th>
              <th className="px-5 py-3.5">Min. Order</th>
              <th className="px-5 py-3.5">Usage</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F]">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[#9CA3AF]">
                  Loading coupons...
                </td>
              </tr>
            ) : filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[#9CA3AF]">
                  No coupons found. Click "+ Create Coupon" to add one!
                </td>
              </tr>
            ) : (
              filteredCoupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg font-mono font-bold">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">{c.name}</td>
                  <td className="px-5 py-4 text-[#9CA3AF]">
                    {c.coupon_type === 'PERCENTAGE' ? 'Percentage' : c.coupon_type === 'FIXED_AMOUNT' ? 'Fixed Amount' : 'Free Shipping'}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#FF5500]">
                    {c.coupon_type === 'PERCENTAGE' ? `${c.discount_value}% OFF` : c.coupon_type === 'FIXED_AMOUNT' ? `£${c.discount_value.toFixed(2)} OFF` : 'Free Delivery'}
                  </td>
                  <td className="px-5 py-4 font-medium text-white">£{c.min_order_value.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#9CA3AF]">
                        <span>{c.used_count} used</span>
                        <span>{c.usage_limit}</span>
                      </div>
                      <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FF5500] h-full rounded-full"
                          style={{ width: `${Math.min(100, (c.used_count / (c.usage_limit || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 rounded-full text-[10px] font-bold">
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      disabled={deletingId === c.id}
                      className="p-1.5 bg-[#2A1212] hover:bg-[#3D1A1A] text-[#EF4444] rounded-lg transition-colors border border-[#EF4444]/30 cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <AdminCreateCouponModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchCoupons}
        />
      )}
    </div>
  );
};
