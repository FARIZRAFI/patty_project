import React, { useState } from 'react';
import { Lock, CheckCircle2, Key, Eye, EyeOff, Plus, Trash2, Edit } from 'lucide-react';

export const AdminProfileSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');

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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Profile Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Manage your account settings and branch passwords.</p>
      </div>

      {msg && (
        <div className="p-4 bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] rounded-xl text-sm font-semibold">
          {msg}
        </div>
      )}

      {/* Top Card: Change Admin Password (Matching Page 10 of Admin PDF) */}
      <div className="bg-[#121212] border border-[#262626] p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1F1F1F]">
          <Lock className="w-5 h-5 text-[#FF5500]" />
          <div>
            <h2 className="text-lg font-bold text-white">Change Admin Password</h2>
            <p className="text-xs text-[#9CA3AF]">Update your account password.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleUpdatePassword} className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FF5500]/20"
            >
              Update Password
            </button>
          </form>

          {/* Password Requirements Checklist Right */}
          <div className="bg-[#1A1A1A] border border-[#262626] p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Password Requirements</h3>
            <div className="space-y-2 text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Include uppercase and lowercase letters</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Include at least one number</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Include at least one special character</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Branch Passwords (Matching Page 10 of Admin PDF) */}
      <div className="bg-[#121212] border border-[#262626] p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[#FF5500]" />
            <div>
              <h2 className="text-lg font-bold text-white">Branch Passwords</h2>
              <p className="text-xs text-[#9CA3AF]">Create branches and manage their passwords.</p>
            </div>
          </div>

          <button className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Branch</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase font-semibold border-b border-[#262626]">
              <tr>
                <th className="px-5 py-3.5">Branch Name</th>
                <th className="px-5 py-3.5">Branch Password</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {branches.map((b, idx) => (
                <tr key={idx} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-5 py-4 font-bold text-white">{b.name}</td>
                  <td className="px-5 py-4 font-mono text-[#9CA3AF] tracking-widest">{b.password}</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] text-[#FF5500] hover:bg-[#FF5500] hover:text-white rounded-lg font-semibold transition-all">
                      Change Password
                    </button>
                    <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-lg font-semibold transition-all">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[#6B7280]">ⓘ Branch passwords are used for branch login and access.</p>
      </div>
    </div>
  );
};
