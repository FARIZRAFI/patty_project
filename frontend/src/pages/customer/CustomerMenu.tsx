import React, { useEffect, useState } from 'react';
import { Star, Plus, LayoutGrid, Beef, Drumstick, UtensilsCrossed, Flame, CupSoda, Utensils } from 'lucide-react';
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

  const getCategoryIcon = (slugName: string, isSelected: boolean) => {
    const key = slugName.toLowerCase();
    const iconElement = (categoryIcons[key] || <UtensilsCrossed className="w-4 h-4" />) as React.ReactElement<{ className?: string }>;
    return React.cloneElement(iconElement, {
      className: `w-4 h-4 ${isSelected ? 'text-white' : 'text-[#71717A]'}`
    });

  };

  return (
    <div className="w-full max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 text-[#F5F5F5]">
      {/* Page Heading & Subtitle */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">
          Our Menu
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1.5 font-normal">
          Burgers, sides and more. Made fresh to order.
        </p>
      </div>

      {/* Horizontal Category Navigation Bar */}
      <div className="flex items-center gap-2.5 pb-3 mb-8 overflow-x-auto scrollbar-none scroll-smooth">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 cursor-pointer border ${
            selectedCategory === 'ALL'
              ? 'bg-[#FF5A00] text-white border-[#FF5A00] shadow-sm'
              : 'bg-[#0D0D0D] text-[#A1A1AA] border-[#242424] hover:text-[#F5F5F5] hover:bg-[#151515] hover:border-[#333333]'
          }`}
        >
          {getCategoryIcon('all', selectedCategory === 'ALL')}
          <span>All Items</span>
        </button>

        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#FF5A00] text-white border-[#FF5A00] shadow-sm'
                  : 'bg-[#0D0D0D] text-[#A1A1AA] border-[#242424] hover:text-[#F5F5F5] hover:bg-[#151515] hover:border-[#333333]'
              }`}
            >
              {getCategoryIcon(c.slug || c.name, isSelected)}
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Responsive Product Grid: 4 cols desktop, 3 cols med, 2 cols sm, 1 col mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredProducts.map((p) => {
          const displayImg = p.image_url || '/placeholder-burger.svg';

          // Extract dietary labels if present in product name
          const isVeg = p.name.includes('[VEG]');
          const isVegan = p.name.includes('[VEGAN]');
          const cleanName = p.name.replace('[VEG]', '').replace('[VEGAN]', '').trim();

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="bg-[#0D0D0D] border border-[#242424] hover:border-[#FF5A00]/50 rounded-[10px] overflow-hidden cursor-pointer transition-all duration-200 group flex flex-col justify-between"
            >
              {/* Product Image Area (4/3 Aspect Ratio) */}
              <div className="w-full aspect-[4/3] overflow-hidden bg-[#111111] relative border-b border-[#1C1C1C]">
                <img
                  src={displayImg}
                  alt={p.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />

                {/* Dietary Badges */}
                {(isVeg || isVegan) && (
                  <span className="absolute top-2.5 left-2.5 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {isVegan ? 'VEGAN' : 'VEG'}
                  </span>
                )}
              </div>

              {/* Product Information Area */}
              <div className="p-4 space-y-3 bg-[#0D0D0D]">
                {/* Product Name & Price Row */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[#F5F5F5] text-sm leading-snug line-clamp-2 min-h-[40px]">
                    {cleanName}
                  </h3>
                  <span className="font-semibold text-[#F5F5F5] text-sm shrink-0">
                    £{p.base_price.toFixed(2)}
                  </span>
                </div>

                {/* Rating & Add Action Button Row */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#1C1C1C]">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FF5A00] text-[#FF5A00]" />
                    ))}
                    <span className="text-xs text-[#A1A1AA] font-normal ml-1">
                      {p.rating || 4.7}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(p);
                    }}
                    title="Customize & Add"
                    aria-label={`Add ${p.name} to order`}
                    className="w-9 h-9 rounded-lg border border-[#FF5A00] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="pt-16 pb-4 text-center">
        <div className="flex items-center justify-center gap-4 pb-3">
          <div className="h-[1px] bg-[#242424] flex-1 max-w-[180px]" />
          <div className="w-8 h-8 rounded-full border border-[#242424] bg-[#121212] flex items-center justify-center text-[#FF5A00]">
            <Utensils className="w-4 h-4" />
          </div>
          <div className="h-[1px] bg-[#242424] flex-1 max-w-[180px]" />
        </div>
        <p className="text-xs text-[#71717A]">
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
