import React from 'react';

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-8 sm:pt-14">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4 border-b border-white/[0.08] pb-8">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#FF5500] block">
            ABOUT US
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white italic font-hero leading-tight">
            Four Mates. One Project. Proper Burgers.
          </h1>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-6 text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
          <p className="text-white/90 font-medium">
            Patty Project started with four mates, years of experience in London's kitchens, and one shared idea — to build something of our own.
          </p>

          <p>
            Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
          </p>

          <div className="space-y-1">
            <p>So we decided to put that experience into our own project.</p>
            <p className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#FF5500]">
              Patty Project.
            </p>
          </div>

          <p>
            Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
          </p>

          <p>
            London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
          </p>

          <div className="space-y-2 py-4 border-l-2 border-[#FF5500] pl-5 my-6">
            <p className="text-white/90">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>
            <p className="text-white font-bold text-lg sm:text-xl">
              Now, we're building one of our own.
            </p>
            <p className="text-[#FF5500] font-bold text-base sm:text-lg">
              And Edmonton is where it all begins.
            </p>
          </div>
        </div>

        {/* Brand Stamp / Sign-off */}
        <div className="pt-10 border-t border-white/[0.08] space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white font-hero">
            PATTY PROJECT
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#FF5500] tracking-wide">
            Four mates. One project. Proper food.
          </p>
          <p className="text-xs text-[#71717A] uppercase tracking-wider">
            A Foody Chefs Ltd Brand
          </p>
        </div>

      </div>
    </div>
  );
};

export default CustomerAbout;
