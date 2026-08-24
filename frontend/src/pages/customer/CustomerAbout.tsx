import React from 'react';

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white">
      {/* Container aligned with the exact 2-column reference model */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Giant "Our story" Header with playful accent burst */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4 text-left">
            {/* Burst / Spark Graphic Icon matching reference model */}
            <div className="relative inline-block">
              <svg className="w-12 h-12 text-[#FF5500]" viewBox="0 0 48 48" fill="none">
                <path d="M10 26L4 24M16 14L10 8M24 10L26 4" stroke="#FF5500" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="12" cy="20" r="3" fill="#FF5500"/>
                <circle cx="20" cy="12" r="3" fill="#FF5500"/>
              </svg>
            </div>

            {/* Giant Title matching reference */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight font-hero">
              Our <br />
              <span className="text-white">story</span>
            </h1>

            {/* Sub-tagline */}
            <p className="pt-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#FF5500]">
              ABOUT US • Four Mates. One Project.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Editorial Story Content */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10 text-left">
            
            {/* Paragraph 1 */}
            <p className="text-xl sm:text-2xl lg:text-[25px] text-white font-medium leading-[1.45]">
              Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
            </p>

            {/* Paragraph 2 */}
            <p className="text-base sm:text-lg lg:text-[19px] text-[#A1A1AA] leading-[1.75]">
              Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
            </p>

            {/* Paragraph 3 & Highlight */}
            <div className="space-y-3 py-2">
              <p className="text-base sm:text-lg lg:text-[19px] text-[#D1D5DB] leading-[1.75]">
                So we decided to put that experience into our own project.
              </p>
              <p className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-[#FF5500] font-hero">
                Patty Project.
              </p>
            </div>

            {/* Paragraph 4 */}
            <p className="text-base sm:text-lg lg:text-[19px] text-[#A1A1AA] leading-[1.75]">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>

            {/* Paragraph 5 */}
            <p className="text-base sm:text-lg lg:text-[19px] text-[#A1A1AA] leading-[1.75]">
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>

            {/* Paragraph 6, 7 & 8: Climax Block */}
            <div className="space-y-4 pt-8 border-t border-white/[0.08]">
              <p className="text-base sm:text-lg lg:text-[19px] text-[#D1D5DB] leading-[1.75]">
                We're an independent business built by four mates who have spent years working in other people's kitchens.
              </p>
              <p className="text-xl sm:text-2xl lg:text-[26px] font-black uppercase text-white font-hero tracking-tight leading-tight">
                Now, we're building one of our own.
              </p>
              <p className="text-lg sm:text-xl font-bold text-[#FF5500]">
                And Edmonton is where it all begins.
              </p>
            </div>

            {/* Brand Closing Signature */}
            <footer className="pt-10 sm:pt-14 border-t border-white/[0.08] space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white font-hero">
                PATTY PROJECT
              </h2>
              <p className="text-sm sm:text-base font-bold text-[#FF5500] tracking-wide">
                Four mates. One project. Proper food.
              </p>
              <p className="text-xs text-[#71717A] uppercase tracking-widest font-medium pt-1">
                A Foody Chefs Ltd Brand
              </p>
            </footer>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerAbout;
