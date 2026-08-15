import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CreditCard, ChevronRight, X, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { CustomerCard } from '../../types/card';

export const CustomerPaymentMethods: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [cards, setCards] = useState<CustomerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CustomerCard | null>(null);

  // Form State
  const [cardBrand, setCardBrand] = useState('Mastercard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('08');
  const [expiryYear, setExpiryYear] = useState('27');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const data = await api.get<CustomerCard[]>('/payment-methods/cards');
      setCards(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load saved payment methods');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCard(null);
    setCardBrand('Mastercard');
    setCardNumber('');
    setCardholderName(user?.full_name || '');
    setExpiryMonth('08');
    setExpiryYear('27');
    setIsDefault(cards.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (card: CustomerCard) => {
    setEditingCard(card);
    setCardBrand(card.card_brand || 'Mastercard');
    setCardNumber(`•••• •••• •••• ${card.last4}`);
    setCardholderName(card.cardholder_name || user?.full_name || '');
    setExpiryMonth(card.expiry_month || '08');
    setExpiryYear(card.expiry_year || '27');
    setIsDefault(card.is_default);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardholderName.trim()) {
      setError('Please enter the cardholder name.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingCard) {
        await api.put(`/payment-methods/cards/${editingCard.id}`, {
          card_brand: cardBrand,
          cardholder_name: cardholderName.trim(),
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          is_default: isDefault,
        });
      } else {
        await api.post('/payment-methods/cards', {
          card_brand: cardBrand,
          card_number: cardNumber.trim() || '4242',
          cardholder_name: cardholderName.trim(),
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          is_default: isDefault,
        });
      }
      setIsModalOpen(false);
      fetchCards();
    } catch (err: any) {
      setError(err?.message || 'Failed to save payment card');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      await api.patch(`/payment-methods/cards/${cardId}/default`, {});
      fetchCards();
    } catch (err: any) {
      setError(err?.message || 'Failed to update default card');
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!window.confirm('Are you sure you want to remove this saved card?')) return;
    try {
      await api.delete(`/payment-methods/cards/${cardId}`);
      fetchCards();
    } catch (err: any) {
      setError(err?.message || 'Failed to remove saved card');
    }
  };

  // Render Brand Badge/Logo strictly matching Reference Screenshot
  const renderBrandLogo = (brand: string) => {
    const b = brand.toLowerCase();
    if (b.includes('visa')) {
      return (
        <div className="w-12 h-12 rounded-full bg-[#0A2540] flex items-center justify-center font-black italic text-white text-base tracking-wider shadow-inner">
          VISA
        </div>
      );
    }
    if (b.includes('rupay')) {
      return (
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 shadow-inner">
          <div className="flex items-center gap-0.5 text-[#172B4D] font-extrabold text-xs italic tracking-tighter">
            <span>RuPay</span>
            <span className="text-[#FF5500]">»</span>
          </div>
        </div>
      );
    }
    // Default Mastercard Logo matching Reference Screenshot (Red & Orange overlapping circles)
    return (
      <div className="w-12 h-12 flex items-center justify-center relative shrink-0">
        <div className="w-7 h-7 rounded-full bg-[#EB001B] relative z-10 opacity-95" />
        <div className="w-7 h-7 rounded-full bg-[#F79E1B] -ml-4 relative z-0 opacity-95" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-10 pb-28 text-white min-h-[85vh] flex flex-col justify-between">
      <div>
        {/* Top Header Row matching Reference Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Payment Methods</h1>
            <p className="text-sm text-[#9CA3AF] mt-1 font-medium">Manage your saved payment methods</p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#FF5500]/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Card</span>
          </button>
        </div>

        {/* Saved Cards Section Title */}
        <div className="mb-6">
          <h2 className="text-base font-extrabold tracking-wide text-white">Saved Cards</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#2A1215] border border-[#EF4444]/40 rounded-xl flex items-center gap-3 text-xs text-[#FCA5A5]">
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 bg-[#121212] border border-[#222222] rounded-2xl p-6" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-12 text-center max-w-md mx-auto my-6">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#282828]">
              <CreditCard className="w-8 h-8 text-[#FF5500]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Saved Cards</h3>
            <p className="text-xs text-[#9CA3AF] mb-6">
              Save your credit or debit card for faster, effortless checkout on your loyalty account.
            </p>
            <button
              onClick={openAddModal}
              className="bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              Add First Card
            </button>
          </div>
        ) : (
          /* Saved Cards Grid matching Reference Screenshot */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cards.map((card) => {
              const isSelected = card.is_default;
              return (
                <div
                  key={card.id}
                  className={`relative bg-[#121212] rounded-2xl p-6 border transition-all flex flex-col justify-between h-full group ${
                    isSelected
                      ? 'border-[#FF5500] shadow-lg shadow-[#FF5500]/10'
                      : 'border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div>
                    {/* Top Row: Default Badge & Radio Selector */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {card.is_default && (
                          <span className="bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      {/* Radio Selector matching Reference Screenshot */}
                      <button
                        onClick={() => handleSetDefault(card.id)}
                        title={isSelected ? 'Default Payment Method' : 'Set as default'}
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

                    {/* Card Content Row: Brand Logo & Details */}
                    <div className="flex items-start gap-4 mb-4">
                      {renderBrandLogo(card.card_brand)}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-extrabold text-white mb-1">{card.card_brand}</h3>
                        <p className="text-xs font-mono font-bold tracking-wider text-white mb-2">
                          •••• •••• •••• {card.last4}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{card.cardholder_name}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">Expires {card.expiry_month}/{card.expiry_year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Bottom Row */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C1C1C]">
                    <button
                      onClick={() => openEditModal(card)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#FF5500] hover:underline cursor-pointer"
                    >
                      <span>Edit</span>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!card.is_default && (
                      <button
                        onClick={() => handleDelete(card.id)}
                        title="Remove Card"
                        className="p-1 text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Options Section matching Reference Screenshot */}
        <div className="mb-12">
          <h2 className="text-base font-extrabold tracking-wide text-white mb-4">Payment Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Option A */}
            <div
              onClick={openAddModal}
              className="bg-[#121212] border border-[#222222] hover:border-[#FF5500]/50 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#282828] flex items-center justify-center text-[#FF5500] shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white group-hover:text-[#FF5500] transition-colors">
                    Add Debit / Credit Card
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">Visa, Mastercard, RuPay accepted</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" />
            </div>

            {/* Card Option B (UPI) */}
            <div
              onClick={openAddModal}
              className="bg-[#121212] border border-[#222222] hover:border-[#FF5500]/50 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#282828] flex items-center justify-center text-[#FF5500] shrink-0 font-black italic text-xs tracking-tighter">
                  UPI
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white group-hover:text-[#FF5500] transition-colors">
                    Add UPI ID
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">Pay using any UPI app</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Need Help Section matching Reference Screenshot */}
        <Link to="/contact" className="bg-[#121212] border border-[#222222] rounded-2xl p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:border-[#FF5500]/50 transition-all block">
          <div>
            <h3 className="text-sm font-extrabold text-white">Need Help?</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Visit our <span className="text-[#FF5500] font-bold">Help Center / Contact Us</span> for payment related queries.
            </p>
          </div>

          <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
        </Link>
      </div>

      {/* Add / Edit Card Modal */}
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
              {editingCard ? 'Edit Saved Card' : 'Add New Card'}
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-6">
              Enter card details to save to your Patty Project loyalty account.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Card Brand Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-2">Card Type / Brand</label>
                <div className="flex gap-2">
                  {['Mastercard', 'Visa', 'RuPay', 'Amex'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setCardBrand(b)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        cardBrand === b
                          ? 'bg-[#FF5500]/20 border-[#FF5500] text-[#FF5500]'
                          : 'bg-[#181818] border-[#282828] text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Card Number *</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 •••• •••• 4242"
                  className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none font-mono"
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Cardholder Name *</label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none"
                />
              </div>

              {/* Expiry Month & Expiry Year Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Expiry Month (MM) *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    placeholder="08"
                    className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D1D5DB] mb-1">Expiry Year (YY) *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    placeholder="27"
                    className="w-full bg-[#181818] border border-[#282828] focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#6B7280] focus:outline-none font-mono"
                  />
                </div>
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
                  <span>Set as my default payment method</span>
                </label>
              </div>

              {/* Modal Action Buttons */}
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
                  {saving ? 'Saving...' : editingCard ? 'Update Card' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
