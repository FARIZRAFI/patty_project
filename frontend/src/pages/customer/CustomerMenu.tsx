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
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-8 pb-24">
      {/* 2-Column Responsive Layout: Left Sidebar + Right Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Vertical Category Sidebar matching Screenshot 2 */}
        <aside className="w-full lg:w-64 xl:w-72 bg-[#101010] border border-[#1F1F1F] rounded-3xl p-5 shrink-0 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Sidebar Heading */}
            <div className="pb-2 border-b-2 border-[#FF5500] inline-block">
              <h2 className="text-xs font-extrabold text-[#FF5500] tracking-widest uppercase">
                CATEGORIES
              </h2>
            </div>

            {/* Vertical Category Navigation List */}
            <nav className="space-y-1.5 pt-2">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`w-full px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/25'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                {categoryIcons['all']}
                <span>All Items</span>
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                    selectedCategory === c.id
                      ? 'bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/25'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]'
                  }`}
                >
                  {getCategoryIcon(c.slug || c.name)}
                  <span>{c.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Fast Delivery Promotional Card at bottom of sidebar */}
          <div className="bg-[#070707] border border-[#222222] rounded-2xl p-4 flex items-center gap-3.5 pt-4">
            <div className="w-10 h-10 rounded-full border border-[#FF5500]/50 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Fast Delivery</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-medium">2 Mile Radius</p>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Main Menu Header & 4-Column Product Grid */}
        <main className="flex-1 w-full space-y-6">
          {/* Main Menu Header matching Screenshot 2 */}
          <div className="pb-4 border-b border-[#1A1A1A]">
            <h1 className="text-3xl sm:text-4xl font-black text-white font-hero tracking-tight">
              Our Menu
            </h1>
            <p className="text-sm text-[#9CA3AF] font-medium mt-1">
              Burgers, sides and more. Made fresh to order.
            </p>
          </div>

          {/* 4-Column Desktop Product Grid matching Screenshot 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filteredProducts.map((p) => {
              const displayImg = p.image_url || '/placeholder-burger.svg';

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="bg-[#101010] border border-[#1F1F1F] hover:border-[#FF5500]/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
                >
                  {/* Top Image Area occupying upper 60-65% of card */}
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
        </main>
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
