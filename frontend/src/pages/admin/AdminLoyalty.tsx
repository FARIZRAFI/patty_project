import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const AdminLoyalty: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loyaltyMembers] = useState([
    { name: 'John Smith', email: 'john.smith@email.com', phone: '+44 7123 456789', available: '2,450', lifetime: '8,750', expiring: '450 in 15 days' },
    { name: 'Sarah Cooper', email: 'sarah.cooper@email.com', phone: '+44 7700 900123', available: '1,750', lifetime: '5,230', expiring: '250 in 10 days' },
    { name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+44 7911 223344', available: '3,890', lifetime: '12,450', expiring: '890 in 25 days' },
    { name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+44 7822 334455', available: '560', lifetime: '1,560', expiring: '60 in 5 days' },
    { name: 'Daniel Wilson', email: 'daniel.wilson@email.com', phone: '+44 7456 667788', available: '1,230', lifetime: '3,890', expiring: 'None' },
  ]);

  const filteredMembers = loyaltyMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery)
  );

  return (
    <div className="w-full max-w-[1220px] mx-auto px-6 sm:px-8 py-8 space-y-6 text-[#F5F5F5]">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">Loyalty Points</h1>
        <p className="text-sm text-[#A1A1AA] font-normal mt-1">Manage customer loyalty points and rewards</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D0D0D] border border-[#242424] p-3 rounded-lg">
        <div className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#71717A]" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg py-2 pl-9 pr-3.5 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Loyalty Members Data Table */}
      <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#171717] text-[#A1A1AA] uppercase text-[11px] font-semibold border-b border-[#1C1C1C]">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5 text-center">Available Points</th>
                <th className="px-5 py-3.5 text-center">Lifetime Points</th>
                <th className="px-5 py-3.5 text-right">Points Expiring</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C] bg-[#0D0D0D]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#71717A]">
                    No loyalty members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#121212] transition-colors h-14">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#241209] border border-[#6B2A0D] text-[#FF5A00] font-semibold text-xs flex items-center justify-center shrink-0">
                        {m.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#F5F5F5] text-xs truncate">{m.name}</p>
                        <p className="text-[11px] text-[#71717A] truncate">{m.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#A1A1AA] font-normal">{m.phone}</td>
                    <td className="px-5 py-3 text-center font-bold text-[#FF5A00] text-sm">{m.available}</td>
                    <td className="px-5 py-3 text-center font-semibold text-[#F5F5F5]">{m.lifetime}</td>
                    <td className="px-5 py-3 text-right">
                      {m.expiring === 'None' ? (
                        <span className="text-[#71717A] font-normal">None</span>
                      ) : (
                        <span className="text-[#EF4444] font-semibold">{m.expiring}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
