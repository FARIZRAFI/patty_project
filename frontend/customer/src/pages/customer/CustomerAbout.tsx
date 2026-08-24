import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Utensils, 
  Flame, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Compass
} from 'lucide-react';

export const CustomerAbout: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'BURGERS',
      subtitle: 'Double Smashed Daily',
      desc: 'Prime British beef, caramelized razor crusts, melted American cheese & toasted brioche.',
      image: '/product_the_mc_project.png',
      alt: 'Patty Project Signature Double Smash Burger',
    },
    {
      title: 'CRISPY CHICKEN',
      subtitle: 'Buttermilk Fried Sando',
      desc: 'Crispy fried chicken thigh seasoned to perfection with artisan glazes and house pickles.',
      image: '/product_buffalo_chicken_sando_.png',
      alt: 'Crispy Buffalo Chicken Sando',
    },
    {
      title: 'LOADED FRIES',
      subtitle: 'Skin-On & Seasoned',
      desc: 'Golden crisp fries layered with cheeses, signature sauces, crispy onions & spicy peppers.',
      image: '/product_halloumi_fries_veg.png',
      alt: 'Loaded Halloumi and Seasoned Fries',
    },
    {
      title: 'WINGS & SIDES',
      subtitle: 'Bold Bites & Sauces',
      desc: 'Tender wings, rosemary salt sides, and handcrafted in-house sauces made from scratch.',
      image: '/product_rosemary_salt_fries_vegan.png',
      alt: 'Rosemary Salt Fries and Sides',
    },
  ];

  const philosophyItems = [
    {
      number: '01',
      title: 'QUALITY',
      desc: 'Quality ingredients and carefully selected produce sourced ethically from trusted suppliers.',
      icon: Award,
    },
    {
      number: '02',
      title: 'PROPER PREPARATION',
      desc: 'Food prepared with care, consistency and years of high-tempo London line experience.',
      icon: Flame,
    },
    {
      number: '03',
      title: 'BIG FLAVOUR',
      desc: 'Bold burgers, crispy chicken, loaded fries, wings and proper sides packed with punch.',
      icon: Sparkles,
    },
    {
      number: '04',
      title: 'CONSISTENCY',
      desc: 'The same uncompromising standard, crust, texture, and taste every single service.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white pb-16">
      
      {/* ========================================================================= */}
      {/* SECTION 01 — HERO */}
      {/* ========================================================================= */}
      <section 
        aria-label="About Patty Project Hero"
        className="relative w-full overflow-hidden bg-black border-b border-white/[0.08] pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20"
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF5500]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ABOUT PATTY PROJECT</span>
              </div>

              {/* Large Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-black uppercase tracking-tight leading-[0.92] font-hero">
                <span className="text-white block">FOUR MATES.</span>
                <span className="text-[#FF5500] block">ONE PROJECT.</span>
                <span className="text-white block">PROPER BURGERS.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg lg:text-xl text-[#9CA3AF] font-medium leading-relaxed max-w-[560px]">
                Built in London's kitchens. Made for people who know good food.
              </p>

              {/* CTA Button Group */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#FF5500]/25 hover:scale-[1.02] cursor-pointer"
                  aria-label="Explore Our Menu"
                >
                  <span>EXPLORE OUR MENU</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/order')}
                  className="bg-[#141414] hover:bg-[#202020] text-white border border-white/[0.15] hover:border-white/[0.3] px-8 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  aria-label="Order Now"
                >
                  <span>ORDER NOW</span>
                </button>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[480px] lg:max-w-none aspect-square sm:aspect-4/3 lg:aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                <img
                  src="/hero_burger_flame.png"
                  alt="Signature Patty Project Double Smash Burger with melted cheese"
                  className="w-full h-full object-contain max-h-[340px] sm:max-h-[420px] lg:max-h-[460px] drop-shadow-[0_25px_50px_rgba(255,85,0,0.25)] select-none pointer-events-none transform hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Editorial Container */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 space-y-24 sm:space-y-32 py-16 sm:py-24">
        
        {/* ========================================================================= */}
        {/* SECTION 02 — OUR STORY (Two-Column Editorial) */}
        {/* ========================================================================= */}
        <section 
          aria-label="Our Story"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Heading & Visual */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FF5500] block">
                THE STORY
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero leading-[0.95]">
                BUILT FROM THE <br />
                <span className="text-[#FF5500]">KITCHEN UP.</span>
              </h2>
            </div>

            {/* Editorial Visual Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111111] shadow-2xl group aspect-4/3 sm:aspect-16/10">
              <img
                src="/signature_burgers_showcase.jpg"
                alt="Patty Project kitchen burger grill"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#9CA3AF]">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#FF5500]" />
                  London Kitchen Craft
                </span>
                <span className="text-[11px] font-mono text-[#71717A]">EST. EDMONTON</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Pull Quote */}
          <div className="lg:col-span-7 space-y-6 text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            <p className="text-white text-lg sm:text-xl font-semibold leading-snug">
              Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
            </p>

            <p>
              Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen.
            </p>

            <p>
              Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
            </p>

            <p>
              So we decided to put that experience into our own project — <strong className="text-white font-extrabold">Patty Project</strong>.
            </p>

            {/* Pull Quote Highlight */}
            <div className="p-6 rounded-2xl bg-[#0E0E0E] border-l-4 border-[#FF5500] border-y border-r border-white/[0.06] shadow-xl mt-4">
              <p className="text-base sm:text-lg font-bold text-white italic leading-relaxed">
                “Great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.”
              </p>
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] block mt-2">
                — PATTY PROJECT FOUNDERS
              </span>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 03 — THE PATTY PROJECT PHILOSOPHY */}
        {/* ========================================================================= */}
        <section 
          aria-label="The Patty Project Philosophy"
          className="space-y-10"
        >
          {/* Section Header */}
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FF5500] block">
              OUR PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero leading-tight">
              GOOD FOOD. <br className="sm:hidden" />
              <span className="text-[#FF5500]">NO SHORTCUTS.</span>
            </h2>
            <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed">
              Every item on our menu is built on four core principles forged through years of service on busy London pass lines.
            </p>
          </div>

          {/* 4 Core Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {philosophyItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-[#0E0E0E] hover:bg-[#141414] border border-white/[0.08] hover:border-[#FF5500]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#FF5500] tracking-widest">
                        {item.number}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] group-hover:scale-110 transition-transform">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-wide text-white font-hero">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 04 — LONDON TO PATTY PROJECT */}
        {/* ========================================================================= */}
        <section 
          aria-label="London Connection"
          className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0A0A0A] p-8 sm:p-12 lg:p-16 shadow-2xl"
        >
          {/* Background Ambient Imagery & Vignette */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-25">
            <img
              src="/herobackground.png"
              alt="London Kitchen Atmosphere"
              className="w-full h-full object-cover object-center filter grayscale contrast-125"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60 z-0 pointer-events-none" />

          {/* Foreground Content */}
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black text-[#FF5500] uppercase tracking-[0.25em]">
              <Compass className="w-4 h-4" />
              <span>ROOTS & INSPIRATION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero text-white leading-[0.95]">
              LONDON IS PART OF <br />
              <span className="text-[#FF5500]">OUR STORY.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#D1D5DB] leading-relaxed">
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking.
            </p>

            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              Patty Project takes that experience, that energy, and that kitchen standard — and puts our own distinct stamp on it.
            </p>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 05 — WHAT WE SERVE */}
        {/* ========================================================================= */}
        <section 
          aria-label="What We Serve"
          className="space-y-10"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FF5500] block">
                THE MENU ESSENTIALS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero leading-tight">
                PROPER FOOD. <br className="sm:hidden" />
                <span className="text-[#FF5500]">BIG FLAVOURS.</span>
              </h2>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5500] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.title}
                onClick={() => navigate('/menu')}
                className="group relative rounded-2xl overflow-hidden bg-[#0E0E0E] border border-white/[0.08] hover:border-[#FF5500]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-4/3 bg-[#080808] p-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-[#FF5500]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={category.image}
                    alt={category.alt}
                    className="w-full h-full object-contain max-h-[160px] group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-2 border-t border-white/[0.06] bg-[#0E0E0E] flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5500] block">
                      {category.subtitle}
                    </span>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-white font-hero">
                      {category.title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed pt-1">
                      {category.desc}
                    </p>
                  </div>
                  
                  <div className="pt-3 flex items-center gap-1 text-[11px] font-bold text-[#FF5500] group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 06 — OUR PLACE (Edmonton, North London) */}
        {/* ========================================================================= */}
        <section 
          aria-label="Our Place - Edmonton"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
        >
          {/* Left: Location Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black text-[#FF5500] uppercase tracking-[0.25em]">
              <MapPin className="w-4 h-4" />
              <span>WHERE IT ALL BEGINS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero leading-[0.95]">
              STARTING IN EDMONTON, <br />
              <span className="text-[#FF5500]">NORTH LONDON.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>

            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              We're an independent business built by four mates who have spent years working in other people's kitchens. Now, we're building one of our own. And Edmonton is where it all begins.
            </p>
          </div>

          {/* Right: Location Brand Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#141414] to-[#0A0A0A] p-7 sm:p-8 space-y-6 shadow-2xl">
              <div className="space-y-1 border-b border-white/[0.08] pb-5">
                <span className="text-xs font-black tracking-widest text-[#FF5500] uppercase block">
                  ORIGINAL KITCHEN
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-hero text-white">
                  PATTY PROJECT
                </h3>
                <p className="text-sm font-semibold text-white/90">
                  Edmonton, North London
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#9CA3AF]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <span>4 Market Parade, London N9 9HF</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <span>Dine-In • Collection • Fast Delivery</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-[#181818] hover:bg-[#FF5500] hover:text-white text-white border border-white/[0.15] hover:border-[#FF5500] py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>GET IN TOUCH</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 07 — FINAL RESTAURANT CTA */}
        {/* ========================================================================= */}
        <section 
          aria-label="Final Call to Action"
          className="relative rounded-3xl bg-gradient-to-b from-[#161616] via-[#101010] to-[#080808] border border-white/[0.1] p-8 sm:p-12 lg:p-16 overflow-hidden text-center space-y-8 shadow-2xl"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF5500]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero text-white leading-tight">
              READY FOR A <br />
              <span className="text-[#FF5500]">PROPER BURGER?</span>
            </h2>

            <p className="text-base sm:text-lg text-[#9CA3AF] font-medium leading-relaxed">
              Good food. Big flavour. No unnecessary fuss.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/order')}
              className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#FF5500]/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>ORDER NOW</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="w-full sm:w-auto bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.15] px-8 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <span>VIEW MENU</span>
            </button>
          </div>

          {/* Brand Signature & Lockup */}
          <div className="relative z-10 pt-10 border-t border-white/[0.08] max-w-md mx-auto space-y-1.5">
            <div className="text-2xl font-black uppercase tracking-widest text-white font-hero">
              PATTY PROJECT
            </div>
            <p className="text-sm font-bold text-[#FF5500] tracking-wide">
              Four mates. One project. Proper food.
            </p>
            <p className="text-xs text-[#71717A] uppercase tracking-widest">
              A Foody Chefs Ltd Brand
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CustomerAbout;
