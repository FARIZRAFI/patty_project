import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ChevronRight, Leaf, Bike, Award } from 'lucide-react';
import { api } from '../../api/client';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { useCartStore } from '../../store/cartStore';

export const CustomerHome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { selectedBranch, setOrderType } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data: Product[] = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 6 Best Seller items to match exact desktop screenshot row
  const bestSellers = [
    { id: '1', name: 'Mc Project', price: 8.95, rating: 4.7, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
    { id: '2', name: 'Outlaw Project', price: 8.95, rating: 4.6, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80' },
    { id: '3', name: 'Pastrami Burger', price: 8.95, rating: 4.6, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80' },
    { id: '4', name: 'Fried Chicken Sando', price: 8.45, rating: 4.6, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80' },
    { id: '5', name: 'Halloumi Burger', price: 8.45, rating: 4.5, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=600&q=80' },
    { id: '6', name: 'Loaded Fries', price: 6.45, rating: 4.5, image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="pb-24 space-y-16">
      {/* Hero Section matching exact reference image */}
      <section className="relative bg-[#070707] min-h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden border-b border-[#141414] px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 pt-6 lg:pt-8 pb-6 lg:pb-8">
        
        {/* Full-bleed right side burger background image overlay */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%] xl:w-[66%] pointer-events-none overflow-hidden flex items-center justify-end z-0">
          <img
            src="/herobackground.png"
            alt="Hero Smash Burger"
            className="w-full h-full object-cover object-center lg:object-right select-none opacity-95 lg:opacity-100"
          />
          {/* Left-to-right soft gradient overlay for seamless text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/75 lg:via-[#070707]/20 to-transparent pointer-events-none" />
        </div>

        {/* Top/Middle Hero Content (Headline + Description + Buttons) */}
        <div className="relative z-10 my-auto max-w-[560px]">
          {/* Orange Location Tag */}
          <span className="text-xs lg:text-sm text-[#FF5500] tracking-[0.25em] font-extrabold uppercase block mb-3 sm:mb-4">
            LONDON
          </span>

          {/* Giant Headline matching exact reference screenshot */}
          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-[7.2rem] font-black leading-[0.88] tracking-tight font-hero uppercase">
            <span className="text-white">SMASH.</span><br />
            <span className="text-[#FF5500]">STACK.</span><br />
            <span className="text-white">SATISFY.</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-[#9CA3AF] text-sm sm:text-base font-medium leading-relaxed max-w-[420px] mt-4 lg:mt-6 mb-6 lg:mb-8">
            London-made burgers. Fresh ingredients.<br className="hidden sm:inline" />
            Bold flavours.
          </p>

          {/* CTA Buttons Row matching screenshot */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                if (selectedBranch) {
                  navigate('/menu');
                } else {
                  navigate('/select-location');
                }
              }}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/30 flex items-center gap-2 cursor-pointer"
            >
              <span>ORDER NOW</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setOrderType('COLLECTION');
                if (selectedBranch) {
                  navigate('/menu');
                } else {
                  navigate('/select-location');
                }
              }}
              className="bg-[#070707]/60 backdrop-blur-md border border-[#333333] hover:border-white text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>COLLECTION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Feature Highlights Row matching exact reference screenshot */}
        <div className="relative z-10 pt-8 lg:pt-0">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#FF5500]/60 bg-[#070707]/80 flex items-center justify-center text-[#FF5500] shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Fresh Ingredients</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Sourced Daily</p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-[1px] h-8 bg-[#262626]" />

            {/* Feature 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#FF5500]/60 bg-[#070707]/80 flex items-center justify-center text-[#FF5500] shrink-0">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Fast Delivery</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">2 Mile Radius</p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-[1px] h-8 bg-[#262626]" />

            {/* Feature 3 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#FF5500]/60 bg-[#070707]/80 flex items-center justify-center text-[#FF5500] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Loyalty Rewards</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Earn & Redeem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS SECTION (Matching Screenshot 2 Target Reference) */}
      <section className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-hero">
            BEST SELLERS
          </h2>
          <Link to="/menu" className="text-xs sm:text-sm font-extrabold text-[#FF5500] hover:underline flex items-center gap-1 uppercase tracking-wider">
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Column Desktop Grid with full container width & edge-to-edge product cards matching Screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {(
            products.filter((p) => p.is_bestseller).length > 0
              ? products.filter((p) => p.is_bestseller).slice(0, 6)
              : products.length > 0
              ? products.slice(0, 6)
              : bestSellers.map((b) => ({
                  id: b.id,
                  name: b.name,
                  base_price: b.price,
                  rating: b.rating,
                  image_url: '/placeholder-burger.svg',
                  sku: `BURG00${b.id}`,
                  short_description: `${b.name} made fresh daily`,
                  full_description: `${b.name} served fresh with signature sauce`,
                  category_id: 'burgers',
                  compare_at_price: null,
                  reviews_count: 120,
                  is_bestseller: true,
                  has_tax: true,
                  has_service_charge: false,
                  vat_category: 'STANDARD_20',
                  is_active: true,
                  modifiers: []
                }))
          ).map((p) => {
            const displayPrice = 'base_price' in p ? p.base_price : (p as any).price;
            const displayImg = p.image_url || '/placeholder-burger.svg';

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p as Product)}
                className="bg-[#101010] border border-[#1F1F1F] hover:border-[#FF5500]/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
              >
                {/* Product Image Area occupying upper 60-65% of card and touching edges */}
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

                {/* Card Content Area */}
                <div className="p-3.5 sm:p-4 space-y-2.5 bg-[#101010]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-white text-xs sm:text-sm truncate">{p.name}</h3>
                    <span className="font-bold text-white text-xs sm:text-sm shrink-0">£{displayPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#FF5500] pt-2 border-t border-[#1C1C1C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#FF5500] text-[#FF5500]" />
                    ))}
                    <span className="text-[11px] font-bold text-[#9CA3AF] ml-1.5">{p.rating || 4.7}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TODAY'S OFFERS SECTION (Matching Screenshot 2 Target Reference) */}
      <section className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 space-y-6 pt-2">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-hero">
          TODAY'S OFFERS
        </h2>

        {/* 3 Large Promotional Banner Cards Grid matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Offer Card 1: BURGER COMBO */}
          <div className="bg-[#120B07] border border-[#2A1810] hover:border-[#FF5500]/60 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden shadow-2xl transition-all hover:scale-[1.02] cursor-pointer group min-h-[180px] sm:min-h-[200px]">
            <div className="space-y-3 relative z-10 max-w-[55%]">
              <h3 className="font-black text-white text-xl sm:text-2xl tracking-wide uppercase font-hero leading-tight">
                BURGER COMBO
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium">Burger + Fries + Drink</p>
              <div className="pt-1">
                <span className="inline-block px-4 py-2 bg-[#FF5500] text-white text-xs font-extrabold rounded-xl uppercase tracking-wider shadow-lg shadow-[#FF5500]/30">
                  SAVE 15%
                </span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80"
              alt="Burger Combo"
              className="w-36 sm:w-44 lg:w-48 xl:w-52 h-32 sm:h-36 lg:h-40 object-cover rounded-2xl border border-[#262626] shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Offer Card 2: WING WEDNESDAY */}
          <div className="bg-[#120B07] border border-[#2A1810] hover:border-[#FF5500]/60 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden shadow-2xl transition-all hover:scale-[1.02] cursor-pointer group min-h-[180px] sm:min-h-[200px]">
            <div className="space-y-2 relative z-10 max-w-[55%]">
              <h3 className="font-black text-white text-xl sm:text-2xl tracking-wide uppercase font-hero leading-tight">
                WING WEDNESDAY
              </h3>
              <p className="text-xs sm:text-sm text-[#FF5500] font-extrabold uppercase tracking-wider pt-0.5">20% OFF</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium">On All Wings</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=500&q=80"
              alt="Wings"
              className="w-36 sm:w-44 lg:w-48 xl:w-52 h-32 sm:h-36 lg:h-40 object-cover rounded-2xl border border-[#262626] shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Offer Card 3: STUDENT OFFER */}
          <div className="bg-[#120B07] border border-[#2A1810] hover:border-[#FF5500]/60 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden shadow-2xl transition-all hover:scale-[1.02] cursor-pointer group min-h-[180px] sm:min-h-[200px]">
            <div className="space-y-2 relative z-10 max-w-[55%]">
              <h3 className="font-black text-white text-xl sm:text-2xl tracking-wide uppercase font-hero leading-tight">
                STUDENT OFFER
              </h3>
              <p className="text-xs sm:text-sm text-[#FF5500] font-extrabold uppercase tracking-wider pt-0.5">10% OFF</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium">On All Orders</p>
            </div>
            <div className="w-36 sm:w-44 lg:w-48 xl:w-52 h-32 sm:h-36 lg:h-40 bg-[#161616] border border-[#262626] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xl shrink-0 group-hover:border-[#FF5500]/40 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500] font-extrabold text-xs mb-1.5 shadow-md">
                ID
              </div>
              <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">STUDENT OFFER</span>
              <span className="text-[9px] text-[#6B7280] mt-0.5">PATTY PROJECT - LONDON</span>
            </div>
          </div>
        </div>
      </section>

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
