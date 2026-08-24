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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-18 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Contact Header, Info & Form */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-7 z-10">
            
            {/* Header Info */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5500] block">
                  CONTACT US
                </span>
                <div className="w-8 h-0.5 bg-[#FF5500] rounded-full" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black uppercase text-white tracking-tight font-hero leading-[0.96] pt-1">
                GET IN TOUCH
              </h1>

              <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed max-w-xl">
                We'd love to hear from you. Whether it's a question, feedback or a custom request — drop us a message.
              </p>

              {/* Location notice matching screenshot */}
              <div className="flex items-start gap-2 text-sm text-white pt-2">
                <MapPin className="w-4 h-4 text-[#FF5500] shrink-0 mt-1" />
                <p className="leading-relaxed text-sm">
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
              <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
          {/* RIGHT COLUMN: Exact User Uploaded Restaurant Bar Background Image */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] bg-[#0A0A0A] aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:h-[680px] group">
            <img
              src="/contact_background.jpg"
              alt="Patty Project Restaurant Bar Interior"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 select-none pointer-events-none"
              loading="eager"
            />
            {/* Subtle atmospheric vignette / inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerContact;
