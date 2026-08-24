import React from 'react';

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white">
      {/* Centered Page Container matching mockup */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-16 pb-20">
        
        {/* ========================================================================= */}
        {/* HERO SECTION: Split Left Title & Right Burger Visual */}
        {/* ========================================================================= */}
        <section aria-label="About Us Hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#FF5500] block">
              ABOUT US
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-black uppercase tracking-tight leading-[0.94] font-hero">
              <span className="text-white block">FOUR MATES.</span>
              <span className="text-white block">ONE PROJECT.</span>
              <span className="text-[#FF5500] block">PROPER BURGERS.</span>
            </h1>

            {/* Orange underline accent matching mockup */}
            <div className="w-12 h-1 bg-[#FF5500] mt-4" />
          </div>

          {/* Right Hero Image matching mockup */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-4/3 sm:aspect-16/10 flex items-center justify-center">
              <img
                src="/hero_burger_flame.png"
                alt="Patty Project Signature Burger and Fries"
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(255,85,0,0.2)] select-none pointer-events-none"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LEAD STATEMENT: Full Width with Bottom Divider */}
        {/* ========================================================================= */}
        <section className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-white/[0.08]">
          <p className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-[1.3] max-w-[900px]">
            Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
          </p>
        </section>

        {/* ========================================================================= */}
        {/* MIDDLE SECTION 1: Two Columns (Story + Patty Project statement) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 pt-10 sm:pt-14">
          {/* Left Column: Kitchen Experience */}
          <div>
            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
            </p>
          </div>

          {/* Right Column: Patty Project highlight */}
          <div className="space-y-4">
            <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
              So we decided to put that experience into our own project.
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black uppercase text-[#FF5500] font-hero tracking-tight">
              PATTY PROJECT.
            </h2>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MIDDLE SECTION 2: Two Columns with Orange Outline Icons */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 pt-10 sm:pt-14 mt-10 sm:mt-14 border-t border-white/[0.08]">
          {/* Left Column: Edmonton Focus + Burger Icon */}
          <div className="space-y-4">
            <div className="w-10 h-10 text-[#FF5500]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                <path d="M4 11a8 8 0 0 1 16 0v1H4v-1z" />
                <rect x="2" y="15" width="20" height="2" rx="1" />
                <path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1H4v1z" />
              </svg>
            </div>
            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>
          </div>

          {/* Right Column: London Roots + Location Pin Icon */}
          <div className="space-y-4">
            <div className="w-10 h-10 text-[#FF5500]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                <path d="M12 21s-6-5.333-6-10a6 6 0 0 1 12 0c0 4.667-6 10-6 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            </div>
            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURE CALLOUT CARD: Dark box with Left Orange Accent Bar */}
        {/* ========================================================================= */}
        <section className="mt-12 sm:mt-16 rounded-2xl bg-[#0D0D0D] border border-white/[0.08] p-8 sm:p-10 lg:p-12 flex gap-6 sm:gap-8 items-stretch shadow-2xl">
          {/* Left Orange Accent Bar */}
          <div className="w-1.5 bg-[#FF5500] rounded-full shrink-0 self-stretch" />

          {/* Card Content */}
          <div className="space-y-4">
            <p className="text-base sm:text-lg lg:text-xl text-[#D1D5DB] leading-relaxed">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>
            <p className="text-2xl sm:text-3xl lg:text-[34px] font-black uppercase text-white font-hero tracking-tight leading-tight">
              NOW, WE'RE BUILDING ONE OF OUR OWN.
            </p>
            <p className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#FF5500] tracking-tight">
              And Edmonton is where it all begins.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BRAND SIGNATURE: Centered Footer */}
        {/* ========================================================================= */}
        <footer className="mt-16 sm:mt-24 pt-12 border-t border-white/[0.08] text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-[0.25em] text-white font-hero">
            PATTY PROJECT
          </h2>
          <div className="w-8 h-0.5 bg-[#FF5500] mx-auto my-2" />
          <p className="text-sm sm:text-base font-bold text-[#FF5500] tracking-wide">
            Four mates. One project. Proper food.
          </p>
          <p className="text-[11px] sm:text-xs text-[#71717A] uppercase tracking-[0.2em] font-medium">
            A FOODY CHEFS LTD BRAND
          </p>
        </footer>

      </div>
    </div>
  );
};

export default CustomerAbout;
