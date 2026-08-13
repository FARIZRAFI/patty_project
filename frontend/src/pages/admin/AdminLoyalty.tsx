import React, { useState } from 'react';
import { Search, Star, Award, Clock } from 'lucide-react';

export const AdminLoyalty: React.FC = () => {
  const [loyaltyMembers] = useState([
    { name: 'John Smith', email: 'john.smith@email.com', phone: '+44 7123 456789', available: '2,450', lifetime: '8,750', expiring: '450 in 15 days' },
    { name: 'Sarah Cooper', email: 'sarah.cooper@email.com', phone: '+44 7700 900123', available: '1,750', lifetime: '5,230', expiring: '250 in 10 days' },
    { name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+44 7911 223344', available: '3,890', lifetime: '12,450', expiring: '890 in 25 days' },
    { name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+44 7822 334455', available: '560', lifetime: '1,560', expiring: '60 in 5 days' },
    { name: 'Daniel Wilson', email: 'daniel.wilson@email.com', phone: '+44 7456 667788', available: '1,230', lifetime: '3,890', expiring: '0' },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Loyalty Points</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Manage customer loyalty points and rewards</p>
      </div>

      <div className="flex items-center justify-between bg-[#121212] border border-[#262626] p-4 rounded-2xl">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
          />
        </div>
      </div>

      {/* Loyalty Members Table (Matching Page 8 of Admin PDF) */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase font-semibold border-b border-[#262626]">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Available Points</th>
              <th className="px-6 py-4 text-center">Lifetime Points</th>
              <th className="px-6 py-4 text-right">Points Expiring</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F]">
            {loyaltyMembers.map((m, idx) => (
              <tr key={idx} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#FF5500]/10 text-[#FF5500] font-bold text-xs flex items-center justify-center border border-[#FF5500]/30">
                    {m.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div>
                    <p className="font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-[#6B7280]">{m.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#9CA3AF] font-medium">{m.phone}</td>
                <td className="px-6 py-4 text-center font-bold text-[#FF5500] text-sm">{m.available}</td>
                <td className="px-6 py-4 text-center font-semibold text-white">{m.lifetime}</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[#EF4444] font-semibold">{m.expiring}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
