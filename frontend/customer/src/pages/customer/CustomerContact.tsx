import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white selection:bg-[#FF5500] selection:text-white flex flex-col justify-between">
      {/* 1400px Apple-inspired Editorial Container */}
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24">
        
        {/* Two-Column Desktop Layout (46% Left / 54% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-stretch">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Contact Intro & Form (Approx 46%) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            
            {/* Contact Hero Intro */}
            <div className="space-y-4">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-[#FF5500] block">
                CONTACT US
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[64px] xl:text-[72px] font-black uppercase text-white tracking-tight font-hero leading-[0.96]">
                GET IN TOUCH
              </h1>

              <p className="text-base sm:text-lg lg:text-[18px] text-[#A1A1A1] leading-[1.5] max-w-[520px]">
                We'd love to hear from you. Whether it's a question, feedback or a custom request — drop us a message.
              </p>

              {/* Location Line */}
              <div className="text-sm sm:text-[15px] text-[#A1A1A1] pt-1 space-y-0.5">
                <p>
                  Find our{' '}
                  <Link to="/select-location" className="text-[#FF5500] font-semibold hover:underline">
                    store locations here
                  </Link>
                  .
                </p>
                <p>
                  We're excited to welcome you to{' '}
                  <span className="text-[#FF5500] font-semibold">Patty Project</span>.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            {submitted ? (
              <div className="p-8 bg-[#111111] border border-[#FF5500]/40 rounded-xl space-y-3 transition-all">
                <div className="flex items-center gap-3 text-[#FF5500]">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <h3 className="text-lg font-bold text-white uppercase font-hero tracking-wide">
                    Message Sent Successfully
                  </h3>
                </div>
                <p className="text-sm text-[#A1A1A1] leading-relaxed">
                  Thank you for reaching out. Our team has received your note and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 max-w-[540px]">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label 
                      htmlFor="first-name" 
                      className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                    >
                      First Name <span className="text-neutral-500 font-normal lowercase text-xs">(required)</span>
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      required
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-[52px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-lg px-4 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="last-name" 
                      className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                    >
                      Last Name <span className="text-neutral-500 font-normal lowercase text-xs">(required)</span>
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      required
                      placeholder="Your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-[52px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-lg px-4 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div className="space-y-2">
                  <label 
                    htmlFor="contact-email" 
                    className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                  >
                    Email <span className="text-neutral-500 font-normal lowercase text-xs">(required)</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[52px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-lg px-4 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                  />
                </div>

                {/* Row 3: Subject */}
                <div className="space-y-2">
                  <label 
                    htmlFor="contact-subject" 
                    className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                  >
                    Subject <span className="text-neutral-500 font-normal lowercase text-xs">(required)</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-[52px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-lg px-4 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                  />
                </div>

                {/* Row 4: Message */}
                <div className="space-y-2">
                  <label 
                    htmlFor="contact-message" 
                    className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                  >
                    Message <span className="text-neutral-500 font-normal lowercase text-xs">(required)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-[130px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-lg p-4 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="h-[52px] px-8 bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-[#FF5500]/20 active:scale-[0.98] cursor-pointer"
                  >
                    <span>SUBMIT MESSAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Large Editorial Restaurant Interior Image (Approx 54%) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full h-[380px] sm:h-[480px] lg:h-[650px] xl:h-[680px] rounded-[20px] overflow-hidden border border-[#222222] bg-[#111111]">
              <img
                src="/contact_background.jpg"
                alt="Patty Project Restaurant Interior & Bar"
                className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-500 hover:scale-[1.01]"
                loading="eager"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerContact;
