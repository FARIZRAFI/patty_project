import React, { useState, useEffect } from 'react';
import { Share2, X, Check } from 'lucide-react';
import { Product, ProductModifier } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface Props {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const [selectedModifiers, setSelectedModifiers] = useState<ProductModifier[]>([]);
  const { addItem, setProductModalOpen } = useCartStore();

  // Set modal open state in store on mount, reset on unmount
  useEffect(() => {
    setProductModalOpen(true);
    return () => {
      setProductModalOpen(false);
    };
  }, [setProductModalOpen]);

  // Fallback options list matching reference structure
  const availableModifiers: (ProductModifier & { is_out_of_stock?: boolean; is_veg?: boolean })[] =
    product.modifiers && product.modifiers.length > 0
      ? product.modifiers
      : [
          { id: 'mod-1', name: 'Coke Zero', price: 0.00, is_required: false, is_active: true, is_out_of_stock: true, is_veg: true },
          { id: 'mod-2', name: 'Coke', price: 1.50, is_required: false, is_active: true, is_veg: true },
          { id: 'mod-3', name: 'Thums Up', price: 1.50, is_required: false, is_active: true, is_veg: true },
          { id: 'mod-4', name: 'Lemon Flippinade', price: 2.00, is_required: false, is_active: true, is_veg: true },
          { id: 'mod-5', name: 'Cranberry Flippinade', price: 2.00, is_required: false, is_active: true, is_veg: true },
          { id: 'mod-6', name: 'Passionfruit Flippinade', price: 2.00, is_required: false, is_active: true, is_veg: true },
          { id: 'mod-7', name: 'Fries', price: 2.50, is_required: false, is_active: true, is_veg: true },
          { id: 'mod-8', name: 'Potato Wedges', price: 2.50, is_required: false, is_active: true, is_veg: true },
          { id: 'mod-9', name: 'Peri Fries', price: 2.80, is_required: false, is_active: true, is_veg: true },
        ];

  const toggleModifier = (mod: ProductModifier & { is_out_of_stock?: boolean }) => {
    if (mod.is_out_of_stock) return;
    if (selectedModifiers.some((m) => m.id === mod.id)) {
      setSelectedModifiers(selectedModifiers.filter((m) => m.id !== mod.id));
    } else {
      setSelectedModifiers([...selectedModifiers, mod]);
    }
  };

  const modTotal = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
  const totalPrice = product.base_price + modTotal;

  const handleAddToCart = () => {
    addItem(product, 1, selectedModifiers);
    onClose();
  };

  const isVegProduct =
    product.name.toLowerCase().includes('veg') ||
    product.name.toLowerCase().includes('cheese') ||
    product.name.toLowerCase().includes('halloumi') ||
    product.name.toLowerCase().includes('fries') ||
    product.name.toLowerCase().includes('drink') ||
    product.name.toLowerCase().includes('coke');

  const defaultImg =
    product.image_url && !product.image_url.includes('placeholder')
      ? product.image_url
      : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-150">
      {/* Click Outside Backdrop Listener */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Surface (12px Radius, 1px #242424 Border, Max 90vh Height) */}
      <div className="bg-[#0D0D0D] text-[#F5F5F5] rounded-t-[12px] sm:rounded-[12px] max-w-3xl xl:max-w-4xl w-full shadow-2xl overflow-hidden relative z-10 border border-[#242424] flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* LEFT COLUMN: Product Image & Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#242424] bg-[#0D0D0D] overflow-y-auto">
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Top Action Header with Share & Close buttons */}
            <div className="flex items-center justify-between pb-1">
              {/* Veg / Non-Veg Indicator */}
              {isVegProduct ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-[#22C55E] flex items-center justify-center p-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  </div>
                  <span className="text-xs text-[#A1A1AA] font-medium">Vegetarian</span>
                </div>
              ) : (
                <div />
              )}

              {/* Control Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                    }
                  }}
                  className="w-9 h-9 rounded-lg bg-[#151515] border border-[#242424] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#FF5A00] flex items-center justify-center transition-colors cursor-pointer"
                  title="Share"
                  aria-label="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg bg-[#151515] border border-[#242424] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#FF5A00] flex items-center justify-center transition-colors cursor-pointer"
                  title="Close modal"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Image (4:3 Aspect Ratio) */}
            <div className="w-full aspect-[4/3] bg-[#111111] rounded-lg overflow-hidden border border-[#1C1C1C] relative shrink-0">
              <img
                src={defaultImg}
                alt={product.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-2 pt-1">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F5] leading-snug">
                  {product.name}
                </h2>
                <span className="text-lg font-bold text-[#FF5A00] shrink-0">
                  £{product.base_price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#A1A1AA] font-normal leading-relaxed">
                {product.short_description ||
                  product.full_description ||
                  'Made fresh to order with top-tier premium ingredients.'}
              </p>
            </div>
          </div>

          {/* Desktop Bottom Action CTA Bar */}
          <div className="hidden md:block p-5 bg-[#0D0D0D] border-t border-[#242424] shrink-0">
            <button
              onClick={handleAddToCart}
              className="h-12 bg-[#FF5A00] hover:bg-[#E84F00] active:scale-[0.99] text-white rounded-lg px-5 flex items-center justify-between font-semibold text-sm transition-all cursor-pointer w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/50"
            >
              <span>£{totalPrice.toFixed(2)}</span>
              <span>Add to cart</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Customization Options List */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#121212] overflow-hidden flex-1">
          
          {/* Customization Section Header */}
          <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#121212] sticky top-0 z-10 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#F5F5F5]">
                  Make it a combo
                </h3>
                <span className="text-[11px] font-medium text-[#A1A1AA] bg-[#151515] border border-[#242424] px-2 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <p className="text-xs text-[#71717A] mt-0.5">
                Choose options to customize your meal
              </p>
            </div>
          </div>

          {/* Scrollable Option Cards List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 bg-[#121212]">
            {availableModifiers.map((mod) => {
              const isSelected = selectedModifiers.some((m) => m.id === mod.id);
              const isOutOfStock = mod.is_out_of_stock;

              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModifier(mod)}
                  className={`border rounded-lg p-3.5 min-h-[56px] flex items-center justify-between transition-all select-none ${
                    isOutOfStock
                      ? 'border-[#242424] bg-[#151515]/50 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#6B2A0D] bg-[#241209] text-[#F5F5F5] cursor-pointer'
                      : 'border-[#242424] bg-[#151515] hover:border-[#333333] hover:bg-[#181818] text-[#A1A1AA] cursor-pointer'
                  }`}
                >
                  {/* Left Option Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'border-[#FF5A00] bg-[#FF5A00] text-white'
                          : 'border-[#242424] bg-[#0D0D0D]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>

                    <div>
                      <p className={`text-sm font-medium ${isSelected ? 'text-[#F5F5F5]' : 'text-[#F5F5F5]'}`}>
                        {mod.name}
                      </p>
                      {isOutOfStock && (
                        <span className="text-[11px] font-semibold text-[#EF4444] block mt-0.5">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Option Price */}
                  {!isOutOfStock && mod.price > 0 && (
                    <span className="text-xs font-semibold text-[#FF5A00] shrink-0">
                      +£{mod.price.toFixed(2)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Bottom Action CTA Bar (Pinned at bottom) */}
          <div className="md:hidden p-4 bg-[#0D0D0D] border-t border-[#242424] shrink-0 sticky bottom-0 z-30">
            <button
              onClick={handleAddToCart}
              className="h-12 bg-[#FF5A00] hover:bg-[#E84F00] active:scale-[0.99] text-white rounded-lg px-5 flex items-center justify-between font-semibold text-sm transition-all cursor-pointer w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/50"
            >
              <span>£{totalPrice.toFixed(2)}</span>
              <span>Add to cart</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
