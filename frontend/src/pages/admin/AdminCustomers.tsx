import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState([
    { name: 'John Smith', email: 'john.smith@email.com', phone: '+44 7123 456789', orders: 24, points: '2,450' },
    { name: 'Sarah Cooper', email: 'sarah.cooper@email.com', phone: '+44 7700 900123', orders: 15, points: '1,750' },
    { name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+44 7911 223344', orders: 32, points: '3,890' },
    { name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+44 7822 334455', orders: 8, points: '560' },
    { name: 'Daniel Wilson', email: 'daniel.wilson@email.com', phone: '+44 7456 667788', orders: 18, points: '1,230' },
    { name: 'Olivia Taylor', email: 'olivia.taylor@email.com', phone: '+44 7368 889900', orders: 41, points: '4,560' },
  ]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="w-full max-w-[1220px] mx-auto px-6 sm:px-8 py-8 space-y-6 text-[#F5F5F5]">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">Customers</h1>
        <p className="text-sm text-[#A1A1AA] font-normal mt-1">Manage and view all your customers</p>
      </div>

      {/* Customer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D0D0D] border border-[#242424] p-3 rounded-lg">
        <div className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#71717A]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg py-2 pl-9 pr-3.5 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
          />
        </div>

        <button className="h-10 px-4 bg-[#151515] border border-[#242424] hover:border-[#333333] text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Customers Data Table */}
      <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#171717] text-[#A1A1AA] uppercase text-[11px] font-semibold border-b border-[#1C1C1C]">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5 text-center">Total Orders</th>
                <th className="px-5 py-3.5 text-right">Loyalty Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C] bg-[#0D0D0D]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[#71717A]">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#121212] transition-colors h-14">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#241209] border border-[#6B2A0D] text-[#FF5A00] font-semibold text-xs flex items-center justify-center shrink-0">
                        {c.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#F5F5F5] text-xs truncate">{c.name}</p>
                        <p className="text-[11px] text-[#71717A] truncate">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#A1A1AA] font-normal">{c.phone}</td>
                    <td className="px-5 py-3 text-center font-semibold text-[#F5F5F5]">{c.orders}</td>
                    <td className="px-5 py-3 text-right font-semibold text-[#FF5A00]">{c.points}</td>
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
