import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export const CustomerOrderHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ALL');

  const orders = [
    { number: '#PP12345', date: '10 May 2025 • 08:45 PM', items: '2 Items', total: '£18.45', status: 'Delivered', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80' },
    { number: '#PP12312', date: '08 May 2025 • 07:30 PM', items: '1 Item', total: '£8.95', status: 'Delivered', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=200&q=80' },
    { number: '#PP12280', date: '06 May 2025 • 06:15 PM', items: '3 Items', total: '£21.40', status: 'Delivered', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=200&q=80' },
    { number: '#PP12233', date: '04 May 2025 • 01:20 PM', items: '2 Items', total: '£16.90', status: 'Cancelled', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Order History</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Track and view all your past orders</p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#262626] pb-2">
        {['ALL', 'COMPLETED', 'CANCELLED', 'REFUNDED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#FF5500] text-[#FF5500]'
                : 'border-transparent text-[#9CA3AF] hover:text-white'
            }`}
          >
            {tab === 'ALL' ? 'All Orders' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Order Cards List (Matching Page 16 of Loyalty PDF) */}
      <div className="space-y-3">
        {orders.map((o, idx) => (
          <div key={idx} className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <img src={o.image} alt={o.number} className="w-14 h-14 object-cover rounded-xl border border-[#262626]" />
              <div>
                <h3 className="font-bold text-white text-xs">Order {o.number}</h3>
                <p className="text-[10px] text-[#9CA3AF]">{o.date}</p>
                <p className="text-[10px] text-[#6B7280]">{o.items}</p>
              </div>
            </div>

            <div className="text-right space-y-2">
              <p className="font-bold text-white text-xs">{o.total}</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                  o.status === 'Delivered'
                    ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                    : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                }`}
              >
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
