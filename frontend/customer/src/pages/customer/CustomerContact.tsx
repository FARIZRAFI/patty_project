import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const CustomerContact: React.FC = () => {
  const { user } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = user.full_name ? user.full_name.split(' ') : ['', ''];
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white pb-20">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 pt-10 sm:pt-14 lg:pt-16">
        
        {/* Main 2-Column Grid matching exact attached design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-18 items-stretch">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Contact Header, Info & Form */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Header Info */}
            <div className="space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#FF5500] block">
                CONTACT US
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black uppercase text-white tracking-tight font-hero leading-[0.94]">
                GET IN TOUCH
              </h1>

              <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed max-w-xl">
                We'd love to hear from you. Whether it's a question, feedback or a custom request — drop us a message.
              </p>

              {/* Location notice matching screenshot */}
              <div className="flex items-start gap-2 text-sm text-white pt-2">
                <MapPin className="w-4 h-4 text-[#FF5500] shrink-0 mt-1" />
                <p className="leading-relaxed">
                  Find our{' '}
                  <Link to="/select-location" className="text-[#FF5500] font-bold hover:underline">
                    store locations here
                  </Link>
                  .<br />
                  We're excited to welcome you to{' '}
                  <span className="text-[#FF5500] font-bold">Patty Project</span>.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            {submitted ? (
              <div className="p-8 bg-[#0D0D0D] border border-[#FF5500]/50 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-3 text-[#FF5500]">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="text-lg font-black text-white uppercase font-hero tracking-wide">
                    Message Submitted!
                  </h3>
                </div>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  Thank you for reaching out to Patty Project. Our team has received your message and will respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-white">
                      FIRST NAME <span className="text-neutral-500 font-normal lowercase">(required)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-white/[0.08] focus:border-[#FF5500] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-white">
                      LAST NAME <span className="text-neutral-500 font-normal lowercase">(required)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-white/[0.08] focus:border-[#FF5500] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-white">
                    EMAIL <span className="text-neutral-500 font-normal lowercase">(required)</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] focus:border-[#FF5500] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Row 3: Subject */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-white">
                    SUBJECT <span className="text-neutral-500 font-normal lowercase">(required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] focus:border-[#FF5500] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Row 4: Message */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-white">
                    MESSAGE <span className="text-neutral-500 font-normal lowercase">(required)</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] focus:border-[#FF5500] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Row 5: Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-[#FF5500]/25 cursor-pointer"
                  >
                    <span>SUBMIT MESSAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Atmospheric Restaurant Bar Visual Scene */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[480px] lg:min-h-[620px] bg-[#0A0A0A] border border-white/[0.08] shadow-2xl flex flex-col justify-between p-6 sm:p-10 select-none">
            
            {/* Dark brick pattern backdrop */}
            <div 
              className="absolute inset-0 opacity-40 mix-blend-luminosity pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#262626 1px, transparent 1px), radial-gradient(#1c1c1c 1px, #080808 1px)`,
                backgroundSize: `36px 36px`,
                backgroundPosition: `0 0, 18px 18px`
              }}
            />

            {/* Ambient Lighting Spots */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#FF5500]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-10 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Overhead Pendant Lights */}
            <div className="relative z-10 flex justify-around px-4">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-14 bg-neutral-700" />
                <div className="w-8 h-4 bg-neutral-900 border border-neutral-700 rounded-t-full relative">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400/80 rounded-full blur-[2px]" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-20 bg-neutral-700" />
                <div className="w-8 h-4 bg-neutral-900 border border-neutral-700 rounded-t-full relative">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400/80 rounded-full blur-[2px]" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-12 bg-neutral-700" />
                <div className="w-8 h-4 bg-neutral-900 border border-neutral-700 rounded-t-full relative">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400/80 rounded-full blur-[2px]" />
                </div>
              </div>
            </div>

            {/* Center: Painted Wall Typography & Glowing Neon Sign */}
            <div className="relative z-10 grid grid-cols-12 gap-4 items-center my-auto py-6">
              {/* Mural Stencil Text */}
              <div className="col-span-8 space-y-1 pl-2">
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-neutral-300 font-hero opacity-80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  PATTY
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-[#FF5500] font-hero opacity-95 drop-shadow-[0_4px_16px_rgba(255,85,0,0.35)]">
                  PROJECT
                </span>
              </div>

              {/* Glowing Orange Neon Burger Sign */}
              <div className="col-span-4 flex justify-center">
                <div className="relative p-3.5 rounded-2xl bg-black/70 border border-[#FF5500]/40 shadow-[0_0_35px_rgba(255,85,0,0.4)]">
                  <svg 
                    viewBox="0 0 48 48" 
                    fill="none" 
                    className="w-16 h-16 sm:w-20 sm:h-20 text-[#FF5500] filter drop-shadow-[0_0_8px_#FF5500]"
                  >
                    {/* Top Bun */}
                    <path d="M8 22C8 14.268 15.1634 8 24 8C32.8366 8 40 14.268 40 22H8Z" stroke="#FF5500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Seeds */}
                    <path d="M16 14H18M23 12H25M30 14H32" stroke="#FFAA00" strokeWidth="2.5" strokeLinecap="round"/>
                    {/* Patty & Melt */}
                    <path d="M6 26C9 26 11 28 14 28C17 28 19 26 22 26C25 26 27 28 30 28C33 28 35 26 38 26C40 26 42 27 42 27" stroke="#FFAA00" strokeWidth="2.5" strokeLinecap="round"/>
                    <rect x="6" y="30" width="36" height="4" rx="2" stroke="#FF5500" strokeWidth="3"/>
                    {/* Bottom Bun */}
                    <path d="M8 38C8 40.2091 15.1634 42 24 42C32.8366 42 40 40.2091 40 38H8Z" stroke="#FF5500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Bar Counter & High Stools */}
            <div className="relative z-10 pt-2">
              {/* Polished Warm Wood Surface */}
              <div className="h-5 bg-gradient-to-r from-[#2b1408] via-[#4a2410] to-[#2b1408] rounded-t-lg border-t border-amber-600/40 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
              </div>
              {/* Bar Base with Stools */}
              <div className="h-16 bg-[#0E0E0E] border-t border-black flex justify-around items-end px-4 pb-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-3 bg-amber-950 rounded-full border border-amber-700/40 shadow-sm" />
                  <div className="w-1 h-9 bg-neutral-700" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-3 bg-amber-950 rounded-full border border-amber-700/40 shadow-sm" />
                  <div className="w-1 h-9 bg-neutral-700" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-3 bg-amber-950 rounded-full border border-amber-700/40 shadow-sm" />
                  <div className="w-1 h-9 bg-neutral-700" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-3 bg-amber-950 rounded-full border border-amber-700/40 shadow-sm" />
                  <div className="w-1 h-9 bg-neutral-700" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerContact;
