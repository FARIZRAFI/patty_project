import React, { useState, useEffect } from 'react';
import { Search, Download, Loader2, RefreshCw, AlertCircle, Users } from 'lucide-react';
import { api } from '../../api/client';

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  orders: number;
  points: number;
  lifetime_points?: number;
  is_active: boolean;
  created_at?: string | null;
}

export const AdminCustomers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<AdminCustomer[]>('/customers');
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load customers:', err);
      setError(err?.message || 'Failed to load customers from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
  );

  const handleExport = () => {
    if (customers.length === 0) return;
    const headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Total Orders', 'Loyalty Points', 'Status', 'Joined Date'];
    const rows = customers.map((c) => [
      `"${c.id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      c.orders,
      c.points,
      c.is_active ? 'Active' : 'Inactive',
      c.created_at ? new Date(c.created_at).toLocaleDateString() : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `patty_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name: string) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Customers</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Authoritative customer records and loyalty point balances</p>
        </div>
        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="bg-[#1A1A1A] border border-[#262626] text-[#9CA3AF] hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh customers list"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between bg-[#121212] border border-[#262626] p-4 rounded-2xl">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
          />
        </div>

        <button
          onClick={handleExport}
          disabled={customers.length === 0}
          className="bg-[#1A1A1A] border border-[#262626] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export ({customers.length})</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center justify-between text-red-300 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchCustomers}
            className="px-3 py-1 bg-red-900/60 hover:bg-red-800 border border-red-700 rounded text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

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
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-[#6B7280]">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FF5500]" />
                    <span className="text-xs">Loading real customer database records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-[#6B7280]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-[#333333]" />
                    <p className="text-sm font-medium text-[#9CA3AF]">
                      {searchQuery ? 'No customers found matching your search.' : 'No registered customers found.'}
                    </p>
                    {searchQuery && (
                      <p className="text-xs text-[#6B7280]">Try clearing your search query.</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#FF5500]/10 text-[#FF5500] font-bold text-xs flex items-center justify-center border border-[#FF5500]/30 shrink-0">
                      {getInitials(c.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{c.name}</p>
                      <p className="text-[10px] text-[#6B7280] truncate">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#9CA3AF] font-medium">
                    {c.phone ? c.phone : <span className="text-[#555555] italic">No phone</span>}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-white">{c.orders}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#FF5500]">
                    {c.points.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
