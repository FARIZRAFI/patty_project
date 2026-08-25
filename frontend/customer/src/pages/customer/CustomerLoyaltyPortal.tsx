import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Gift,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Clock,
  TrendingUp,
  Zap,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { LoyaltyOverview, LoyaltyTransaction } from '../../types';

export const CustomerLoyaltyPortal: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [data, setData] = useState<LoyaltyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoyaltyData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<LoyaltyOverview>('/loyalty/balance');
      setData(res);
    } catch (err: any) {
      const detailMsg =
        (typeof err?.detail === 'string' ? err.detail : '') ||
        (typeof err?.detail === 'object' && err.detail ? (err.detail.message || err.detail.error || err.detail.msg) : '') ||
        err?.message ||
        'Failed to load loyalty details';
      setError(detailMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchLoyaltyData();
  }, [user, navigate, fetchLoyaltyData]);

  const getTxBadge = (type: string) => {
    const t = type.toUpperCase();
    if (t.includes('DOUBLE') || t.includes('TRIPLE') || t === 'BONUS') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40">
          <Zap className="w-2.5 h-2.5" />
          {t}
        </span>
      );
    }
    if (t === 'EARN' || t === 'EARNED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
          <CheckCircle2 className="w-2.5 h-2.5" />
          EARNED
        </span>
      );
    }
    if (t === 'REDEEM' || t === 'REDEEMED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30">
          <Gift className="w-2.5 h-2.5" />
          REDEEMED
        </span>
      );
    }
    if (t.includes('REVERSE') || t.includes('REFUND')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30">
          <RotateCcw className="w-2.5 h-2.5" />
          {t}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#374151]/40 text-[#D1D5DB] border border-[#4B5563]/40">
        {t}
      </span>
    );
  };

  const availablePts = data?.available_points ?? 0;
  const rewardVal = data?.reward_value ?? (availablePts / 1000);
  const minRequired = data?.min_redemption_points ?? 4000;
  const isUnlocked = data?.is_redemption_available ?? (availablePts >= minRequired);
  const pointsNeeded = data?.points_needed_for_redemption ?? Math.max(0, minRequired - availablePts);
  const progressPercent = data?.primary_milestone?.progress_percent ?? Math.min(100, Math.round((availablePts / minRequired) * 100));

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 pb-36 text-white min-h-[85vh]">
      {/* Hero Title Row */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-full text-xs font-bold text-[#FF5500] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Patty Points Programme</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Loyalty & Rewards Portal
        </h1>
        <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl">
          1 Patty Point for every 1p spent (£1 = 100 PTS). Reach the 4,000-point milestone to unlock reward redemptions in £1 increments!
        </p>
      </div>

      {/* Active Campaign Alert Banner */}
      {data?.active_campaign && (
        <div className="mb-8 p-4 bg-gradient-to-r from-[#FF5500]/20 via-[#FF5500]/10 to-transparent border border-[#FF5500]/40 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-[#FF5500]/30">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold px-2 py-0.5 bg-[#FF5500] text-white rounded">Live Campaign</span>
                <p className="text-sm font-extrabold text-white">{data.active_campaign.name}</p>
              </div>
              <p className="text-xs text-[#D1D5DB] mt-0.5">
                Earn <strong className="text-[#FF5500]">{data.active_campaign.multiplier}x Patty Points</strong> on eligible completed orders!
              </p>
            </div>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5500] hover:bg-[#E84F00] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#FF5500]/20 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Now</span>
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-[#2A1215] border border-[#EF4444]/40 rounded-xl flex items-center gap-3 text-xs text-[#FCA5A5]">
          <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse mb-12">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-[#121212] border border-[#222222] rounded-2xl p-6" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* Top 3 Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Card 1: Available Points & Value */}
            <div className="bg-[#121212] border border-[#FF5500]/40 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-[#FF5500]/5 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5500]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                  Patty Points Balance
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                  <Gift className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-[#FF5500] tracking-tight mb-1">
                  {availablePts.toLocaleString()} <span className="text-lg font-bold text-white">PTS</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#D1D5DB] pt-2 border-t border-[#222222] mt-3">
                  <span>Standard Reward Value:</span>
                  <span className="font-bold text-white text-sm">£{rewardVal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Milestone Status */}
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                  Redemption Milestone
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]' : 'bg-[#1E1E1E] text-[#6B7280]'}`}>
                  {isUnlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-2">
                  {isUnlocked ? (
                    <span className="text-[#22C55E] flex items-center gap-1.5 text-xl">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      Reward Unlocked!
                    </span>
                  ) : (
                    <span>4,000 PTS Threshold</span>
                  )}
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  {isUnlocked
                    ? `Eligible to redeem £${Math.floor(availablePts / 1000)} in whole £1 increments at checkout.`
                    : `Earn ${pointsNeeded.toLocaleString()} more points to unlock your £4.00 reward.`}
                </p>
              </div>
            </div>

            {/* Card 3: Account Stats Summary */}
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                  Lifetime Statistics
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center text-[#A1A1AA]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#9CA3AF]">
                  <span>Total Points Earned:</span>
                  <span className="font-bold text-white text-sm">{data.lifetime_points.toLocaleString()} PTS</span>
                </div>
                <div className="flex justify-between items-center text-[#9CA3AF]">
                  <span>Total Points Redeemed:</span>
                  <span className="font-bold text-[#60A5FA]">{data.total_redeemed_points.toLocaleString()} PTS</span>
                </div>
                {data.total_reversed_points > 0 && (
                  <div className="flex justify-between items-center text-[#9CA3AF]">
                    <span>Points Reversed/Refunded:</span>
                    <span className="font-bold text-[#F87171]">-{data.total_reversed_points.toLocaleString()} PTS</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Milestone Progress Bar Section */}
          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 sm:p-8 mb-10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FF5500]" />
                  <h3 className="text-lg font-extrabold text-white">First Redemption Milestone (4,000 PTS)</h3>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Customers must reach at least 4,000 Patty Points before redemption becomes active.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-2xl font-black text-[#FF5500]">
                  {availablePts.toLocaleString()} <span className="text-sm font-semibold text-[#9CA3AF]">/ 4,000 PTS</span>
                </span>
                <p className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                  {isUnlocked ? 'Milestone Achieved (100%)' : `${progressPercent}% Progress`}
                </p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-[#1A1A1A] h-4 rounded-full overflow-hidden p-0.5 border border-[#2A2A2A] relative mb-4">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#FF5500] to-[#FFA000]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Unlocked Reward Increments Showcase */}
            {isUnlocked ? (
              <div className="mt-6 p-4 sm:p-5 bg-[#171717] border border-[#282828] rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                      Available Redemptions Ready at Checkout
                    </h4>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      You can redeem your points in whole £1 (1,000-point) increments on your next order:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {data.redeemable_increments && data.redeemable_increments.length > 0 ? (
                        data.redeemable_increments.map((inc) => (
                          <div
                            key={inc}
                            className="px-3.5 py-1.5 bg-[#1F1F1F] border border-[#FF5500]/30 rounded-lg text-xs font-extrabold text-white flex items-center gap-2"
                          >
                            <span className="text-[#FF5500]">£{inc / 1000}.00 OFF</span>
                            <span className="text-[#71717A] font-normal">({inc.toLocaleString()} pts)</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3.5 py-1.5 bg-[#1F1F1F] border border-[#FF5500]/30 rounded-lg text-xs font-extrabold text-white">
                          £4.00 OFF (4,000 pts)
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/menu"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF5500] hover:bg-[#E84F00] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#FF5500]/20 shrink-0"
                  >
                    <span>Use Points at Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-3 p-3 bg-[#171717] rounded-xl text-xs text-[#9CA3AF]">
                <Lock className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span>
                  Earn <strong className="text-white">{pointsNeeded.toLocaleString()} more points</strong> (£{(pointsNeeded / 100).toFixed(2)} eligible spend) to unlock £4.00 in order rewards.
                </span>
              </div>
            )}
          </div>

          {/* How Patty Points Works Informational Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] font-bold text-sm">
                1
              </div>
              <h4 className="font-extrabold text-sm text-white">1p Spend = 1 Patty Point</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Order your favourite burgers online. Every 1p spent on eligible food automatically credits 1 Patty Point (£10 = 1,000 PTS).
              </p>
            </div>

            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] font-bold text-sm">
                2
              </div>
              <h4 className="font-extrabold text-sm text-white">4,000 Points Milestone</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Reach 4,000 points to unlock reward redemption. 1,000 Patty Points equals £1 in real discount value (10% reward value).
              </p>
            </div>

            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] font-bold text-sm">
                3
              </div>
              <h4 className="font-extrabold text-sm text-white">Redeem in Whole £1 Steps</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Select your reward (£4, £5, £6...) during checkout for instant savings. Never worry about losing fractional points.
              </p>
            </div>
          </div>

          {/* Immutable Transaction History Ledger */}
          <div className="bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-[#222222] flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF5500]" />
                  Loyalty Transaction History
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Auditable record of all points earned, redeemed, and reversed.</p>
              </div>
            </div>

            {data.transactions.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#71717A] space-y-3">
                <Gift className="w-8 h-8 mx-auto text-[#374151]" />
                <p>No loyalty transactions recorded yet. Place an eligible order to earn points!</p>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:underline"
                >
                  <span>Explore the Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171717] text-[#9CA3AF] uppercase text-[11px] font-semibold border-b border-[#222222]">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Activity / Description</th>
                      <th className="px-6 py-4 text-right">Points Delta</th>
                      <th className="px-6 py-4 text-right">Resulting Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F]">
                    {data.transactions.map((tx: LoyaltyTransaction) => {
                      const isPositive = tx.points > 0;
                      return (
                        <tr key={tx.id} className="hover:bg-[#171717] transition-colors">
                          <td className="px-6 py-4 text-[#9CA3AF] whitespace-nowrap">
                            {new Date(tx.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTxBadge(tx.transaction_type)}
                          </td>
                          <td className="px-6 py-4 font-medium text-white max-w-xs truncate">
                            {tx.description || 'Loyalty activity'}
                          </td>
                          <td className="px-6 py-4 text-right font-bold whitespace-nowrap">
                            <span className={isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                              {isPositive ? `+${tx.points.toLocaleString()}` : tx.points.toLocaleString()} PTS
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-[#D1D5DB] font-semibold whitespace-nowrap">
                            {tx.resulting_balance !== undefined && tx.resulting_balance !== null
                              ? `${tx.resulting_balance.toLocaleString()} PTS`
                              : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
