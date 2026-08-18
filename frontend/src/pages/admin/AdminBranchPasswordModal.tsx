import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, Key, CheckCircle2 } from 'lucide-react';

interface Props {
  branchName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminBranchPasswordModal: React.FC<Props> = ({ branchName, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 800);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl w-full max-w-md shadow-2xl p-6 relative text-[#F5F5F5] animate-in fade-in duration-150 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#241209] border border-[#6B2A0D] flex items-center justify-center text-[#FF5A00] shrink-0">
              <Key className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F5F5F5]">Change Branch Password</h2>
              <p className="text-xs text-[#A1A1AA]">Update portal access for {branchName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-lg text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Branch password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">
              New Branch Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg pl-3 pr-10 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#71717A] hover:text-[#F5F5F5] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg pl-3 pr-10 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="pt-4 mt-5 flex items-center justify-end gap-2.5 border-t border-[#1C1C1C]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-[#151515] border border-[#242424] hover:border-[#333333] text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="h-9 px-4 bg-[#FF5A00] hover:bg-[#E84F00] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
