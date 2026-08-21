import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ChevronRight, Wheat, Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { CustomerFooter } from '../../components/customer/CustomerFooter';
import { useCartStore } from '../../store/cartStore';
import bannerImg from '../../assets/banner.png';

export const CustomerHome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { selectedBranch, setOrderType } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [selectedBranch?.id]);

  const fetchProducts = async () => {
    try {
      const branchParam = selectedBranch?.id ? `?branch_id=${selectedBranch.id}` : '';
      const data: Product[] = await api.get(`/products${branchParam}`);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const mcProduct = products.find(p => p.name.toLowerCase().includes('mc project') && !p.name.toLowerCase().includes('vegan'));
  const outlawProduct = products.find(p => p.name.toLowerCase().includes('outlaw project') && !p.name.toLowerCase().includes('vegan'));
  const pastramiProduct = products.find(p => p.name.toLowerCase().includes('pastrami'));
  const chickenProduct = products.find(p => p.name.toLowerCase().includes('chicken sando') || p.name.toLowerCase().includes('buffalo chicken'));
  const halloumiProduct = products.find(p => p.name.toLowerCase().includes('halloumi'));

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

      {/* SIGNATURE BURGERS & TODAY'S OFFERS SECTION */}
      <section className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 space-y-12 -mt-10 sm:-mt-14 lg:-mt-20">
        {/* SIGNATURE BURGERS SHOWCASE SECTION (Full Width & Large Scale matching reference poster) */}
        <div className="space-y-10 sm:space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-hero">
              SIGNATURE BURGERS
            </h2>
            <Link to="/menu" className="text-xs sm:text-sm font-extrabold text-[#FF5500] hover:underline flex items-center gap-1 uppercase tracking-wider">
              <span>VIEW ALL</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Top Row: 3 Signature Burgers spanning full width */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-14">
            {/* 1. MC PROJECT */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-5 sm:gap-6 cursor-pointer p-3 sm:p-5"
            >
              <div className="w-36 sm:w-48 lg:w-52 xl:w-60 h-36 sm:h-48 lg:h-52 xl:h-60 shrink-0 relative overflow-hidden rounded-3xl bg-[#111111]">
                <img
                  src={mcProduct?.image_url || '/product_the_mc_project.png'}
                  alt="MC Project"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-black tracking-wide uppercase leading-tight">
                  <span className="text-white">MC </span>
                  <br className="hidden sm:inline" />
                  <span className="text-[#FF5500]">PROJECT</span>
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-[#D1D5DB] font-medium leading-relaxed max-w-[280px] sm:max-w-[320px]">
                  Double beef, double American cheese, burger sauce, lettuce, onion & gherkins
                </p>
              </div>
            </div>

            {/* 2. OUTLAW PROJECT */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-5 sm:gap-6 cursor-pointer p-3 sm:p-5"
            >
              <div className="w-36 sm:w-48 lg:w-52 xl:w-60 h-36 sm:h-48 lg:h-52 xl:h-60 shrink-0 relative overflow-hidden rounded-3xl bg-[#111111]">
                <img
                  src={outlawProduct?.image_url || '/product_the_outlaw_project_.png'}
                  alt="Outlaw Project"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-black tracking-wide uppercase leading-tight">
                  <span className="text-white">OUTLAW </span>
                  <br className="hidden sm:inline" />
                  <span className="text-[#FF5500]">PROJECT</span>
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-[#D1D5DB] font-medium leading-relaxed max-w-[280px] sm:max-w-[320px]">
                  Double beef, mature cheddar, bacon, smoky BBQ, jalapeños & jalapeño mayo
                </p>
              </div>
            </div>

            {/* 3. PASTRAMI BURGER */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-5 sm:gap-6 cursor-pointer p-3 sm:p-5"
            >
              <div className="w-36 sm:w-48 lg:w-52 xl:w-60 h-36 sm:h-48 lg:h-52 xl:h-60 shrink-0 relative overflow-hidden rounded-3xl bg-[#111111]">
                <img
                  src={pastramiProduct?.image_url || '/product_pastrami_burger_.png'}
                  alt="Pastrami Burger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-black tracking-wide uppercase leading-tight">
                  <span className="text-white">PASTRAMI </span>
                  <br className="hidden sm:inline" />
                  <span className="text-[#FF5500]">BURGER</span>
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-[#D1D5DB] font-medium leading-relaxed max-w-[280px] sm:max-w-[320px]">
                  Pastrami, Emmental, Russian sauce & pickled gherkins
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: 2 Signature Burgers Large Centered */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 xl:gap-28 max-w-5xl lg:max-w-6xl mx-auto pt-4 sm:pt-8">
            {/* 4. FRIED CHICKEN SANDO */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-5 sm:gap-6 cursor-pointer p-3 sm:p-5"
            >
              <div className="w-36 sm:w-48 lg:w-52 xl:w-60 h-36 sm:h-48 lg:h-52 xl:h-60 shrink-0 relative overflow-hidden rounded-3xl bg-[#111111]">
                <img
                  src={chickenProduct?.image_url || '/product_buffalo_chicken_sando_.png'}
                  alt="Fried Chicken Sando"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-black tracking-wide uppercase leading-tight">
                  <span className="text-white">FRIED CHICKEN </span>
                  <br className="hidden sm:inline" />
                  <span className="text-[#FF5500]">SANDO</span>
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-[#D1D5DB] font-medium leading-relaxed max-w-[280px] sm:max-w-[320px]">
                  Buffalo buttermilk chicken, coleslaw, lime mayo & gherkins
                </p>
              </div>
            </div>

            {/* 5. HALLOUMI BURGER */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-5 sm:gap-6 cursor-pointer p-3 sm:p-5"
            >
              <div className="w-36 sm:w-48 lg:w-52 xl:w-60 h-36 sm:h-48 lg:h-52 xl:h-60 shrink-0 relative overflow-hidden rounded-3xl bg-[#111111]">
                <img
                  src={halloumiProduct?.image_url || '/product_the_halloumi_project_veg.png'}
                  alt="Halloumi Burger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-black tracking-wide uppercase leading-tight">
                  <span className="text-white">HALLOUMI </span>
                  <br className="hidden sm:inline" />
                  <span className="text-[#FF5500]">BURGER</span>
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-[#D1D5DB] font-medium leading-relaxed max-w-[280px] sm:max-w-[320px]">
                  Halloumi, guacamole, tomato, pickled onion & hot-honey ketchup
                </p>
              </div>
            </div>
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
              <div className="w-36 sm:w-48 lg:w-52 xl:w-60 h-32 sm:h-36 lg:h-40 bg-[#161616] border border-[#262626] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xl shrink-0 group-hover:border-[#FF5500]/40 transition-colors">
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
