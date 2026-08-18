import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PublicMenuPage: React.FC = () => {
  const navigate = useNavigate();

  // Clicking any image returns to Home page Hero section
  const handleImageClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white pb-24">
      {/* Main Container rendering exact public menu images */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* PAGE 1: public_menu1.png */}
        <div
          onClick={handleImageClick}
          className="cursor-pointer group rounded-2xl overflow-hidden shadow-2xl border border-[#222222] transition-transform hover:scale-[1.005]"
        >
          <img
            src="/public_menu1.png"
            alt="Patty Project Menu - Burgers & Sandos (01)"
            className="w-full h-auto object-contain block bg-black"
          />
        </div>

        {/* PAGE 2: public_menu2.png */}
        <div
          onClick={handleImageClick}
          className="cursor-pointer group rounded-2xl overflow-hidden shadow-2xl border border-[#222222] transition-transform hover:scale-[1.005]"
        >
          <img
            src="/public_menu2.png"
            alt="Patty Project Menu - Wings & Sides / Drinks (02)"
            className="w-full h-auto object-contain block bg-black"
          />
        </div>

        {/* PAGE 3: public_menu3.png */}
        <div
          onClick={handleImageClick}
          className="cursor-pointer group rounded-2xl overflow-hidden shadow-2xl border border-[#222222] transition-transform hover:scale-[1.005]"
        >
          <img
            src="/public_menu3.png"
            alt="Patty Project Menu - Breakfast & Dips (03)"
            className="w-full h-auto object-contain block bg-black"
          />
        </div>

      </div>
    </div>
  );
};
