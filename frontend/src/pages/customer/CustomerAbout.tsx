import React from 'react';

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-10 sm:pt-16">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        
        {/* ========================================================================= */}
        {/* HEADER SECTION */}
        {/* ========================================================================= */}
        <header className="space-y-4">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#FF5500] block">
            ABOUT US
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-hero leading-[1.05]">
            Four Mates. One Project. Proper Burgers.
          </h1>
          {/* Subtle Accent Divider */}
          <div className="w-16 h-1 bg-[#FF5500] rounded-full mt-6 mb-8" />
        </header>

        {/* ========================================================================= */}
        {/* EDITORIAL STORY SECTION */}
        {/* ========================================================================= */}
        <article className="space-y-6 text-[#9CA3AF] text-base sm:text-lg leading-relaxed pt-2">
          
          <p className="text-white text-lg sm:text-xl font-medium leading-relaxed">
            Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
          </p>

          <p>
            Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
          </p>

          {/* Highlighted Patty Project Statement */}
          <div className="py-3 space-y-1.5 border-y border-white/[0.06] my-6">
            <p className="text-base sm:text-lg text-[#D1D5DB]">
              So we decided to put that experience into our own project.
            </p>
            <p className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-[#FF5500] font-hero">
              Patty Project.
            </p>
          </div>

          <p>
            Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
          </p>

          <p>
            London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
          </p>

          {/* Closing Narrative Accent Block */}
          <div className="space-y-3 pt-4 border-l-2 border-[#FF5500] pl-6 my-8">
            <p className="text-[#D1D5DB]">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>
            <p className="text-lg sm:text-xl font-black uppercase text-white font-hero tracking-tight">
              Now, we're building one of our own.
            </p>
            <p className="text-base sm:text-lg font-bold text-[#FF5500]">
              And Edmonton is where it all begins.
            </p>
          </div>

        </article>

        {/* ========================================================================= */}
        {/* BRAND CLOSING SECTION */}
        {/* ========================================================================= */}
        <footer className="pt-12 mt-12 border-t border-white/[0.08] space-y-2 text-left">
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
