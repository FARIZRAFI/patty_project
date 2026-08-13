import React, { useState } from 'react';
import { Search, Plus, Ticket, Download } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const [coupons] = useState([
    { code: 'WELCOME10', name: 'Welcome Offer', type: 'Percentage', discount: '10% OFF', minOrder: '£15.00', limit: 1000, used: 432, validity: '1 May 2025 - 31 May 2025', status: 'Active' },
    { code: 'BURGER20', name: 'Burger Bonanza', type: 'Percentage', discount: '20% OFF', minOrder: '£20.00', limit: 500, used: 278, validity: '25 Apr 2025 - 25 May 2025', status: 'Active' },
    { code: 'FREESHIP', name: 'Free Shipping', type: 'Free Shipping', discount: 'Free Delivery', minOrder: '£10.00', limit: 'Unlimited', used: 1245, validity: '1 May 2025 - 31 May 2025', status: 'Active' },
    { code: 'FLAT15', name: 'Flat 15 Off', type: 'Fixed Amount', discount: '£15 OFF', minOrder: '£50.00', limit: 300, used: 103, validity: '20 Apr 2025 - 10 May 2025', status: 'Active' },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Coupons & Offers</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Create, manage and track all discounts and offers</p>
        </div>
        <button className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#FF5500]/20">
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table (Matching Page 9 of Admin PDF) */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase font-semibold border-b border-[#262626]">
            <tr>
              <th className="px-5 py-3.5">Coupon Code</th>
              <th className="px-5 py-3.5">Coupon Name</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Discount</th>
              <th className="px-5 py-3.5">Min. Order</th>
              <th className="px-5 py-3.5">Usage</th>
              <th className="px-5 py-3.5">Validity</th>
              <th className="px-5 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F]">
            {coupons.map((c, idx) => (
              <tr key={idx} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="px-5 py-4">
                  <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg font-mono font-bold">
                    {c.code}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-white">{c.name}</td>
                <td className="px-5 py-4 text-[#9CA3AF]">{c.type}</td>
                <td className="px-5 py-4 font-bold text-[#FF5500]">{c.discount}</td>
                <td className="px-5 py-4 font-medium text-white">{c.minOrder}</td>
                <td className="px-5 py-4">
                  <div className="w-32 space-y-1">
                    <div className="flex justify-between text-[10px] text-[#9CA3AF]">
                      <span>{c.used} used</span>
                      <span>{c.limit}</span>
                    </div>
                    <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF5500] h-full rounded-full" style={{ width: typeof c.limit === 'number' ? `${(c.used / c.limit) * 100}%` : '50%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#9CA3AF]">{c.validity}</td>
                <td className="px-5 py-4 text-right">
                  <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 rounded-full text-[10px] font-bold">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
