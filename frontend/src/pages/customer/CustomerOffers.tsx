import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Sparkles, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { CustomerFooter } from '../../components/customer/CustomerFooter';

export const CustomerOffers: React.FC = () => {
  const navigate = useNavigate();
  const { selectedBranch } = useCartStore();

  const offersList = [
    {
      id: 'combo',
      title: 'BURGER COMBO',
      subtitle: 'Burger + Fries + Drink',
      badge: 'SAVE 15%',
      code: 'COMBO15',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80',
      description: 'Get our signature double smash burger served with seasoned skin-on fries and any cold drink of your choice.'
    },
    {
      id: 'family',
      title: 'PATTY FEAST (FEEDS 4)',
      subtitle: '4 Burgers + 2 Loaded Fries + 4 Drinks',
      badge: 'POPULAR',
      code: 'FEAST20',
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80',
      description: 'The ultimate burger party box! Includes 4 classic smash burgers, 2 large rosemary salt fries, and 4 refreshing drinks.'
    },
    {
      id: 'lunch',
      title: 'LUNCH SPECIAL',
      subtitle: 'Available Mon - Fri, 12PM - 4PM',
      badge: '£9.99 ONLY',
      code: 'LUNCH99',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
      description: 'Quick lunch fix! Single smash patty burger or crispy chicken sando with skin-on fries for just £9.99.'
    },
    {
      id: 'shake',
      title: 'FREE SHAKE UPGRADE',
      subtitle: 'With any Burger & Fries order',
      badge: 'LIMITED TIME',
      code: 'SHAKEUPE',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80',
      description: 'Upgrade your soft drink to any handmade gourmet milkshake for free when you order a burger and sides.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Header Banner */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#262626] bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF5500]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Promo Codes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-hero">
            TODAY'S <span className="text-[#FF5500]">OFFERS</span>
          </h1>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-xl mx-auto">
            Enjoy exclusive deals and discounts at Patty Project {selectedBranch ? selectedBranch.name : 'London'}. Apply coupon codes at checkout!
          </p>
        </div>
      </section>

      {/* Offers Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offersList.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#121212] border border-[#262626] rounded-3xl overflow-hidden flex flex-col sm:flex-row hover:border-[#FF5500]/50 transition-all group"
            >
              <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-[#1A1A1A]">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md">
                  {offer.badge}
                </span>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide group-hover:text-[#FF5500] transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                    {offer.subtitle}
                  </p>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    {offer.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-[#1A1A1A] border border-[#333] px-3 py-1.5 rounded-xl text-white">
                    <Tag className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>{offer.code}</span>
                  </div>
                  <button
                    onClick={() => navigate('/menu')}
                    className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#FF5500]/20 cursor-pointer"
                  >
                    <span>Claim Deal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default CustomerOffers;
