import React from 'react';

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white pb-24">
      {/* Full-width responsive container matching global Header & Footer (max-w-[1720px]) */}
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 pt-10 sm:pt-14 lg:pt-16">
        
        {/* ========================================================================= */}
        {/* HERO SECTION: Split Left Title & Right Burger Visual */}
        {/* ========================================================================= */}
        <section aria-label="About Us Hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#FF5500] block">
              ABOUT US
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] 2xl:text-[90px] font-black uppercase tracking-tight leading-[0.92] font-hero">
              <span className="text-white block">FOUR MATES.</span>
              <span className="text-white block">ONE PROJECT.</span>
              <span className="text-[#FF5500] block">PROPER BURGERS.</span>
            </h1>

            {/* Orange underline accent matching mockup */}
            <div className="w-16 h-1 bg-[#FF5500] rounded-full mt-4 sm:mt-6" />
          </div>

          {/* Right Hero Image matching mockup */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[550px] lg:max-w-[620px] xl:max-w-[700px] aspect-4/3 sm:aspect-16/10 flex items-center justify-center">
              <img
                src="/hero_burger_flame.png"
                alt="Patty Project Signature Double Smash Burger"
                className="w-full h-full max-h-[340px] sm:max-h-[420px] lg:max-h-[460px] xl:max-h-[500px] object-contain drop-shadow-[0_25px_50px_rgba(255,85,0,0.25)] select-none pointer-events-none"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LEAD STATEMENT: Full Width with Bottom Divider */}
        {/* ========================================================================= */}
        <section className="pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 border-b border-white/[0.08]">
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold text-white tracking-tight leading-[1.25] max-w-[1400px]">
            Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
          </p>
        </section>

        {/* ========================================================================= */}
        {/* MIDDLE SECTION 1: Two Columns (Story + Patty Project statement) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 xl:gap-28 pt-12 sm:pt-16 lg:pt-20">
          {/* Left Column: Kitchen Experience */}
          <div>
            <p className="text-base sm:text-lg lg:text-xl xl:text-[22px] text-[#9CA3AF] leading-relaxed">
              Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
            </p>
          </div>

          {/* Right Column: Patty Project highlight */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg lg:text-xl xl:text-[22px] text-white font-medium leading-relaxed">
              So we decided to put that experience into our own project.
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-black uppercase text-[#FF5500] font-hero tracking-tight">
              PATTY PROJECT.
            </h2>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MIDDLE SECTION 2: Two Columns with Orange Outline Icons */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 xl:gap-28 pt-12 sm:pt-16 lg:pt-20 mt-12 sm:mt-16 border-t border-white/[0.08]">
          {/* Left Column: Edmonton Focus + Burger Icon */}
          <div className="space-y-5">
            <div className="w-12 h-12 text-[#FF5500]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
                <path d="M4 11a8 8 0 0 1 16 0v1H4v-1z" />
                <rect x="2" y="15" width="20" height="2" rx="1" />
                <path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1H4v1z" />
              </svg>
            </div>
            <p className="text-base sm:text-lg lg:text-xl xl:text-[22px] text-[#9CA3AF] leading-relaxed">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>
          </div>

          {/* Right Column: London Roots + Location Pin Icon */}
          <div className="space-y-5">
            <div className="w-12 h-12 text-[#FF5500]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11">
                <path d="M12 21s-6-5.333-6-10a6 6 0 0 1 12 0c0 4.667-6 10-6 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            </div>
            <p className="text-base sm:text-lg lg:text-xl xl:text-[22px] text-[#9CA3AF] leading-relaxed">
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURE CALLOUT CARD: Dark box with Left Orange Accent Bar */}
        {/* ========================================================================= */}
        <section className="mt-14 sm:mt-20 rounded-3xl bg-[#0D0D0D] border border-white/[0.08] p-8 sm:p-12 lg:p-16 flex gap-6 sm:gap-10 items-stretch shadow-2xl">
          {/* Left Orange Accent Bar */}
          <div className="w-2 bg-[#FF5500] rounded-full shrink-0 self-stretch" />

          {/* Card Content */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-[#D1D5DB] leading-relaxed">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>
            <p className="text-2xl sm:text-4xl lg:text-5xl xl:text-[56px] font-black uppercase text-white font-hero tracking-tight leading-tight">
              NOW, WE'RE BUILDING ONE OF OUR OWN.
            </p>
            <p className="text-xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold text-[#FF5500] tracking-tight">
              And Edmonton is where it all begins.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BRAND SIGNATURE: Centered Footer */}
        {/* ========================================================================= */}
        <footer className="mt-16 sm:mt-24 pt-14 border-t border-white/[0.08] text-center space-y-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-[0.25em] text-white font-hero">
            PATTY PROJECT
          </h2>
          <div className="w-12 h-1 bg-[#FF5500] mx-auto my-3 rounded-full" />
          <p className="text-sm sm:text-base lg:text-lg font-bold text-[#FF5500] tracking-wide">
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
