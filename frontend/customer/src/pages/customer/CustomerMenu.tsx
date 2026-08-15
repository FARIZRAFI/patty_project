import React, { useEffect, useState } from 'react';
import { Star, Plus, Bike, LayoutGrid, Beef, Drumstick, UtensilsCrossed, Flame, CupSoda, Utensils } from 'lucide-react';
import { api } from '../../api/client';
import { Product, Category } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { useCartStore } from '../../store/cartStore';

export const CustomerMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addItem } = useCartStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catData, prodData] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<Product[]>('/products')
      ]);
      setCategories(catData);
      setProducts(prodData);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    const cat = categories.find((c) => c.id === selectedCategory);
    return p.category_id === selectedCategory || (cat && (p as any).category?.slug === cat.slug);
  });

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <LayoutGrid className="w-4 h-4" />,
    burgers: <Beef className="w-4 h-4" />,
    chicken: <Drumstick className="w-4 h-4" />,
    sides: <UtensilsCrossed className="w-4 h-4" />,
    extras: <Plus className="w-4 h-4" />,
    dips: <Flame className="w-4 h-4" />,
    drinks: <CupSoda className="w-4 h-4" />,
  };

  const getCategoryIcon = (slugName: string) => {
    const key = slugName.toLowerCase();
    return categoryIcons[key] || <UtensilsCrossed className="w-4 h-4" />;
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-6 sm:py-8 pb-36 space-y-6">
      {/* Menu Header matching Image 2 */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-hero tracking-tight">
          Our Menu
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] font-medium mt-1">
          Burgers, sides and more. Made fresh to order.
        </p>
      </div>

      {/* Horizontal Category Pill Tabs Bar matching Image 2 */}
      <div className="flex items-center gap-3 pt-2 pb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shrink-0 cursor-pointer border ${
            selectedCategory === 'ALL'
              ? 'bg-[#FF5500] text-white border-[#FF5500] shadow-lg shadow-[#FF5500]/25 scale-[1.02]'
              : 'bg-[#101010] text-[#9CA3AF] border-[#262626] hover:text-white hover:bg-[#161616] hover:border-[#404040]'
          }`}
        >
          {categoryIcons['all']}
          <span>All Items</span>
        </button>

        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#FF5500] text-white border-[#FF5500] shadow-lg shadow-[#FF5500]/25 scale-[1.02]'
                  : 'bg-[#101010] text-[#9CA3AF] border-[#262626] hover:text-white hover:bg-[#161616] hover:border-[#404040]'
              }`}
            >
              {getCategoryIcon(c.slug || c.name)}
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Full-width 4-Column Product Grid matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {filteredProducts.map((p) => {
          const displayImg = p.image_url || '/placeholder-burger.svg';

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="bg-[#101010] border border-[#1F1F1F] hover:border-[#FF5500]/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
            >
              {/* Top Image Area */}
              <div className="w-full h-44 sm:h-48 lg:h-52 overflow-hidden bg-[#090909]">
                <img
                  src={displayImg}
                  alt={p.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bottom Content Area */}
              <div className="p-3.5 sm:p-4 space-y-3 bg-[#101010]">
                {/* Name & Price */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-white text-xs sm:text-sm truncate">{p.name}</h3>
                  <span className="font-bold text-white text-xs sm:text-sm shrink-0">
                    £{p.base_price.toFixed(2)}
                  </span>
                </div>

                {/* Rating & Add Button */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
                  <div className="flex items-center gap-1 text-[#FF5500]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#FF5500] text-[#FF5500]" />
                    ))}
                    <span className="text-[11px] font-bold text-[#9CA3AF] ml-1.5">
                      {p.rating || 4.7}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(p);
                    }}
                    title="Customize & Add"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-[#FF5500] text-[#FF5500] hover:bg-[#FF5500] hover:text-white flex items-center justify-center transition-all font-bold shadow-md shadow-[#FF5500]/20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note matching Screenshot 2 */}
      <div className="pt-16">
        <div className="flex items-center justify-center gap-4 pb-3">
          <div className="h-[1px] bg-[#222222] flex-1 max-w-[200px]" />
          <div className="w-8 h-8 rounded-full border border-[#FF5500]/40 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500]">
            <Utensils className="w-4 h-4" />
          </div>
          <div className="h-[1px] bg-[#222222] flex-1 max-w-[200px]" />
        </div>
        <p className="text-center text-xs text-[#6B7280]">
          More items and customisations available in-store.
        </p>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
