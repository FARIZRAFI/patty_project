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
      {/* 1280–1400px Centered Editorial Container */}
      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20">
        
        {/* Two-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Contact Intro & Form */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Intro */}
            <div className="space-y-3">
              <div>
                <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.12em] text-[#FF5500] block">
                  CONTACT US
                </span>
                <div className="w-8 h-0.5 bg-[#FF5500] rounded-full mt-1.5" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[64px] xl:text-[70px] font-black uppercase text-white tracking-tight font-hero leading-[0.95] pt-1">
                GET IN TOUCH
              </h1>

              <p className="text-[15px] sm:text-base lg:text-[17px] text-[#A1A1A1] leading-[1.5] max-w-[500px] pt-1">
                We'd love to hear from you. Whether it's a question, feedback or a custom request — drop us a message.
              </p>

              {/* Location Line */}
              <div className="text-xs sm:text-sm text-[#A1A1A1] pt-1 leading-relaxed">
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
              <div className="p-6 bg-[#111111] border border-[#FF5500]/40 rounded-[8px] space-y-2.5 transition-all">
                <div className="flex items-center gap-2.5 text-[#FF5500]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-base font-bold text-white uppercase font-hero tracking-wide">
                    Message Sent Successfully
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  Thank you for reaching out. Our team has received your note and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-[500px]">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="first-name" 
                      className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                    >
                      First Name <span className="text-neutral-500 font-normal lowercase text-[11px]">(required)</span>
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      required
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-[50px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-[8px] px-3.5 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label 
                      htmlFor="last-name" 
                      className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                    >
                      Last Name <span className="text-neutral-500 font-normal lowercase text-[11px]">(required)</span>
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      required
                      placeholder="Your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-[50px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-[8px] px-3.5 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="contact-email" 
                    className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                  >
                    Email <span className="text-neutral-500 font-normal lowercase text-[11px]">(required)</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[50px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-[8px] px-3.5 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                  />
                </div>

                {/* Row 3: Subject */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="contact-subject" 
                    className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                  >
                    Subject <span className="text-neutral-500 font-normal lowercase text-[11px]">(required)</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-[50px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-[8px] px-3.5 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors"
                  />
                </div>

                {/* Row 4: Message */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="contact-message" 
                    className="block text-xs sm:text-[13px] font-semibold text-white tracking-wide"
                  >
                    Message <span className="text-neutral-500 font-normal lowercase text-[11px]">(required)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-[120px] bg-[#111111] border border-[#292929] focus:border-[#FF5500] rounded-[8px] p-3.5 text-[15px] text-white placeholder:text-[#666666] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button: ~210px wide, 50px high, subtle hover lift */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-[210px] h-[50px] bg-[#FF5500] hover:bg-[#FF661A] text-white text-xs sm:text-[13px] font-bold uppercase tracking-wider rounded-[8px] flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md hover:shadow-lg hover:shadow-[#FF5500]/20"
                  >
                    <span>SUBMIT MESSAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Large Editorial Restaurant Interior Image */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex items-start justify-center pt-1 lg:pt-2">
            <div className="w-full h-[380px] sm:h-[460px] lg:h-[620px] xl:h-[640px] rounded-[20px] overflow-hidden border border-[#222222] bg-[#111111]">
              <img
                src="/contact_background.jpg"
                alt="Patty Project Restaurant Interior & Bar"
                className="w-full h-full object-cover object-center select-none pointer-events-none brightness-[1.08] contrast-[1.03]"
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
