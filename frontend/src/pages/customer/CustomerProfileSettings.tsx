import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, MapPin, CreditCard, Gift, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const CustomerProfileSettings: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Profile Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      {/* User Info Header Card (Matching Page 17 of Loyalty PDF) */}
      <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FF5500]/10 text-[#FF5500] font-bold text-lg flex items-center justify-center border border-[#FF5500]/30">
            {user?.full_name ? user.full_name.split(' ').map((n) => n[0]).join('') : 'JS'}
          </div>
          <div>
            <h2 className="font-bold text-white text-base">{user?.full_name || 'John Smith'}</h2>
            <p className="text-xs text-[#9CA3AF]">{user?.email || 'john.smith@email.com'}</p>
            <p className="text-xs text-[#6B7280]">{user?.phone || '+44 7123 456789'}</p>
          </div>
        </div>

        <button className="text-xs font-bold text-[#FF5500] hover:underline">Edit Profile</button>
      </div>

      {/* Account Settings Navigation List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Account</h3>
        <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden divide-y divide-[#1F1F1F]">
          <Link to="/profile" className="p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#FF5500]" />
              <div>
                <p className="text-xs font-bold text-white">Personal Information</p>
                <p className="text-[10px] text-[#9CA3AF]">Update your name, email and phone number</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          </Link>

          <Link to="/profile" className="p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#FF5500]" />
              <div>
                <p className="text-xs font-bold text-white">Password & Security</p>
                <p className="text-[10px] text-[#9CA3AF]">Change your password and security settings</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          </Link>

          <Link to="/profile" className="p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#FF5500]" />
              <div>
                <p className="text-xs font-bold text-white">Addresses</p>
                <p className="text-[10px] text-[#9CA3AF]">Manage your delivery addresses</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          </Link>

          <Link to="/profile" className="p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#FF5500]" />
              <div>
                <p className="text-xs font-bold text-white">Payment Methods</p>
                <p className="text-[10px] text-[#9CA3AF]">Manage your saved cards and payment options</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          </Link>
        </div>
      </div>

      {/* Loyalty & Offers Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Preferences</h3>
        <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden divide-y divide-[#1F1F1F]">
          <Link to="/loyalty" className="p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#FF5500]" />
              <div>
                <p className="text-xs font-bold text-white">Loyalty & Rewards</p>
                <p className="text-[10px] text-[#9CA3AF]">Check points and redeem rewards</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          </Link>
        </div>
      </div>

      {/* Logout Trigger */}
      <button
        onClick={handleLogout}
        className="w-full bg-[#121212] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 text-[#EF4444] font-bold py-3.5 rounded-2xl transition-colors text-xs flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
};
