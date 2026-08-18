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
  const [deliveryRadius, setDeliveryRadius] = useState('2.0');
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
        latitude: 51.5074,
        longitude: -0.1278,
        delivery_radius_miles: parseFloat(deliveryRadius || '2.0'),
        delivery_enabled: true,
        collection_enabled: true,
        ordering_enabled: true,
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create branch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl w-full max-w-md shadow-2xl p-6 relative text-[#F5F5F5] animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#241209] border border-[#6B2A0D] flex items-center justify-center text-[#FF5A00] shrink-0">
              <Building className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F5F5F5]">Create New Branch</h2>
              <p className="text-xs text-[#A1A1AA]">Add a new location branch to system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Branch Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. London - Camden"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Branch Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. LC, LW"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Address Line 1 *</label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="e.g. 42 Camden High Street"
              className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Postcode *</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. NW1 8NH"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="London"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="020 7946 0000"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Delivery Radius (Miles)</label>
              <input
                type="number"
                step="0.5"
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(e.target.value)}
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3 text-xs text-[#F5F5F5] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 mt-5 border-t border-[#1C1C1C] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-[#151515] border border-[#242424] hover:border-[#333333] text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 px-4 bg-[#FF5A00] hover:bg-[#E84F00] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
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
