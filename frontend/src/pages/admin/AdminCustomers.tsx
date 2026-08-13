import React, { useState } from 'react';
import { Search, Download, UserCheck } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers] = useState([
    { name: 'John Smith', email: 'john.smith@email.com', phone: '+44 7123 456789', orders: 24, points: '2,450' },
    { name: 'Sarah Cooper', email: 'sarah.cooper@email.com', phone: '+44 7700 900123', orders: 15, points: '1,750' },
    { name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+44 7911 223344', orders: 32, points: '3,890' },
    { name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+44 7822 334455', orders: 8, points: '560' },
    { name: 'Daniel Wilson', email: 'daniel.wilson@email.com', phone: '+44 7456 667788', orders: 18, points: '1,230' },
    { name: 'Olivia Taylor', email: 'olivia.taylor@email.com', phone: '+44 7368 889900', orders: 41, points: '4,560' },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Customers</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Manage and view all your customers</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between bg-[#121212] border border-[#262626] p-4 rounded-2xl">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
          />
        </div>

        <button className="bg-[#1A1A1A] border border-[#262626] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Customers Table (Matching Page 7 of Admin PDF) */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase font-semibold border-b border-[#262626]">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Total Orders</th>
              <th className="px-6 py-4 text-right">Loyalty Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F]">
            {customers.map((c, idx) => (
              <tr key={idx} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#FF5500]/10 text-[#FF5500] font-bold text-xs flex items-center justify-center border border-[#FF5500]/30">
                    {c.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div>
                    <p className="font-bold text-white">{c.name}</p>
                    <p className="text-[10px] text-[#6B7280]">{c.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#9CA3AF] font-medium">{c.phone}</td>
                <td className="px-6 py-4 text-center font-bold text-white">{c.orders}</td>
                <td className="px-6 py-4 text-right font-bold text-[#FF5500]">{c.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
