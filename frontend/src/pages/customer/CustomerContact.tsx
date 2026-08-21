import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { CustomerFooter } from '../../components/customer/CustomerFooter';

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

      {/* Customer Footer */}
      <CustomerFooter />
    </div>
  );
};

export default CustomerContact;
