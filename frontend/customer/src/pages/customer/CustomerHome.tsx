import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Wheat,
  Sparkles,
  LayoutGrid,
  Beef,
  Drumstick,
  UtensilsCrossed,
  Flame,
  CupSoda,
  Plus
} from 'lucide-react';
import { api } from '../../api/client';
import { Product, Category } from '../../types';
import { useCartStore } from '../../store/cartStore';
import bannerImg from '../../assets/banner.png';

export const CustomerHome: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const navigate = useNavigate();
  const { selectedBranch, setOrderType } = useCartStore();

  useEffect(() => {
    fetchData();
  }, [selectedBranch?.id]);

  const fetchData = async () => {
    try {
      const branchParam = selectedBranch?.id ? `?branch_id=${selectedBranch.id}` : '';
      const [catData, prodData] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<Product[]>(`/products${branchParam}`)
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
    const iconElement = categoryIcons[key] || <UtensilsCrossed className="w-4 h-4" />;
    return React.cloneElement(iconElement as React.ReactElement<{ className?: string }>, {
      className: `w-4 h-4 ${isSelected ? 'text-white' : 'text-[#71717A]'}`
    });
  };

  return (
    <div className="pb-0 space-y-16">
      {/* Hero Section matching exact reference image */}
      <section id="hero" className="relative bg-black min-h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 pt-6 lg:pt-8 pb-6 lg:pb-8">
        
        {/* Full-bleed right side burger background image overlay */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%] xl:w-[66%] pointer-events-none overflow-hidden flex items-center justify-end z-0">
          <img
            src="/herobackground.png"
            alt="Hero Smash Burger"
            className="w-full h-full object-cover object-center lg:object-right select-none opacity-95 lg:opacity-100"
          />
          {/* Left-to-right soft gradient overlay for seamless text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 lg:via-black/20 to-transparent pointer-events-none" />
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
                setOrderType('DELIVERY');
                navigate('/select-location');
              }}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/30 flex items-center gap-2 cursor-pointer"
            >
              <span>ORDER NOW</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setOrderType('COLLECTION');
                navigate('/select-location');
              }}
              className="bg-[#070707]/60 backdrop-blur-md border border-[#333333] hover:border-white text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>COLLECTION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* WELCOME TO PATTY PROJECT BRAND INTRODUCTION SECTION */}
      <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-0 text-center text-white space-y-6">
        {/* Top 3 Stars */}
        <div className="flex items-center justify-center gap-1.5 text-[#FF5500]">
          <Star className="w-4 h-4 fill-[#FF5500]" />
          <Star className="w-5 h-5 fill-[#FF5500]" />
          <Star className="w-4 h-4 fill-[#FF5500]" />
        </div>

        {/* Tagline */}
        <p className="text-xs font-black tracking-[0.25em] uppercase text-white font-hero">
          WELCOME TO <span className="text-[#FF5500]">PATTY PROJECT</span>
        </p>

        {/* Serif Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight font-normal">
          Good Food. Great Times.
        </h2>

        {/* Description Paragraph */}
        <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto font-medium leading-relaxed">
          Rooted in classic Native flavors with a modern twist.<br className="hidden sm:inline" />
          Join us for lunch, dinner, or your next celebration.
        </p>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-2 max-w-5xl mx-auto">
          {/* Pillar 1 */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-20 h-20 rounded-full bg-[#121212] border border-[#282828] flex items-center justify-center text-[#FF5500] shadow-xl">
              <Wheat className="w-9 h-9 text-[#FF5500]" />
            </div>
            <h3 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase pt-1">
              QUALITY INGREDIENTS
            </h3>
            <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed max-w-[260px]">
              We source locally and seasonally, bringing out the best in every dish.
            </p>
          </div>

          {/* Pillar 2 (Featured Glowing Center Circle) */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FFAA00] flex items-center justify-center text-white shadow-2xl shadow-[#FF5500]/40 scale-105">
              <Star className="w-10 h-10 text-white stroke-[1.5]" />
            </div>
            <h3 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase pt-1">
              MADE WITH CARE
            </h3>
            <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed max-w-[260px]">
              From scratch kitchens and signature recipes made just for you.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-20 h-20 rounded-full bg-[#121212] border border-[#282828] flex items-center justify-center text-[#FF5500] shadow-xl">
              <Sparkles className="w-9 h-9 text-[#FF5500]" />
            </div>
            <h3 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase pt-1">
              WARM HOSPITALITY
            </h3>
            <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed max-w-[260px]">
              A cozy vibe, a friendly team, and great vibes always.
            </p>
          </div>
        </div>
      </section>

      {/* DELIVERY PROMO BANNER: CRAVING IT? WE'RE ALREADY ON OUR WAY */}
      <section className="w-full -my-14 sm:-my-20 lg:-my-28 xl:-my-32 overflow-hidden">
        <img
          src={bannerImg}
          alt="Hot & Special Food - Craving It? We're Already On Our Way."
          className="w-full h-auto block select-none"
        />
      </section>

      {/* OUR MENU SHOWCASE & TODAY'S OFFERS SECTION */}
      <section className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 space-y-12 -mt-10 sm:-mt-14 lg:-mt-20">
        {/* DYNAMIC MENU SHOWCASE (Category Bar + Cards, No Price, No Cart Button, Click Scrolls to Hero) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-hero">
                OUR MENU
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-1 font-normal">
                Burgers, sides and more. Made fresh to order.
              </p>
            </div>
            <Link to="/order" className="text-xs sm:text-sm font-extrabold text-[#FF5500] hover:underline flex items-center gap-1 uppercase tracking-wider">
              <span>VIEW FULL MENU</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal Category Navigation Bar */}
          <div className="flex items-center gap-2.5 pb-2 overflow-x-auto scrollbar-none scroll-smooth">
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

          {/* Responsive Product Grid (NO Price, NO Cart Button, Click scrolls to Hero) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((p) => {
              const displayImg = p.image_url || '/placeholder-burger.svg';
              const isOutOfStock = p.is_available === false || (p.stock_quantity !== undefined && p.stock_quantity <= 0);
              const isVeg = p.name.includes('[VEG]');
              const isVegan = p.name.includes('[VEGAN]');
              const cleanName = p.name.replace('[VEG]', '').replace('[VEGAN]', '').trim();

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`bg-[#0D0D0D] border rounded-[10px] overflow-hidden transition-all duration-200 group flex flex-col justify-between cursor-pointer ${
                    isOutOfStock
                      ? 'border-[#242424] opacity-85 hover:border-[#3F3F46]'
                      : 'border-[#242424] hover:border-[#FF5A00]/50'
                  }`}
                >
                  {/* Product Image Area (4/3 Aspect Ratio) */}
                  <div className="w-full aspect-[4/3] overflow-hidden bg-[#111111] relative border-b border-[#1C1C1C]">
                    <img
                      src={displayImg}
                      alt={p.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                      }}
                      className={`w-full h-full object-cover transition-transform duration-200 ${
                        isOutOfStock ? 'brightness-75' : 'group-hover:scale-[1.02]'
                      }`}
                    />

                    {/* Dietary Badges */}
                    {(isVeg || isVegan) && (
                      <span className="absolute top-2.5 left-2.5 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm z-10">
                        {isVegan ? 'VEGAN' : 'VEG'}
                      </span>
                    )}

                    {/* OUT OF STOCK Badge Overlay on Image */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-2 z-10">
                        <span className="bg-[#18181B]/95 text-[#EF4444] border border-[#EF4444]/40 text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-lg tracking-wider uppercase shadow-xl">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Information Area (Name & Stars only - NO Price & NO Cart Button) */}
                  <div className="p-4 space-y-2.5 bg-[#0D0D0D]">
                    <h3 className={`font-semibold text-sm leading-snug line-clamp-2 min-h-[40px] ${isOutOfStock ? 'text-[#A1A1AA]' : 'text-[#F5F5F5]'}`}>
                      {cleanName}
                    </h3>

                    {/* Rating Row only */}
                    <div className="flex items-center gap-1 pt-2 border-t border-[#1C1C1C]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${isOutOfStock ? 'fill-[#52525B] text-[#52525B]' : 'fill-[#FF5A00] text-[#FF5A00]'}`} />
                      ))}
                      <span className="text-xs text-[#71717A] font-normal ml-1">
                        {p.rating || 4.7}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TODAY'S OFFERS SUB-SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-hero">
              TODAY'S OFFERS
            </h2>
            <Link to="/offers" className="text-xs sm:text-sm font-extrabold text-[#FF5500] hover:underline flex items-center gap-1 uppercase tracking-wider">
              <span>VIEW ALL OFFERS</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Large Promotional Banner Cards Grid */}
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
        </div>
      </section>

      {/* HUNGRY? UNLOCK YOUR PATTYPROJECT MEAL BANNER matching Screenshot */}
      <section className="w-full max-w-[1450px] mx-auto px-6 sm:px-10 lg:px-16 py-12 text-center text-white space-y-6">
        {/* Main 2-Line Headline in Serif */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-wide leading-tight max-w-4xl mx-auto uppercase">
          <span className="text-white">HUNGRY? </span>
          <span className="text-[#FF5500]">UNLOCK YOUR</span>
          <br />
          <span className="text-white">PATTYPROJECT MEAL</span>
        </h2>

        {/* Subtext Paragraph */}
        <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-2xl mx-auto font-medium leading-relaxed">
          Don’t just eat — experience.{' '}
          <span className="text-[#FF5500] font-bold">Order online</span> and get your project-crafted meal delivered to your door, piping hot and packed with flavor.
        </p>

        {/* GET STARTED Pill Button */}
        <div className="pt-3">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs sm:text-sm font-black uppercase tracking-widest px-10 py-4 rounded-full shadow-2xl shadow-[#FF5500]/30 transition-all hover:scale-105 cursor-pointer"
          >
            GET STARTED
          </button>
        </div>
      </section>

      {/* FOOTER SECTION matching exact Screenshot */}
      <footer className="w-full bg-black pt-12 pb-6 text-white">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 space-y-12">
          
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Column 1: SHOP */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#FF5500] uppercase tracking-widest">
                SHOP
              </h4>
              <ul className="space-y-2.5 text-xs text-[#9CA3AF] font-medium">
                <li><Link to="/menu" className="hover:text-white transition-colors">All Product</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Burger</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Sides</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Drink</Link></li>
              </ul>
            </div>

            {/* Column 2: ABOUT US */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#FF5500] uppercase tracking-widest">
                ABOUT US
              </h4>
              <ul className="space-y-2.5 text-xs text-[#9CA3AF] font-medium">
                <li><a href="#story" className="hover:text-white transition-colors">Story Behind</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Customer Reviews</a></li>
                <li><a href="#philosophy" className="hover:text-white transition-colors">Packaging Philosophy</a></li>
                <li><a href="#affiliate" className="hover:text-white transition-colors">Affiliate Program</a></li>
              </ul>
            </div>

            {/* Column 3: HELP */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#FF5500] uppercase tracking-widest">
                HELP
              </h4>
              <ul className="space-y-2.5 text-xs text-[#9CA3AF] font-medium">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#where-to-buy" className="hover:text-white transition-colors">Where to Buy</a></li>
                <li><a href="#shipping" className="hover:text-white transition-colors">Shipping and Returns</a></li>
                <li><a href="#refunds" className="hover:text-white transition-colors">Return and Refunds</a></li>
              </ul>
            </div>

            {/* Column 4: CONTACT */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#FF5500] uppercase tracking-widest">
                CONTACT
              </h4>
              <ul className="space-y-3 text-xs text-[#9CA3AF] font-medium">
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <a href="mailto:hello@pattyproject.co.uk" className="hover:text-white transition-colors">
                    hello@pattyproject.co.uk
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <a 
                    href="https://maps.app.goo.gl/ucRr3c94PQKGgq4L7?g_st=aw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors leading-relaxed"
                  >
                    4 Market Parade, London N9 9HF, United Kingdom
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <a href="tel:+447417521128" className="hover:text-white transition-colors">
                    +44 7417 521128
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-Footer Line & Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <p className="font-medium text-white">Patty Project © 2026</p>
            <a href="#terms" className="hover:text-white transition-colors">Term of service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
