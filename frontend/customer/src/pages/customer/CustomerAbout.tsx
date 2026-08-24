import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Award, ChevronRight, Sparkles, MapPin, Users, UtensilsCrossed, ShieldCheck } from 'lucide-react';

export const CustomerAbout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* FULL SCREEN-WIDTH HEADER BANNER */}
      <section 
        aria-label="About Us Header Banner"
        className="w-full bg-black relative overflow-hidden min-h-[300px] sm:min-h-[360px] lg:h-[400px] flex items-center justify-center pt-4 sm:pt-6 border-b border-white/[0.08]"
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1720px] h-full mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between relative z-10 py-8 sm:py-0">
          {/* Left Text */}
          <div className="w-full sm:w-1/2 lg:max-w-[620px] text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-black uppercase tracking-widest mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT US</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight leading-[0.92] font-hero">
              <span className="text-white block">FOUR MATES.</span>
              <span className="text-[#FF5500] block">ONE PROJECT.</span>
              <span className="text-white block">PROPER BURGERS.</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-[#9CA3AF] text-sm sm:text-base leading-relaxed max-w-[480px]">
              Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
            </p>
          </div>

          {/* Right Hero Burger Visual */}
          <div className="w-full sm:w-1/2 h-[220px] sm:h-full max-w-[600px] flex items-center justify-center sm:justify-end overflow-hidden pointer-events-none select-none mt-6 sm:mt-0">
            <img
              src="/hero_burger_flame.png"
              alt="Signature Patty Project Double Smash Burger"
              className="h-full w-auto max-h-[260px] sm:max-h-[320px] lg:max-h-[360px] object-contain object-center sm:object-right drop-shadow-[0_20px_40px_rgba(255,85,0,0.25)]"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Main Content Showcase */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20">
        
        {/* Section 1: London Kitchen Experience */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black text-[#FF5500] uppercase tracking-widest">
              <UtensilsCrossed className="w-4 h-4" />
              <span>THE EXPERIENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero leading-tight">
              Forged in <br />
              <span className="text-[#FF5500]">London's Kitchens.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen.
            </p>
            <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
            </p>
            
            {/* Callout Quote */}
            <div className="p-5 rounded-2xl bg-[#121212] border-l-4 border-[#FF5500] border-y border-r border-white/[0.06] shadow-lg">
              <p className="text-base sm:text-lg font-bold text-white italic">
                “So we decided to put that experience into our own project.”
              </p>
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] block mt-1">
                — PATTY PROJECT
              </span>
            </div>
          </div>

          {/* 4 Pillars Card Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-[#121212] border border-white/[0.08] hover:border-[#FF5500]/40 rounded-2xl p-5 transition-all space-y-2 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Quality Ingredients</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed pl-12">
                Ethically sourced prime cuts, fresh artisan brioche, and premium produce in every batch.
              </p>
            </div>

            <div className="bg-[#121212] border border-white/[0.08] hover:border-[#FF5500]/40 rounded-2xl p-5 transition-all space-y-2 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] group-hover:scale-105 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Proper Preparation</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed pl-12">
                Smashed fresh to order on screaming-hot planchas for razor-crisp caramelized edges.
              </p>
            </div>

            <div className="bg-[#121212] border border-white/[0.08] hover:border-[#FF5500]/40 rounded-2xl p-5 transition-all space-y-2 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Bold Flavours</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed pl-12">
                House-crafted sauces, spicy relish, melted cheese, and custom spice blends.
              </p>
            </div>

            <div className="bg-[#121212] border border-white/[0.08] hover:border-[#FF5500]/40 rounded-2xl p-5 transition-all space-y-2 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Consistency</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed pl-12">
                Rigorous kitchen standards honed across years of high-tempo service.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Edmonton & North London Roots */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8">
          {/* Visual card */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#121212] aspect-4/3 flex items-center justify-center group shadow-xl">
            <img
              src="/product_the_mc_project.png"
              alt="The MC Project Burger"
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/[0.1] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-bold text-[#FF5500]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Edmonton, North London</span>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black text-[#FF5500] uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              <span>NORTH LONDON ROOTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero leading-tight">
              Starting in Edmonton, <br />
              <span className="text-[#FF5500]">North London.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>
            <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>
          </div>
        </section>

        {/* Section 3: Independent Business & Call To Action */}
        <section className="relative rounded-3xl bg-gradient-to-b from-[#181818] to-[#0D0D0D] border border-white/[0.1] p-8 sm:p-12 lg:p-14 overflow-hidden text-center space-y-8 shadow-2xl">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF5500]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-neutral-300 text-xs font-bold uppercase tracking-widest">
              <Users className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>INDEPENDENT FOOD CO.</span>
            </div>

            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-hero text-white leading-tight">
              Now, we're building <br />
              <span className="text-[#FF5500]">one of our own.</span>
            </h3>

            <p className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
              And Edmonton is where it all begins.
            </p>
          </div>

          {/* Action buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/menu')}
              className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5500]/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore The Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.15] px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Find Our Location</span>
            </button>
          </div>

          {/* Brand Signature / Footer Block */}
          <div className="relative z-10 pt-8 border-t border-white/[0.08] max-w-md mx-auto space-y-2">
            <div className="text-2xl font-black uppercase tracking-widest text-white font-hero">
              PATTY PROJECT
            </div>
            <p className="text-sm font-bold text-[#FF5500] tracking-wide">
              Four mates. One project. Proper food.
            </p>
            <p className="text-xs text-[#71717A] tracking-wider uppercase">
              A Foody Chefs Ltd Brand
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CustomerAbout;
