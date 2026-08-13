import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { Category, Product } from '../../types';
import { api } from '../../api/client';

interface Props {
  categories: Category[];
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAddEditProductModal: React.FC<Props> = ({ categories, product, onClose, onSuccess }) => {
  const [name, setName] = useState(product?.name || 'Classic Beef Burger');
  const [sku, setSku] = useState(product?.sku || 'BURG001');
  const [categoryId, setCategoryId] = useState(product?.category_id || categories[0]?.id || '');
  const [shortDescription, setShortDescription] = useState(product?.short_description || 'Juicy beef patty with lettuce, tomato, onion, pickles & our special sauce.');
  const [fullDescription, setFullDescription] = useState(product?.full_description || 'A premium beef burger made with a 100% beef patty, fresh lettuce, sliced tomatoes, onions, pickles, cheddar cheese and our signature sauce served in a toasted brioche bun.');
  const [price, setPrice] = useState(product?.base_price ? String(product.base_price) : '8.95');
  const [comparePrice, setComparePrice] = useState(product?.compare_at_price ? String(product.compare_at_price) : '');
  const [rating, setRating] = useState(product?.rating ? String(product.rating) : '4.7');
  const [isBestseller, setIsBestseller] = useState(product?.is_bestseller ?? true);
  const [hasTax, setHasTax] = useState(product?.has_tax ?? true);
  const [hasServiceCharge, setHasServiceCharge] = useState(product?.has_service_charge ?? false);
  const [stock, setStock] = useState('100');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '/placeholder-burger.svg');

  const [modifiers, setModifiers] = useState(
    product?.modifiers && product.modifiers.length > 0
      ? product.modifiers.map((m) => ({ name: m.name, price: String(m.price) }))
      : [
          { name: 'Extra Cheese', price: '1.00' },
          { name: 'Bacon', price: '1.50' },
          { name: 'Jalapeños', price: '0.50' },
        ]
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategoryId(product.category_id);
      setShortDescription(product.short_description || '');
      setFullDescription(product.full_description || '');
      setPrice(String(product.base_price));
      setComparePrice(product.compare_at_price ? String(product.compare_at_price) : '');
      setRating(String(product.rating || 4.7));
      setIsBestseller(product.is_bestseller);
      setImageUrl(product.image_url || '/placeholder-burger.svg');
    }
  }, [product]);

  const handleAddModifier = () => {
    setModifiers([...modifiers, { name: '', price: '1.00' }]);
  };

  const handleRemoveModifier = (idx: number) => {
    setModifiers(modifiers.filter((_, i) => i !== idx));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        category_id: categoryId,
        name,
        sku,
        short_description: shortDescription,
        full_description: fullDescription,
        base_price: parseFloat(price),
        compare_at_price: comparePrice ? parseFloat(comparePrice) : null,
        rating: parseFloat(rating || '4.7'),
        is_bestseller: isBestseller,
        has_tax: hasTax,
        has_service_charge: hasServiceCharge,
        stock_quantity: parseInt(stock),
        image_url: imageUrl,
        modifiers: modifiers.map((m) => ({ name: m.name, price: parseFloat(m.price || '0') }))
      };

      if (product?.id) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{product ? 'Edit Product' : 'Add Product'}</h2>
            <p className="text-xs text-[#9CA3AF]">Products &gt; {product ? 'Edit Product' : 'Add Product'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-white rounded-xl hover:bg-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Product Information & Pricing */}
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-[#FF5500] uppercase">Product Information</h3>
                <div>
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Full Description</label>
                  <textarea
                    rows={4}
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-[#FF5500] uppercase">Pricing & Ratings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Price (£) *</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-white font-semibold">Display in Best Sellers</span>
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#121212] border-[#262626] accent-[#FF5500]"
                  />
                </div>
              </div>
            </div>

            {/* Middle Column: Add-ons Manager */}
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#FF5500] uppercase">Add-ons / Modifiers</h3>
                  <button
                    type="button"
                    onClick={handleAddModifier}
                    className="text-[10px] bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-[#FF5500] hover:text-white transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Add-on</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {modifiers.map((mod, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add-on Name"
                        value={mod.name}
                        onChange={(e) => {
                          const updated = [...modifiers];
                          updated[idx].name = e.target.value;
                          setModifiers(updated);
                        }}
                        className="flex-1 bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                      />
                      <input
                        type="text"
                        placeholder="+£ Price"
                        value={mod.price}
                        onChange={(e) => {
                          const updated = [...modifiers];
                          updated[idx].price = e.target.value;
                          setModifiers(updated);
                        }}
                        className="w-20 bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveModifier(idx)}
                        className="p-2 text-[#EF4444] hover:bg-[#2A1212] rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Images & Inventory */}
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-[#FF5500] uppercase">Product Image</h3>
                
                <div className="overflow-hidden rounded-xl border border-[#262626] bg-[#121212]">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                    }}
                    className="w-full h-40 object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase">Upload New Image File</label>
                  <label className="flex items-center justify-center gap-2 w-full bg-[#121212] border border-dashed border-[#333333] hover:border-[#FF5500] rounded-xl py-2.5 px-3 text-xs text-[#9CA3AF] hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#FF5500]" />
                    <span>Choose File to Upload...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase">Or Enter Image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-[#FF5500] uppercase">Inventory</h3>
                <div>
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] uppercase mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#262626] text-white rounded-xl text-xs font-semibold"
            >
              Back to Products
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-xl text-xs font-bold shadow-md shadow-[#FF5500]/20"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
