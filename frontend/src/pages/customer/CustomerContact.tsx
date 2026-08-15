import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
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
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 py-8 lg:py-16 space-y-10">
        
        {/* Title & Subtitle matching Screenshot */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-hero uppercase tracking-tight">
            Contact Us
          </h1>
          <div className="space-y-1.5 text-sm sm:text-base text-[#9CA3AF] font-medium leading-relaxed">
            <p>Get in touch with us by using the contact form below.</p>
            <p>
              Find our{' '}
              <Link to="/select-location" className="text-[#FF5500] hover:underline font-bold">
                store locations here
              </Link>
              . We're excited to welcome you to{' '}
              <span className="text-[#FF5500] font-bold">Patty Project.</span>
            </p>
          </div>
        </div>

        {/* Contact Form matching Screenshot */}
        <div className="max-w-2xl">
          {submitted ? (
            <div className="p-6 bg-[#121212] border border-[#FF5500]/40 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-[#FF5500]">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white uppercase font-hero">Message Sent!</h3>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Thank you for contacting Patty Project. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white">
                    First Name <span className="text-[#9CA3AF] font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#222222] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#FF5500] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white">
                    Last Name <span className="text-[#9CA3AF] font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#222222] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#FF5500] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">
                  Email <span className="text-[#9CA3AF] font-normal">(required)</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#222222] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#FF5500] transition-colors"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">
                  Subject <span className="text-[#9CA3AF] font-normal">(required)</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#222222] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#FF5500] transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">
                  Message <span className="text-[#9CA3AF] font-normal">(required)</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#222222] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#FF5500] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/20 cursor-pointer"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER SECTION matching exact Screenshot */}
      <footer className="w-full bg-black pt-12 pb-6 text-white">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 space-y-12">
          
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-xs text-[#9CA3AF]">
            
            {/* Column 1: SHOP */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                SHOP
              </h3>
              <ul className="space-y-2.5 font-medium">
                <li><Link to="/menu" className="hover:text-white transition-colors">All Product</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Burger</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Sides</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Drink</Link></li>
              </ul>
            </div>

            {/* Column 2: ABOUT US */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                ABOUT US
              </h3>
              <ul className="space-y-2.5 font-medium">
                <li><Link to="/about" className="hover:text-white transition-colors">Story Behind</Link></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Customer Reviews</a></li>
                <li><a href="#packaging" className="hover:text-white transition-colors">Packaging Philosophy</a></li>
                <li><a href="#affiliate" className="hover:text-white transition-colors">Affiliate Program</a></li>
              </ul>
            </div>

            {/* Column 3: HELP */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                HELP
              </h3>
              <ul className="space-y-2.5 font-medium">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/select-location" className="hover:text-white transition-colors">Where to Buy</Link></li>
                <li><a href="#shipping" className="hover:text-white transition-colors">Shipping and Returns</a></li>
                <li><a href="#returns" className="hover:text-white transition-colors">Return and Refunds</a></li>
              </ul>
            </div>

            {/* Column 4: CONTACT */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#FF5500] tracking-widest uppercase font-hero">
                CONTACT
              </h3>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#FF5500] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:hello@pattyproject.co.uk" className="hover:text-white transition-colors">
                    hello@pattyproject.co.uk
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a href="https://maps.app.goo.gl/ucRr3c94PQKGgq4L7?g_st=aw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    4 Market Parade, London N9 9HF, United Kingdom
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#FF5500] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+447417521128" className="hover:text-white transition-colors font-bold">
                    +44 7417 521128
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Sub-Footer Line & Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <p className="font-medium text-white">Patty Project © 2026</p>
            <a href="#terms" className="hover:text-white transition-colors">Term of service</a>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default CustomerContact;
