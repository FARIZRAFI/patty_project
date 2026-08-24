import React from 'react';

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pb-24 sm:pb-32 pt-14 sm:pt-20 lg:pt-24">
      {/* 1200px-1300px Maximum Page Container */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* ========================================================================= */}
        {/* HERO / INTRODUCTION */}
        {/* ========================================================================= */}
        <header className="space-y-5 sm:space-y-6">
          {/* Eyebrow */}
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#FF5500] block">
            ABOUT US
          </span>

          {/* Main Heading (Natural ~2 lines on desktop, 700px-850px width) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black uppercase tracking-tight text-white font-hero leading-[0.98] max-w-[850px]">
            Four Mates. One Project. <br className="hidden sm:inline" />
            Proper Burgers.
          </h1>

          {/* Subtle Accent Divider */}
          <div className="w-20 h-1 bg-[#FF5500] rounded-full mt-6 mb-8 sm:mb-12" />
        </header>

        {/* ========================================================================= */}
        {/* EDITORIAL STORY CONTENT */}
        {/* ========================================================================= */}
        <article className="max-w-[1040px] space-y-8 sm:space-y-10 text-[#9CA3AF] text-base sm:text-lg lg:text-[19px] leading-relaxed pt-2">
          
          {/* Lead Paragraph (Stronger Hierarchy) */}
          <p className="text-white text-xl sm:text-2xl lg:text-[26px] font-semibold leading-snug max-w-[840px]">
            Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
          </p>

          {/* Second Paragraph */}
          <p className="max-w-[800px]">
            Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
          </p>

          {/* Transition to Highlight */}
          <p className="max-w-[800px]">
            So we decided to put that experience into our own project.
          </p>

          {/* PATTY PROJECT HIGHLIGHT (Typographic Statement with Subtle Dividers) */}
          <div className="py-6 sm:py-8 my-4 sm:my-6 border-y border-white/[0.08] max-w-[840px]">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#FF5500] font-hero block">
              PATTY PROJECT.
            </span>
          </div>

          {/* Edmonton & Food Focus */}
          <p className="max-w-[800px]">
            Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
          </p>

          {/* London Connection */}
          <p className="max-w-[800px]">
            London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
          </p>

          {/* Closing Narrative Accent Block */}
          <div className="space-y-4 pt-6 pb-2 border-l-2 border-[#FF5500] pl-6 sm:pl-8 my-10 max-w-[840px]">
            <p className="text-[#D1D5DB] text-base sm:text-lg lg:text-[19px]">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>
            <p className="text-xl sm:text-2xl lg:text-[26px] font-black uppercase text-white font-hero tracking-tight leading-tight">
              Now, we're building one of our own.
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#FF5500] tracking-wide">
              And Edmonton is where it all begins.
            </p>
          </div>

        </article>

        {/* ========================================================================= */}
        {/* BRAND CLOSING SECTION */}
        {/* ========================================================================= */}
        <footer className="pt-12 sm:pt-16 mt-14 sm:mt-20 border-t border-white/[0.08] max-w-[840px] space-y-2 text-left">
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
  );
};

export default CustomerAbout;
