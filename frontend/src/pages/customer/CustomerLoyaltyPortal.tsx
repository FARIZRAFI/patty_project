import React, { useEffect, useState } from 'react';
import { Star, Gift, ShoppingBag, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';

export const CustomerLoyaltyPortal: React.FC = () => {
  const [loyaltyData, setLoyaltyData] = useState<any>(null);

  useEffect(() => {
    api.get('/loyalty/balance').then(setLoyaltyData).catch(console.error);
  }, []);

  const availablePoints = loyaltyData?.available_points || 1250;
  const targetPoints = 1500;
  const progressPercent = Math.min(100, (availablePoints / targetPoints) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Loyalty Points & Rewards</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Earn points on every order and unlock exciting rewards!</p>
      </div>

      {/* Points Balance Card (Matching Page 15 of Loyalty PDF) */}
      <div className="bg-[#121212] border border-[#262626] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FF5500]/10 border-2 border-[#FF5500] flex items-center justify-center text-[#FF5500]">
            <Star className="w-8 h-8 fill-[#FF5500]" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">{availablePoints.toLocaleString()}</h2>
            <p className="text-xs text-[#FF5500] font-bold uppercase tracking-wider">Available Points</p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Gift className="w-4 h-4 text-[#FF5500]" />
            <span>You're just {targetPoints - availablePoints} points away from your next reward!</span>
          </div>

          <div className="w-full bg-[#1A1A1A] h-2.5 rounded-full overflow-hidden border border-[#262626]">
            <div className="bg-[#FF5500] h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-[10px] text-right font-bold text-[#9CA3AF]">{availablePoints} / {targetPoints} points</p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">How It Works</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xl text-center space-y-2">
            <ShoppingBag className="w-6 h-6 text-[#FF5500] mx-auto" />
            <p className="font-bold text-xs text-white">1. Order</p>
            <p className="text-[10px] text-[#6B7280]">Place an order and earn points</p>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xl text-center space-y-2">
            <Star className="w-6 h-6 text-[#FF5500] mx-auto fill-[#FF5500]" />
            <p className="font-bold text-xs text-white">2. Earn Points</p>
            <p className="text-[10px] text-[#6B7280]">Earn 10 points for every £1 spent</p>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xl text-center space-y-2">
            <Gift className="w-6 h-6 text-[#FF5500] mx-auto" />
            <p className="font-bold text-xs text-white">3. Redeem</p>
            <p className="text-[10px] text-[#6B7280]">Redeem points for exciting rewards</p>
          </div>
        </div>
      </div>

      {/* Redeem Rewards Catalog List (Matching Page 15 of Loyalty PDF) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Redeem Rewards</h3>

        <div className="space-y-3">
          {/* Reward 1 */}
          <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=200&q=80" alt="Free Fries" className="w-14 h-14 object-cover rounded-xl border border-[#262626]" />
              <div>
                <h4 className="font-bold text-white text-xs">Free Fries</h4>
                <p className="text-[10px] text-[#9CA3AF]">Get a regular fries absolutely free!</p>
              </div>
            </div>

            <div className="text-right space-y-2">
              <span className="font-bold text-xs text-[#FF5500]">500 Points</span>
              <button className="block w-full bg-[#1A1A1A] hover:bg-[#FF5500] text-white border border-[#262626] px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                Redeem
              </button>
            </div>
          </div>

          {/* Reward 2 */}
          <div className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80" alt="Free Burger" className="w-14 h-14 object-cover rounded-xl border border-[#262626]" />
              <div>
                <h4 className="font-bold text-white text-xs">Free Burger</h4>
                <p className="text-[10px] text-[#9CA3AF]">Get any classic burger absolutely free!</p>
              </div>
            </div>

            <div className="text-right space-y-2">
              <span className="font-bold text-xs text-[#FF5500]">1,500 Points</span>
              <button className="block w-full bg-[#1A1A1A] hover:bg-[#FF5500] text-white border border-[#262626] px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                Redeem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
