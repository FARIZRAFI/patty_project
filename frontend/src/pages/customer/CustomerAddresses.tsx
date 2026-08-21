import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, Heart, Plus, Edit2, Trash2, MapPin, CheckCircle, X, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { CustomerAddress } from '../../types/address';

export const CustomerAddresses: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);

  // Form State
  const [label, setLabel] = useState('Home');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<CustomerAddress[]>('/addresses');
      setAddresses(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load saved addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [user, navigate, fetchAddresses]);

  const openAddModal = () => {
    setEditingAddress(null);
    setLabel('Home');
    setAddressLine1('');
    setAddressLine2('');
    setCity('London');
    setPostcode('');
    setPhone(user?.phone || '');
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setLabel(addr.label || 'Home');
    setAddressLine1(addr.address_line1 || '');
    setAddressLine2(addr.address_line2 || '');
    setCity(addr.city || 'London');
    setPostcode(addr.postcode || '');
    setPhone(addr.phone || '');
    setIsDefault(addr.is_default);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1.trim() || !postcode.trim()) {
      setError('Please fill in Address Line 1 and Postcode.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      label,
      address_line1: addressLine1.trim(),
      address_line2: addressLine2.trim() || undefined,
      city: city.trim() || 'London',
      postcode: postcode.trim().toUpperCase(),
      phone: phone.trim() || undefined,
      is_default: isDefault,
    };

    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.id}`, payload);
      } else {
        await api.post('/addresses', payload);
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (err: any) {
      setError(err?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await api.patch(`/addresses/${addressId}/default`, {});
      fetchAddresses();
    } catch (err: any) {
      setError(err?.message || 'Failed to update default address');
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${addressId}`);

      fetchAddresses();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete address');
    }
  };

  const getLabelIcon = (labelName: string) => {
    const l = labelName.toLowerCase();
    if (l.includes('work') || l.includes('office')) return <Briefcase className="w-5 h-5 text-[#FF5500]" />;
    if (l.includes('other')) return <Heart className="w-5 h-5 text-[#FF5500]" />;
    return <Home className="w-5 h-5 text-[#FF5500]" />;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-10 pb-28 text-white min-h-[85vh] flex flex-col justify-between">
      <div>
        {/* Top Header Row matching Reference Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">My Addresses</h1>
            <p className="text-sm text-[#9CA3AF] mt-1 font-medium">Manage your delivery addresses</p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#FF5500]/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Saved Addresses Section Title */}
        <div className="mb-6">
          <h2 className="text-base font-extrabold tracking-wide text-white">Saved Addresses</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#2A1215] border border-[#EF4444]/40 rounded-xl flex items-center gap-3 text-xs text-[#FCA5A5]">
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-[#121212] border border-[#222222] rounded-2xl p-6" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#282828]">
              <MapPin className="w-8 h-8 text-[#FF5500]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Saved Addresses</h3>
            <p className="text-xs text-[#9CA3AF] mb-6">
              Add your delivery addresses to enjoy 1-click checkout on your loyalty account.
            </p>
            <button
              onClick={openAddModal}
              className="bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              Add First Address
            </button>
          </div>
        ) : (
          /* Address Cards Grid matching Reference Screenshot */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => {
              const isSelected = addr.is_default;
              return (
                <div
                  key={addr.id}
                  className={`relative bg-[#121212] rounded-2xl p-6 border transition-all flex flex-col justify-between h-full group ${
                    isSelected
                      ? 'border-[#FF5500] shadow-lg shadow-[#FF5500]/10'
                      : 'border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div>
                    {/* Top Row: Default Badge & Radio Selector */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        {addr.is_default && (
                          <span className="bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      {/* Radio Indicator matching Screenshot */}
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        title={isSelected ? 'Default Address' : 'Set as default'}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-[#FF5500]' : 'border-[#444444] hover:border-[#FF5500]'
                          }`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />}
                        </div>
                      </button>
                    </div>

                    {/* Card Content Row: Icon + Label & Address */}
                    <div className="flex items-start gap-4">
                      {/* Left Label Icon Container */}
                      <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#282828] flex items-center justify-center shrink-0">
                        {getLabelIcon(addr.label)}
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-extrabold text-white mb-1.5">{addr.label}</h3>
                        <p className="text-xs text-[#9CA3AF] leading-relaxed break-words">
                          {addr.address_line1}
                          {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                          {`, ${addr.city}, ${addr.postcode}, United Kingdom`}
                        </p>
                        {addr.phone && (
                          <p className="text-xs font-semibold text-[#FF5500] mt-3">{addr.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Bottom Row */}
                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#1C1C1C]">
                    <button
                      onClick={() => openEditModal(addr)}
                      title="Edit Address"
                      className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 text-[#FF5500]" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      title="Delete Address"
                      className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#1C1C1C] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Banner at Bottom matching Reference Screenshot */}
      {showInfoBanner && (
        <div className="mt-12 bg-[#121212] border border-[#222222] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#282828] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#FF5500]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">Set a default address</h4>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Your default address will be used for faster checkout.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInfoBanner(false)}
            className="w-full sm:w-auto border border-[#FF5500] text-[#FF5500] hover:bg-[#FF5500]/10 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
          >
            Got it
          </button>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-fadeIn relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-white mb-1">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-6">
              Enter your delivery address details for quick checkout.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Address Label Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-2">Address Type / Label</label>
                <div className="flex gap-3">
                  {['Home', 'Work', 'Other'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLabel(l)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        label === l
                          ? 'bg-[#FF5500]/20 border-[#FF5500] text-[#FF5500]'
                          : 'bg-[#181818] border-[#282828] text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. 21 Baker Street, Marylebone"
                  className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="e.g. Flat 5, Floor 2"
                  className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none"
                />
              </div>

              {/* City & Postcode Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="London"
                    className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Postcode *</label>
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="e.g. NW1 6XE"
                    className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none"
                />
              </div>

              {/* Is Default Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs text-[#D1D5DB] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5500] rounded border-[#282828] bg-[#181818] cursor-pointer"
                  />
                  <span>Set as my default delivery address</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-[#9CA3AF] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#FF5500]/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
