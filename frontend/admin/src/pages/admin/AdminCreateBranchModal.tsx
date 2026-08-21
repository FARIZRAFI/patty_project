import React, { useState } from 'react';
import { X, Building, Plus } from 'lucide-react';
import { api } from '../../api/client';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminCreateBranchModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('London');
  const [phone, setPhone] = useState('020 7946 0000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !addressLine1.trim() || !postcode.trim()) {
      setError('Please fill in Branch Name, Address, and Postcode.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/branches', {
        name: name.trim(),
        code: code.trim().toUpperCase() || name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
        address_line1: addressLine1.trim(),
        postcode: postcode.trim(),
        city: city.trim() || 'London',
        phone: phone.trim() || '020 7946 0000',
        delivery_radius_miles: 2.0,
        delivery_enabled: true,
        collection_enabled: true,
        ordering_enabled: true,
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create branch. Please check address/postcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-xl text-[#FF5500]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Branch</h2>
              <p className="text-xs text-[#9CA3AF]">Add a new location branch to system</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-white rounded-xl hover:bg-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#2A1215] border border-[#EF4444]/40 text-[#FCA5A5] rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Branch Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. London - Camden"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Branch Code (Optional)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. LC, LW"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Address Line 1 *</label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="e.g. 42 Camden High Street"
              className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Postcode *</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. NW1 8NH"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="London"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="020 7946 0000"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Delivery Radius (Miles)</label>
              <input
                type="number"
                value="2.0"
                disabled
                className="w-full bg-[#1A1A1A] border border-[#262626] opacity-70 cursor-not-allowed rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
              />
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Fixed at 2.0 miles (Business Rule)</p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 mt-6 border-t border-[#262626] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#262626] text-white rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#FF5500]/20 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Branch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
