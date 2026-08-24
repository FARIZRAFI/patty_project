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
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
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
      {/* 1200px–1280px Professional Editorial Canvas */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* ========================================================================= */}
        {/* SECTION 01 — HERO */}
        {/* ========================================================================= */}
        <section 
          aria-label="About Us Hero"
          className="pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 flex flex-col justify-center"
        >
          <div className="space-y-4 sm:space-y-5">
            {/* Eyebrow */}
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#FF5500] block">
              ABOUT US
            </span>

            {/* Main Headline: 60-72px on desktop */}
            <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-black uppercase tracking-tight text-white font-hero leading-[0.96] max-w-[880px]">
              Four Mates. One Project. <br className="hidden sm:inline" />
              <span className="text-white">Proper Burgers.</span>
            </h1>

            {/* Subtle accent divider */}
            <div className="w-14 h-1 bg-[#FF5500] rounded-full mt-5" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 02 — THE OPENING STATEMENT */}
        {/* ========================================================================= */}
        <RevealSection className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.07]">
          <div className="max-w-[780px]">
            <p className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-[1.3]">
              Patty Project started with four mates, years of experience in London's kitchens, and one shared idea —{' '}
              <span className="text-white font-extrabold block sm:inline">
                to build something of our own.
              </span>
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 03 — THE EXPERIENCE & PHILOSOPHY */}
        {/* ========================================================================= */}
        <RevealSection className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.07]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <p className="text-base sm:text-lg lg:text-[19px] text-[#9CA3AF] font-normal leading-[1.75] max-w-[740px]">
                Having worked across different kitchens in London, from cooking on the line to supervising busy services and leading teams, we've experienced first-hand what goes into running a good kitchen. Along the way, we learnt that great food doesn't need to be complicated. It needs quality ingredients, proper preparation, bold flavours and consistency.
              </p>
            </div>
            <div className="hidden lg:block lg:col-span-4" />
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 04 — THE TURNING POINT & PATTY PROJECT STATEMENT */}
        {/* ========================================================================= */}
        <RevealSection className="py-16 sm:py-24 lg:py-28">
          <div className="space-y-6 sm:space-y-8 max-w-[800px]">
            <p className="text-lg sm:text-xl lg:text-2xl text-[#D1D5DB] font-medium tracking-tight">
              So we decided to put that experience into our own project.
            </p>
            
            <div className="py-3">
              <span className="text-4xl sm:text-5xl lg:text-[68px] font-black uppercase tracking-tight text-[#FF5500] font-hero leading-[0.92] block select-none">
                Patty Project.
              </span>
            </div>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 05 — EDMONTON & FOOD PASSION */}
        {/* ========================================================================= */}
        <RevealSection className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.07]">
          <div className="max-w-[780px]">
            <p className="text-xl sm:text-2xl lg:text-[30px] text-white font-semibold tracking-tight leading-[1.38]">
              Starting in Edmonton, North London, we're focused on the food we love — proper burgers, crispy chicken, loaded fries, wings and sides made for people who appreciate big flavours and good food.
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 06 — LONDON CONNECTION */}
        {/* ========================================================================= */}
        <RevealSection className="py-14 sm:py-20 lg:py-24">
          <div className="max-w-[760px]">
            <p className="text-base sm:text-lg lg:text-[19px] text-[#9CA3AF] font-normal leading-[1.75]">
              London has played a huge part in our story. Its kitchens brought the four of us together, gave us experience and introduced us to different people, cultures, flavours and ways of cooking. Patty Project takes that experience and puts our own stamp on it.
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 07 — INDEPENDENT TEAM */}
        {/* ========================================================================= */}
        <RevealSection className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.07]">
          <div className="max-w-[820px]">
            <p className="text-2xl sm:text-3xl lg:text-[38px] font-black uppercase text-white font-hero tracking-tight leading-[1.08]">
              We're an independent business built by four mates who have spent years working in other people's kitchens.
            </p>
          </div>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 08 — THE FUTURE */}
        {/* ========================================================================= */}
        <RevealSection className="py-16 sm:py-24 lg:py-28 space-y-4 sm:space-y-6">
          <p className="text-3xl sm:text-4xl lg:text-[56px] font-black uppercase text-white font-hero tracking-tight leading-[0.98]">
            Now, we're building one of our own.
          </p>
          <p className="text-2xl sm:text-3xl lg:text-[46px] font-black uppercase text-[#FF5500] font-hero tracking-tight leading-[0.98]">
            And Edmonton is where it all begins.
          </p>
        </RevealSection>

        {/* ========================================================================= */}
        {/* SECTION 09 — BRAND SIGNATURE */}
        {/* ========================================================================= */}
        <footer className="pt-12 sm:pt-16 pb-20 sm:pb-28 border-t border-white/[0.07] space-y-1.5 text-left">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.1em] text-white font-hero">
            PATTY PROJECT
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#FF5500] tracking-wide">
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
