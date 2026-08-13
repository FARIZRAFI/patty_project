import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ChevronLeft, ChevronRight, Bike, Leaf, Award, Flame } from 'lucide-react';
import { Product, ProductModifier } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface Props {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'DESCRIPTION' | 'INGREDIENTS' | 'NUTRITION' | 'ALLERGENS'>('DESCRIPTION');
  const navigate = useNavigate();

  // Default add-ons fallback matching Screenshot 2 reference if product has no modifiers
  const availableModifiers: ProductModifier[] =
    product.modifiers && product.modifiers.length > 0
      ? product.modifiers
      : [
          { id: 'mod-1', name: 'Extra Beef Patty', price: 2.00 },
          { id: 'mod-2', name: 'Bacon', price: 1.50 },
          { id: 'mod-3', name: 'Jalapeños', price: 0.80 },
          { id: 'mod-4', name: 'Extra Cheese', price: 0.80 },
        ];

  const [selectedModifiers, setSelectedModifiers] = useState<ProductModifier[]>([]);

  // Product image gallery array
  const galleryImages = [
    product.image_url || '/placeholder-burger.svg',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = galleryImages[activeImageIndex] || galleryImages[0];

  const { addItem } = useCartStore();

  const toggleModifier = (mod: ProductModifier) => {
    if (selectedModifiers.some((m) => m.id === mod.id)) {
      setSelectedModifiers(selectedModifiers.filter((m) => m.id !== mod.id));
    } else {
      setSelectedModifiers([...selectedModifiers, mod]);
    }
  };

  const modTotal = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
  const unitPrice = product.base_price + modTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedModifiers);
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0B] overflow-y-auto w-full min-h-screen text-white animate-in fade-in duration-200">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-8 pb-24">
        
        {/* Back to Menu Navigation Button matching Screenshot 2 */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white font-semibold transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF5500] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Menu</span>
        </button>

        {/* Main 2-Column Desktop Grid matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Large Image, Gallery Carousel & Features Row (~58% Width) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Product Image Container */}
            <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden border border-[#1F1F1F] bg-[#101010] shadow-2xl group">
              <img
                src={activeImage}
                alt={product.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Data-driven BESTSELLER Badge Pill */}
              {product.is_bestseller && (
                <div className="absolute top-5 right-5 bg-[#070707]/85 backdrop-blur-md border border-[#FF5500] text-[#FF5500] text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-[#FF5500]" />
                  <span>BESTSELLER</span>
                </div>
              )}
            </div>

            {/* Horizontal Product Image Gallery Slider */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                }
                className="p-2.5 rounded-xl bg-[#101010] border border-[#1F1F1F] text-[#9CA3AF] hover:text-white hover:border-[#FF5500]/50 transition-all shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none flex-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-[#101010] cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#FF5500] scale-[1.03] shadow-lg shadow-[#FF5500]/20'
                        : 'border-[#1F1F1F] opacity-70 hover:opacity-100 hover:border-[#333]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                }
                className="p-2.5 rounded-xl bg-[#101010] border border-[#1F1F1F] text-[#9CA3AF] hover:text-white hover:border-[#FF5500]/50 transition-all shrink-0 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Benefits / Features Bar matching Screenshot 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#FF5500]/50 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Fresh Ingredients</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Sourced Daily</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#FF5500]/50 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Bold Flavours</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Made to Crave</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#FF5500]/50 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] shrink-0">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Fast Delivery</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">2 Mile Radius</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#FF5500]/50 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Loyalty Rewards</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Earn & Redeem</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info, Add-ons & Add to Cart CTA (~42% Width) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title, Price & Description */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-hero tracking-tight">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#FF5500] mt-2">
                £{product.base_price.toFixed(2)}
              </p>
              <p className="text-sm text-[#9CA3AF] font-medium leading-relaxed mt-3 mb-4">
                {product.short_description ||
                  product.full_description ||
                  'Double beef, double American cheese, burger sauce, lettuce, onion & gherkins.'}
              </p>

              {/* Star Rating Row */}
              <div className="flex items-center gap-2 text-[#FF5500]">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF5500] text-[#FF5500]" />
                  ))}
                </div>
                <span className="text-sm font-bold text-white ml-1">{product.rating || 4.7}</span>
                <span className="text-xs text-[#6B7280]">({product.reviews_count || 312} reviews)</span>
              </div>
            </div>

            {/* ADD-ONS Section matching Screenshot 2 */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-[#9CA3AF] tracking-widest uppercase">
                ADD-ONS
              </h3>

              <div className="bg-[#101010] border border-[#1F1F1F] rounded-2xl divide-y divide-[#1C1C1C] overflow-hidden shadow-xl">
                {availableModifiers.map((mod) => {
                  const isSelected = selectedModifiers.some((m) => m.id === mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModifier(mod)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#FF5500]/10 text-white'
                          : 'hover:bg-[#161616] text-[#9CA3AF]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded bg-[#121212] border-[#262626] accent-[#FF5500] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-bold text-white">{mod.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        +£{mod.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY Section matching Screenshot 2 */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-[#9CA3AF] tracking-widest uppercase">
                QUANTITY
              </h3>

              <div className="flex items-center justify-between bg-[#101010] border border-[#1F1F1F] rounded-xl px-4 py-2.5 w-36 text-white shadow-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-lg font-bold text-[#9CA3AF] hover:text-white px-2 cursor-pointer"
                >
                  −
                </button>
                <span className="font-bold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-lg font-bold text-[#9CA3AF] hover:text-white px-2 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Large Sticky ADD TO CART CTA Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-sm sm:text-base font-black uppercase tracking-wider py-4 px-8 rounded-2xl shadow-2xl shadow-[#FF5500]/30 transition-all hover:scale-[1.01] mt-6 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ADD TO CART</span>
              <span>•</span>
              <span>£{totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* BOTTOM INFORMATION TABS PANEL matching Screenshot 2 */}
        <div className="bg-[#101010] border border-[#1F1F1F] rounded-3xl p-6 sm:p-8 mt-12 space-y-6 shadow-xl">
          {/* Tabs Navigation Header */}
          <div className="flex items-center gap-8 border-b border-[#1F1F1F] pb-4 overflow-x-auto">
            {(['DESCRIPTION', 'INGREDIENTS', 'NUTRITION', 'ALLERGENS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs sm:text-sm font-black tracking-wider uppercase transition-all pb-4 -mb-4 cursor-pointer ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-[#FF5500]'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="pt-2">
            {activeTab === 'DESCRIPTION' && (
              <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-3xl">
                {product.full_description ||
                  product.short_description ||
                  'Our signature double-stack burger. Two smashed beef patties, melty American cheese, crisp lettuce, onions, pickles and our house burger sauce in a toasted brioche bun.'}
              </p>
            )}

            {activeTab === 'INGREDIENTS' && (
              <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-3xl">
                100% British Beef patties, Toasted Brioche Bun (Wheat, Milk, Eggs), Cheddar Cheese (Milk), Fresh Crisp Iceberg Lettuce, Sliced Tomatoes, Red Onions, Pickles, Signature House Patty Sauce.
              </p>
            )}

            {activeTab === 'NUTRITION' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
                <div className="bg-[#080808] border border-[#1F1F1F] p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">CALORIES</p>
                  <p className="text-lg font-black text-white mt-1">850 kcal</p>
                </div>
                <div className="bg-[#080808] border border-[#1F1F1F] p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">PROTEIN</p>
                  <p className="text-lg font-black text-white mt-1">48g</p>
                </div>
                <div className="bg-[#080808] border border-[#1F1F1F] p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">CARBS</p>
                  <p className="text-lg font-black text-white mt-1">42g</p>
                </div>
                <div className="bg-[#080808] border border-[#1F1F1F] p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">FAT</p>
                  <p className="text-lg font-black text-white mt-1">52g</p>
                </div>
              </div>
            )}

            {activeTab === 'ALLERGENS' && (
              <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-3xl">
                Contains: <strong className="text-white">Wheat (Gluten), Milk, Eggs, Mustard, Sesame</strong>. Prepared in a kitchen environment that handles nuts and celery.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
