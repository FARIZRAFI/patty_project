import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Gift, Award, TrendingUp, Sparkles, Lock, CheckCircle2, ShoppingBag, ArrowRight, X, Copy, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

interface MilestoneReward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  reward_type: string;
  discount_value: number;
  unlocked: boolean;
  points_needed: number;
}

interface LoyaltyTransaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

interface LoyaltyData {
  available_points: number;
  lifetime_points: number;
  tier: string;
  next_tier_name: string;
  next_tier_points: number;
  points_to_next_tier: number;
  progress_percent: number;
  rewards: MilestoneReward[];
  transactions: LoyaltyTransaction[];
}

export const CustomerLoyaltyPortal: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Claim Modal State
  const [claimedReward, setClaimedReward] = useState<{ title: string; code: string } | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchLoyaltyData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<LoyaltyData>('/loyalty/balance');
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load loyalty details');
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

  const handleClaimOffer = async (reward: MilestoneReward) => {
    setClaimingId(reward.id);
    try {
      const res: any = await api.post('/loyalty/redeem', { reward_id: reward.id });
      setClaimedReward({
        title: reward.title,
        code: res.coupon_code || 'LOYALTY100',
      });
      fetchLoyaltyData();
    } catch (err: any) {
      alert(err?.message || 'Failed to claim reward');
    } finally {
      setClaimingId(null);
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-12 py-6 sm:py-10 pb-36 text-white min-h-[85vh]">
      {/* Hero Title Row */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-full text-xs font-bold text-[#FF5500] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Loyalty Rewards Program</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Loyalty & Rewards Portal
        </h1>
        <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl">
          Earn 10 Points on every £1 spent. Reach point milestones to unlock free burgers, sides, and discount coupons!
        </p>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1: Available Points */}
            <div className="bg-[#121212] border border-[#FF5500]/40 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-[#FF5500]/5 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5500]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                  Available Balance
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                  <Gift className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-[#FF5500] tracking-tight mb-1">
                  {data.available_points.toLocaleString()} <span className="text-lg font-bold text-white">PTS</span>
                </div>
                <p className="text-xs text-[#9CA3AF]">Ready to redeem for milestone rewards</p>
              </div>
            </div>

            {/* Card 2: Current Tier */}
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                  Membership Tier
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#282828] flex items-center justify-center text-[#FF5500]">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-extrabold text-white uppercase tracking-wider">
                    {data.tier} TIER
                  </span>
                  <span className="bg-[#FF5500] text-white text-[10px] font-black px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF]">Lifetime Earned: <strong className="text-white">{data.lifetime_points.toLocaleString()} PTS</strong></p>
              </div>
            </div>

            {/* Card 3: Next Tier Milestone Progress */}
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                  Progress to {data.next_tier_name}
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#282828] flex items-center justify-center text-[#FF5500]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-extrabold text-white mb-2">
                  <span>{data.lifetime_points} / {data.next_tier_points} PTS</span>
                  <span className="text-[#FF5500]">{data.progress_percent}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-[#181818] border border-[#282828] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF5500] to-[#FF7733] transition-all duration-500 rounded-full"
                    style={{ width: `${data.progress_percent}%` }}
                  />
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  {data.points_to_next_tier > 0
                    ? `${data.points_to_next_tier.toLocaleString()} PTS remaining to unlock ${data.next_tier_name}`
                    : `Maximum Tier Unlocked! 🎉`}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Milestone Offers & Rewards */}
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-[#1C1C1C] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">Milestone Offers & Rewards</h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Reach points targets to claim exclusive food items and vouchers.</p>
              </div>
              <span className="text-xs font-bold text-[#FF5500]">Auto-unlocked at milestone targets</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`bg-[#121212] rounded-2xl p-6 border transition-all flex flex-col justify-between h-full relative ${
                    reward.unlocked
                      ? 'border-[#FF5500] shadow-lg shadow-[#FF5500]/10'
                      : 'border-[#222222] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    {/* Top Tag & Points Requirement */}
                    <div className="flex items-center justify-between mb-4">
                      {reward.unlocked ? (
                        <span className="bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="bg-[#1F1F1F] border border-[#2A2A2A] text-[#9CA3AF] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#9CA3AF]" />
                          LOCKED
                        </span>
                      )}

                      <span className="text-xs font-extrabold text-[#FF5500] bg-[#FF5500]/10 px-2.5 py-1 rounded-lg border border-[#FF5500]/20">
                        {reward.points_required} PTS
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white mb-1.5">{reward.title}</h3>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                      {reward.description}
                    </p>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-4 border-t border-[#1C1C1C]">
                    {reward.unlocked ? (
                      <button
                        onClick={() => handleClaimOffer(reward)}
                        disabled={claimingId === reward.id}
                        className="w-full bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md shadow-[#FF5500]/20 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Gift className="w-4 h-4" />
                        <span>{claimingId === reward.id ? 'Claiming...' : 'Redeem Offer'}</span>
                      </button>
                    ) : (
                      <div className="text-center">
                        <p className="text-[11px] font-semibold text-[#9CA3AF] mb-2">
                          {reward.points_needed} PTS away from unlocking
                        </p>
                        <button
                          disabled
                          className="w-full bg-[#181818] border border-[#282828] text-[#555555] text-xs font-bold py-2.5 rounded-xl cursor-not-allowed"
                        >
                          Earn More Points
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: How It Works */}
          <div className="mb-14 bg-[#121212] border border-[#222222] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-white mb-6 text-center sm:text-left">
              How Loyalty Earning Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-4 bg-[#181818] border border-[#282828] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/20 border border-[#FF5500]/40 text-[#FF5500] font-black text-lg flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white mb-1">Order Favorite Meals</h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Order online at Patty Project. Every £1 spent earns 10 Loyalty Points automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#181818] border border-[#282828] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/20 border border-[#FF5500]/40 text-[#FF5500] font-black text-lg flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white mb-1">Automatic Points Credit</h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Points are automatically added to your profile balance immediately after payment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#181818] border border-[#282828] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/20 border border-[#FF5500]/40 text-[#FF5500] font-black text-lg flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white mb-1">Claim Milestone Offers</h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Reach points milestones to claim free burgers, sides, and discount voucher codes!
                  </p>
                </div>
              </div>
            </div>

            {/* Need Help Banner linking to /contact */}
            <div className="mt-6 pt-6 border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-white">Have questions about your loyalty points or rewards?</h4>
                <p className="text-xs text-[#9CA3AF]">Our customer support team is available to assist you with your loyalty account.</p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#FF5500]/20 shrink-0"
              >
                <span>Contact Loyalty Support</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Section: Points Activity History */}
          <div>
            <h2 className="text-xl font-extrabold text-white mb-4">Points Activity Log</h2>

            {data.transactions.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] bg-[#121212] border border-[#222222] p-6 rounded-2xl text-center">
                No loyalty transactions recorded yet. Place an order to earn points!
              </p>
            ) : (
              <div className="bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden divide-y divide-[#1C1C1C]">
                {data.transactions.map((tx) => {
                  const isEarned = tx.points > 0;
                  return (
                    <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#181818] transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            isEarned
                              ? 'bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/30'
                              : 'bg-[#EF4444]/10 text-[#FCA5A5] border border-[#EF4444]/30'
                          }`}
                        >
                          {isEarned ? '+' : '-'}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-white mb-0.5">{tx.description || 'Loyalty Activity'}</p>
                          <p className="text-[10px] text-[#9CA3AF]">
                            {new Date(tx.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`text-sm font-black tracking-tight ${
                          isEarned ? 'text-[#34D399]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isEarned ? `+${tx.points}` : tx.points} PTS
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Claimed Offer Modal */}
      {claimedReward && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#FF5500] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl text-center relative animate-fadeIn">
            <button
              onClick={() => setClaimedReward(null)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-[#FF5500]/20 border border-[#FF5500] rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF5500]">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-1">Congratulations!</h3>
            <p className="text-xs text-[#9CA3AF] mb-6">
              You claimed <strong className="text-white">{claimedReward.title}</strong>! Use your promo code below at checkout.
            </p>

            <div className="bg-[#181818] border border-[#FF5500]/40 rounded-xl p-4 flex items-center justify-between mb-6">
              <span className="text-lg font-mono font-black text-[#FF5500] tracking-widest">
                {claimedReward.code}
              </span>
              <button
                onClick={() => copyCodeToClipboard(claimedReward.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <Link
              to="/menu"
              onClick={() => setClaimedReward(null)}
              className="block w-full bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#FF5500]/20"
            >
              Order Now & Apply Code
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
