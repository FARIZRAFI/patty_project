import React, { useState } from 'react';
import { Lock, CheckCircle2, Key, Trash2, Edit, Check } from 'lucide-react';
import { AdminBranchPasswordModal } from './AdminBranchPasswordModal';

export const AdminProfileSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [selectedBranchForPassword, setSelectedBranchForPassword] = useState<string | null>(null);

  const [branches] = useState([
    { name: 'London - Central', password: '••••••••' },
    { name: 'London - Westfield', password: '••••••••' },
  ]);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMsg('Password must be at least 8 characters long');
      return;
    }
    setMsg('Password updated successfully!');
  };

  return (
    <div className="w-full max-w-[1220px] mx-auto px-6 sm:px-8 py-8 space-y-6 text-[#F5F5F5]">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">Profile Settings</h1>
        <p className="text-sm text-[#A1A1AA] font-normal mt-1">Manage your account settings and branch passwords.</p>
      </div>

      {msg && (
        <div className="p-3.5 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Top Card: Change Admin Password */}
      <div className="bg-[#0D0D0D] border border-[#242424] p-5 sm:p-6 rounded-xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#1C1C1C]">
          <div className="w-9 h-9 rounded-lg bg-[#241209] border border-[#6B2A0D] flex items-center justify-center text-[#FF5A00] shrink-0">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">Change Admin Password</h2>
            <p className="text-xs text-[#A1A1AA]">Update your account password.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={handleUpdatePassword} className="lg:col-span-8 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Current Password *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg px-3.5 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="h-10 px-5 bg-[#FF5A00] hover:bg-[#E84F00] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>

          {/* Password Requirements Checklist Right */}
          <div className="lg:col-span-4 bg-[#151515] border border-[#242424] p-4.5 rounded-lg space-y-3">
            <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">Password Requirements</h3>
            <div className="space-y-2.5 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2 text-[#22C55E]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-2 text-[#22C55E]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Include uppercase and lowercase</span>
              </div>
              <div className="flex items-center gap-2 text-[#22C55E]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Include at least one number</span>
              </div>
              <div className="flex items-center gap-2 text-[#22C55E]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Include at least one special char</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Branch Passwords */}
      <div className="bg-[#0D0D0D] border border-[#242424] p-5 sm:p-6 rounded-xl shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#241209] border border-[#6B2A0D] flex items-center justify-center text-[#FF5A00] shrink-0">
              <Key className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F5F5F5]">Branch Passwords</h2>
              <p className="text-xs text-[#A1A1AA]">Create branches and manage their passwords.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#171717] text-[#A1A1AA] uppercase text-[11px] font-semibold border-b border-[#1C1C1C]">
                <tr>
                  <th className="px-5 py-3.5">Branch Name</th>
                  <th className="px-5 py-3.5">Branch Password</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C] bg-[#0D0D0D]">
                {branches.map((b, idx) => (
                  <tr key={idx} className="hover:bg-[#121212] transition-colors h-14">
                    <td className="px-5 py-3 font-semibold text-[#F5F5F5]">{b.name}</td>
                    <td className="px-5 py-3 font-mono text-[#A1A1AA] tracking-widest">{b.password}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBranchForPassword(b.name)}
                          className="h-8 px-3 bg-[#151515] border border-[#242424] text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Change Password
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg bg-[#151515] border border-[#242424] text-[#71717A] hover:text-[#EF4444] hover:border-[#EF4444]/40 hover:bg-[#EF4444]/10 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Branch Password"
                          aria-label="Delete branch password"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-[#71717A]">ⓘ Branch passwords are used for branch login and portal access.</p>
      </div>

      {selectedBranchForPassword && (
        <AdminBranchPasswordModal
          branchName={selectedBranchForPassword}
          onClose={() => setSelectedBranchForPassword(null)}
          onSuccess={() => {
            setMsg(`Password updated for ${selectedBranchForPassword}`);
            setSelectedBranchForPassword(null);
          }}
        />
      )}
    </div>
  );
};
