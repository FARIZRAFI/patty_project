import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Flame, Award, HeartHandshake, ChevronRight } from 'lucide-react';

export const CustomerAbout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Hero Banner */}
      <section className="relative pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#262626] bg-[#0A0A0A] overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF5500]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage & Passion</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-hero">
            THE <span className="text-[#FF5500]">PATTY PROJECT</span> STORY
          </h1>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Born out of an obsession with the perfect burger crust, melt, and crunch. We bring London genuine gourmet smash burgers and crispy buttermilk sandos.
          </p>
        </div>
      </section>

      {/* Main Content Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Row 1: The Craft */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-black text-[#FF5500] uppercase tracking-widest">
              Uncompromising Quality
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-hero leading-tight">
              Smashed Fresh, <br />
              <span className="text-[#FF5500]">Never Frozen.</span>
            </h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Every single patty is pressed flat onto screaming-hot planchas to lock in pure beef flavour with razor-thin caramelized edges. Paired with toasted brioche buns, melted American cheese, and signature house-made sauces.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/menu')}
                className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#FF5500]/25 cursor-pointer"
              >
                <span>Explore The Menu</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-[#262626] bg-[#121212] aspect-video sm:aspect-4/3">
            <img
              src="/product_the_mc_project.png"
              alt="The MC Project Burger"
              className="w-full h-full object-contain p-6"
            />
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500]">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wide">100% Prime British Beef</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Locally sourced, ethically farmed prime cuts blended specifically for the ultimate smash burger juiciness and crust.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wide">Handcrafted Sauces</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              From our famous burger relish to hot-honey drizzle and creamy jalapeño mayo, every condiment is crafted in-house.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wide">Community & Service</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Friendly vibes, lightning-fast turnaround, and food that makes every single customer smile from first bite to last.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerAbout;
