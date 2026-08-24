import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, ChevronRight, Utensils } from 'lucide-react';

export const CustomerAbout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER - Industry Standard Burger Shop Banner */}
      {/* ========================================================================= */}
      <section 
        aria-label="About Us Header Banner"
        className="w-full bg-black relative overflow-hidden min-h-[300px] sm:min-h-[360px] lg:h-[400px] flex items-center justify-center pt-6 sm:pt-8 border-b border-white/[0.08]"
      >
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1400px] h-full mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between relative z-10 py-8 sm:py-0">
          {/* Left Hero Text */}
          <div className="w-full sm:w-1/2 lg:max-w-[620px] text-left z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT US</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight leading-[0.92] font-hero">
              <span className="text-white block">FOUR MATES.</span>
              <span className="text-[#FF5500] block">ONE PROJECT.</span>
              <span className="text-white block">PROPER BURGERS.</span>
            </h1>
          </div>

          {/* Right Hero Burger Visual */}
          <div className="w-full sm:w-1/2 h-[220px] sm:h-full max-w-[560px] flex items-center justify-center sm:justify-end overflow-hidden pointer-events-none select-none mt-6 sm:mt-0">
            <img
              src="/hero_burger_flame.png"
              alt="Patty Project Signature Double Smash Burger"
              className="h-full w-auto max-h-[260px] sm:max-h-[320px] lg:max-h-[360px] object-contain object-center sm:object-right drop-shadow-[0_20px_40px_rgba(255,85,0,0.25)]"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN STORY SECTIONS */}
      {/* ========================================================================= */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24 space-y-20 sm:space-y-28">
        
        {/* STORY PART 1: The Experience & Philosophy */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Visual Card */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#111111] aspect-4/3 sm:aspect-16/10 shadow-2xl group">
            <img
              src="/signature_burgers_showcase.jpg"
              alt="London kitchen craft"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#FF5500]" />
                London Kitchen Craft
              </span>
              <span className="text-[11px] font-mono text-[#71717A]">EST. EDMONTON</span>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-7 space-y-6 text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            <p className="text-white text-lg sm:text-xl font-bold leading-snug">
              Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
            </p>

            <p>
              Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
            </p>

            <div className="pt-2 space-y-1">
              <p className="text-white font-medium">
                So we decided to put that experience into our own project.
              </p>
              <p className="text-2xl sm:text-3xl font-black uppercase text-[#FF5500] font-hero tracking-wide">
                Patty Project.
              </p>
            </div>
          </div>
        </section>

        {/* STORY PART 2: Edmonton & London Roots */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-[#9CA3AF] text-base sm:text-lg leading-relaxed order-2 lg:order-1">
            <p className="text-white text-lg sm:text-xl font-semibold leading-relaxed">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>

            <p>
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#121212] aspect-4/3 flex items-center justify-center p-6 shadow-2xl group order-1 lg:order-2">
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/[0.1] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-bold text-[#FF5500]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Edmonton, North London</span>
            </div>
            <img
              src="/product_the_mc_project.png"
              alt="The MC Project Double Smash Burger"
              className="w-full h-full object-contain max-h-[220px] group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
              loading="lazy"
            />
          </div>
        </section>

        {/* STORY PART 3: The Four Mates & Future */}
        <section className="relative rounded-3xl bg-gradient-to-b from-[#161616] to-[#0A0A0A] border border-white/[0.1] p-8 sm:p-12 lg:p-14 text-center space-y-6 shadow-2xl overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FF5500]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <p className="text-base sm:text-lg text-[#D1D5DB] leading-relaxed">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-hero leading-tight">
              Now, we're building one of our own.
            </h2>

            <p className="text-xl sm:text-2xl font-black uppercase text-[#FF5500] font-hero tracking-wide">
              And Edmonton is where it all begins.
            </p>
          </div>

          {/* Quick Menu Action Button */}
          <div className="relative z-10 pt-4 flex justify-center">
            <button
              onClick={() => navigate('/menu')}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#FF5500]/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore The Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* BRAND SIGNATURE FOOTER */}
        <footer className="pt-10 border-t border-white/[0.08] text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white font-hero">
            PATTY PROJECT
          </h3>
          <p className="text-sm sm:text-base font-bold text-[#FF5500] tracking-wide">
            Four mates. One project. Proper food.
          </p>
          <p className="text-xs text-[#71717A] uppercase tracking-widest font-medium pt-1">
            A Foody Chefs Ltd Brand
          </p>
        </footer>

      </div>
    </div>
  );
};

export default CustomerAbout;
