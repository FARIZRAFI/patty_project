import React, { useState } from 'react';
import { X, Ticket, Plus, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';

interface AdminCreateCouponModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminCreateCouponModal: React.FC<AdminCreateCouponModalProps> = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [couponType, setCouponType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<string>('10');
  const [minOrderValue, setMinOrderValue] = useState<string>('15');
  const [usageLimit, setUsageLimit] = useState<string>('1000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Coupon code is required.');
      return;
    }
    if (!name.trim()) {
      setError('Coupon name is required.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/promotions/coupons', {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        coupon_type: couponType,
        discount_value: couponType === 'FREE_SHIPPING' ? 0.0 : parseFloat(discountValue) || 0.0,
        min_order_value: parseFloat(minOrderValue) || 0.0,
        usage_limit: parseInt(usageLimit) || 1000,
        is_active: true
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#262626] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between bg-[#171717]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Create Coupon</h2>
              <p className="text-xs text-[#9CA3AF]">Add a new promo code or discount offer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-white p-2 hover:bg-[#262626] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 p-4 bg-[#2A1212] border border-[#EF4444]/40 text-[#EF4444] rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white uppercase font-mono font-bold focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">
                Coupon Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Special"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">
              Discount Type *
            </label>
            <select
              value={couponType}
              onChange={(e: any) => setCouponType(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
            >
              <option value="PERCENTAGE">Percentage (% OFF)</option>
              <option value="FIXED_AMOUNT">Fixed Amount (£ OFF)</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
            </select>
          </div>

          {couponType !== 'FREE_SHIPPING' && (
            <div>
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">
                Discount Value * {couponType === 'PERCENTAGE' ? '(%)' : '(£)'}
              </label>
              <input
                type="number"
                step="0.01"
                placeholder={couponType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 5.00'}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">
                Min. Order Value (£)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 15.00"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1F1F1F]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#262626] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FF5500]/30 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Coupon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
