import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, Sparkles, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

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
      id: 'wings',
      title: 'WING WEDNESDAY',
      subtitle: '20% OFF On All Wings',
      badge: '20% OFF',
      code: 'WINGS20',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=500&q=80',
      description: 'Crispy fried chicken wings tossed in buffalo, honey BBQ, or naga chilli sauce. Available all day Wednesday.'
    },
    {
      id: 'student',
      title: 'STUDENT OFFER',
      subtitle: '10% OFF On All Orders',
      badge: '10% OFF',
      code: 'STUDENT10',
      isStudent: true,
      description: 'Valid student ID required at pickup or delivery. Discount applies automatically at checkout.'
    },
    {
      id: 'family',
      title: 'FAMILY FEAST BUNDLE',
      subtitle: '4 Burgers + 2 Sides + 4 Drinks',
      badge: 'SAVE £12',
      code: 'FAMILY4',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',
      description: 'Feed the whole crew with 4 smash burgers, 2 large fries, 10 wings, and 4 sodas.'
    }
  ];

  return (
    <div className="relative min-h-screen text-white bg-[#070707] bg-[url('/offersbackground.jpg')] bg-cover bg-center bg-fixed bg-no-repeat flex flex-col justify-between">
      {/* Dark overlay backdrop for readable text & contrast */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[1450px] mx-auto px-4 sm:px-10 lg:px-12 py-6 sm:py-10 pb-36 space-y-10">
        {/* Header Section */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/40 text-[#FF5500] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Deals & Discounts</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-hero uppercase tracking-tight">
            Special Offers
          </h1>
          <p className="text-sm text-[#9CA3AF] max-w-2xl font-medium">
            Save big on your favorite London smash burgers, meal deals, and crispy chicken bundles.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {offersList.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#0D0D0D]/90 border border-[#222222] hover:border-[#FF5500]/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all hover:scale-[1.01] group backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-[#FF5500] text-white text-[11px] font-black rounded-lg uppercase tracking-wider shadow-md shadow-[#FF5500]/30">
                    {offer.badge}
                  </span>
                  <h3 className="text-2xl font-black text-white font-hero uppercase tracking-wide">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-[#FF5500] font-bold uppercase tracking-wider">
                    {offer.subtitle}
                  </p>
                  <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed pt-1">
                    {offer.description}
                  </p>
                </div>

                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-28 sm:w-36 h-28 sm:h-36 object-cover rounded-2xl border border-[#262626] shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : offer.isStudent ? (
                  <div className="w-28 sm:w-36 h-28 sm:h-36 bg-[#161616] border border-[#262626] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xl shrink-0 group-hover:border-[#FF5500]/40 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500] font-extrabold text-xs mb-1.5 shadow-md">
                      ID
                    </div>
                    <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">STUDENT OFFER</span>
                    <span className="text-[9px] text-[#6B7280] mt-0.5">PATTY PROJECT</span>
                  </div>
                ) : null}
              </div>

              <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
                  <Tag className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>CODE: <strong className="text-white">{offer.code}</strong></span>
                </div>

                <button
                  onClick={() => {
                    if (selectedBranch) {
                      navigate('/menu');
                    } else {
                      navigate('/select-location');
                    }
                  }}
                  className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF5500]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>CLAIM OFFER</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <footer className="relative z-10 w-full bg-black pt-12 pb-6 text-white">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 space-y-12">
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-xs text-[#9CA3AF]">
            {/* Column 1: SHOP */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                SHOP
              </h3>
              <ul className="space-y-2.5 font-medium">
                <li><Link to="/menu" className="hover:text-white transition-colors">All Product</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Burger</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Sides</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Drink</Link></li>
              </ul>
            </div>

            {/* Column 2: ABOUT US */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                ABOUT US
              </h3>
              <ul className="space-y-2.5 font-medium">
                <li><Link to="/about" className="hover:text-white transition-colors">Story Behind</Link></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Customer Reviews</a></li>
                <li><a href="#packaging" className="hover:text-white transition-colors">Packaging Philosophy</a></li>
                <li><a href="#affiliate" className="hover:text-white transition-colors">Affiliate Program</a></li>
              </ul>
            </div>

            {/* Column 3: HELP */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                HELP
              </h3>
              <ul className="space-y-2.5 font-medium">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/select-location" className="hover:text-white transition-colors">Where to Buy</Link></li>
                <li><a href="#shipping" className="hover:text-white transition-colors">Shipping and Returns</a></li>
                <li><a href="#returns" className="hover:text-white transition-colors">Return and Refunds</a></li>
              </ul>
            </div>

            {/* Column 4: CONTACT */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                CONTACT
              </h3>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#FF5500] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:hello@pattyproject.co.uk" className="hover:text-white transition-colors">
                    hello@pattyproject.co.uk
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a href="https://maps.app.goo.gl/ucRr3c94PQKGgq4L7?g_st=aw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    4 Market Parade, London N9 9HF, United Kingdom
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7280]">
            <p>© {new Date().getFullYear()} Patty Project UK. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerOffers;
