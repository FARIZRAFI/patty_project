import React, { useEffect, useRef } from 'react';

// Apple-inspired smooth scroll reveal wrapper (respects prefers-reduced-motion)
const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export const CustomerAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white">
      {/* 1280px-1360px Professional Editorial Canvas */}
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* ========================================================================= */}
        {/* SECTION 01 — CINEMATIC HERO */}
        {/* ========================================================================= */}
        <section 
          aria-label="About Us Hero"
          className="min-h-[75vh] sm:min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-center pt-16 sm:pt-24 pb-16"
        >
          <div className="space-y-6 sm:space-y-8">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#FF5500] block">
              ABOUT US
            </span>

            <h1 className="text-[2.75rem] sm:text-[4rem] md:text-[5rem] lg:text-[6.25rem] font-black uppercase tracking-[-0.035em] text-white font-hero leading-[0.92] max-w-[1080px]">
              <span className="block">FOUR MATES.</span>
              <span className="block">ONE PROJECT.</span>
              <span className="block text-[#FF5500]">PROPER BURGERS.</span>
            </h1>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 02 — THE OPENING STATEMENT */}
        {/* ========================================================================= */}
        <RevealSection className="py-20 sm:py-28 lg:py-36 border-t border-white/[0.08]">
          <div className="max-w-[960px]">
            <p className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold text-[#E5E7EB] tracking-[-0.025em] leading-[1.14]">
              Patty Project started with four mates, years of experience in London's kitchens, and one shared idea —{' '}
              <span className="text-white block mt-2 font-black">
                to build something of our own.
              </span>
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 03 — STORY (The Experience) */}
        {/* ========================================================================= */}
        <RevealSection className="py-20 sm:py-28 lg:py-36 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8">
              <p className="text-lg sm:text-xl lg:text-[22px] text-[#A1A1AA] font-normal leading-[1.7] max-w-[780px]">
                Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
              </p>
            </div>
            {/* Intentional Empty Whitespace for Apple-level Balance */}
            <div className="hidden lg:block lg:col-span-4" />
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 04 — THE TURNING POINT */}
        {/* ========================================================================= */}
        <RevealSection className="py-24 sm:py-32 lg:py-44 border-t border-white/[0.08]">
          <div className="space-y-8 sm:space-y-12">
            <p className="text-xl sm:text-2xl md:text-3xl text-[#D1D5DB] font-medium tracking-tight max-w-[800px]">
              So we decided to put that experience into our own project.
            </p>
            
            <div className="pt-2 pb-6 border-b border-white/[0.08]">
              <span className="text-[3.5rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[8rem] font-black uppercase tracking-[-0.04em] text-[#FF5500] font-hero leading-[0.88] block select-none">
                PATTY PROJECT.
              </span>
            </div>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 05 — WHAT WE'RE BUILDING */}
        {/* ========================================================================= */}
        <RevealSection className="py-20 sm:py-28 lg:py-36 border-t border-white/[0.08]">
          <div className="max-w-[880px]">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] text-white font-semibold tracking-[-0.015em] leading-[1.38]">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 06 — LONDON */}
        {/* ========================================================================= */}
        <RevealSection className="py-20 sm:py-28 lg:py-36 border-t border-white/[0.08]">
          <div className="max-w-[860px]">
            <p className="text-lg sm:text-xl lg:text-[22px] text-[#A1A1AA] font-normal leading-[1.7]">
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 07 — THE FOUR MATES */}
        {/* ========================================================================= */}
        <RevealSection className="py-24 sm:py-32 lg:py-40 border-t border-white/[0.08]">
          <div className="max-w-[980px]">
            <p className="text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-black uppercase text-white font-hero tracking-[-0.025em] leading-[1.02]">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 08 — THE FUTURE */}
        {/* ========================================================================= */}
        <RevealSection className="py-24 sm:py-32 lg:py-44 border-t border-white/[0.08] space-y-6 sm:space-y-8">
          <p className="text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.5rem] font-black uppercase text-white font-hero tracking-tight leading-[0.96]">
            Now, we're building one of our own.
          </p>
          <p className="text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-black uppercase text-[#FF5500] font-hero tracking-tight leading-[0.96]">
            And Edmonton is where it all begins.
          </p>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 09 — BRAND SIGNATURE */}
        {/* ========================================================================= */}
        <footer className="pt-16 sm:pt-20 pb-28 sm:pb-36 border-t border-white/[0.08] space-y-2 text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-[0.15em] text-white font-hero">
            PATTY PROJECT
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#FF5500] tracking-wide">
            Four mates. One project. Proper food.
          </p>
          <p className="text-xs text-[#71717A] uppercase tracking-[0.2em] font-medium pt-1">
            A Foody Chefs Ltd Brand
          </p>
        </footer>

      </div>
    </div>
  );
};

export default CustomerAbout;
