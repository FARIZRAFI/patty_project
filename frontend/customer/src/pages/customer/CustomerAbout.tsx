import React from 'react';

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF5A00] selection:text-white pb-20">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-8 sm:pt-12 lg:pt-14">
        
        {/* ========================================================================= */}
        {/* HERO SECTION: Two-Column Headline & Signature Burger */}
        {/* ========================================================================= */}
        <section aria-label="About Us Hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[320px] lg:min-h-[400px]">
          {/* Left Column: Headline */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#FF5A00] block">
              ABOUT US
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-black tracking-tight leading-[1.0] text-white font-hero">
              <span className="block">Four mates.</span>
              <span className="block">One project.</span>
              <span className="block text-[#FF5A00]">Proper burgers.</span>
            </h1>
          </div>

          {/* Right Column: Hero Burger Photography */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] lg:max-w-[540px] aspect-4/3 sm:aspect-16/10 flex items-center justify-center">
              <img
                src="/hero_burger_flame.png"
                alt="Patty Project Gourmet Double Smash Burger"
                className="w-full h-full max-h-[280px] sm:max-h-[360px] lg:max-h-[420px] object-contain object-center lg:object-right select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(255,90,0,0.18)]"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MAIN SECTION: Story Column (Left) & Brand Principles (Right) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 pt-12 sm:pt-16 border-t border-white/[0.08] mt-6 sm:mt-10">
          
          {/* Left Column: Authentic Brand Narrative */}
          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[#A1A1A1] leading-[1.75]">
            <p>
              <span className="text-[#FF5A00] font-semibold">Patty Project</span> started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
            </p>

            <p>
              Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
            </p>

            <p>
              So we decided to put that experience into our own project.
            </p>

            <p className="text-white font-bold text-base sm:text-lg">
              <span className="text-[#FF5A00]">Patty Project.</span>
            </p>

            <p>
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>

            <p>
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>

            <p>
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>

            <div className="space-y-1 pt-1">
              <p className="text-white font-semibold">
                Now, we're building one of our own.
              </p>
              <p className="text-base sm:text-lg font-bold text-[#FF5A00]">
                And Edmonton is where it all begins.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Brand Principles */}
          <div className="lg:col-span-5 space-y-0 divide-y divide-white/[0.08] border-t lg:border-t-0 border-b border-white/[0.08]">
            
            {/* 01: FOUR MATES */}
            <div className="py-6 sm:py-7 flex items-start gap-5">
              <div className="p-2 rounded-xl bg-[#0D0D0D] border border-white/[0.06] text-[#FF5A00] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                  FOUR MATES
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  Different strengths, same passion for proper food.
                </p>
              </div>
            </div>

            {/* 02: YEARS OF EXPERIENCE */}
            <div className="py-6 sm:py-7 flex items-start gap-5">
              <div className="p-2 rounded-xl bg-[#0D0D0D] border border-white/[0.06] text-[#FF5A00] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" y1="17" x2="18" y2="17" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                  YEARS OF EXPERIENCE
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  From kitchen hands to team leaders — we've done it all.
                </p>
              </div>
            </div>

            {/* 03: ROOTED IN LONDON */}
            <div className="py-6 sm:py-7 flex items-start gap-5">
              <div className="p-2 rounded-xl bg-[#0D0D0D] border border-white/[0.06] text-[#FF5A00] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M12 21s-6-5.333-6-10a6 6 0 0 1 12 0c0 4.667-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                  ROOTED IN LONDON
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  London's kitchens shaped our journey and our flavour.
                </p>
              </div>
            </div>

            {/* 04: PROPER FOOD */}
            <div className="py-6 sm:py-7 flex items-start gap-5">
              <div className="p-2 rounded-xl bg-[#0D0D0D] border border-white/[0.06] text-[#FF5A00] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M4 11a8 8 0 0 1 16 0v1H4v-1z" />
                  <rect x="2" y="15" width="20" height="2" rx="1" />
                  <path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1H4v1z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                  PROPER FOOD
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  Quality ingredients. Proper prep. Bold flavours.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* FOOTER SIGNATURE: Minimal Clean Lockup */}
        {/* ========================================================================= */}
        <footer className="mt-16 sm:mt-20 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-[0.2em] text-white font-hero">
              PATTY PROJECT
            </h2>
            <p className="text-xs sm:text-sm text-[#FF5A00] font-medium">
              Four mates. One project. Proper food.
            </p>
          </div>

          <div className="text-xs text-[#A1A1A1]">
            A <span className="text-[#FF5A00] font-semibold">Foody Chefs Ltd</span> Brand
          </div>
        </footer>

      </div>
    </div>
  );
};

export default CustomerAbout;
