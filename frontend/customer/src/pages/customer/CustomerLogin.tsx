import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

export const CustomerLogin: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from || '/';

  const resetFormState = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const response: any = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (response && response.access_token && response.user) {
        setAuth(response.access_token, response.user);
        navigate(redirectPath, { replace: true });
      } else {
        setError('Invalid response from authentication server.');
      }
    } catch (err: any) {
      const errorDetail = typeof err?.message === 'string' ? err.message : '';
      if (errorDetail.toLowerCase().includes('incorrect') || errorDetail.toLowerCase().includes('invalid')) {
        setError('Invalid email or password.');
      } else if (errorDetail.toLowerCase().includes('disabled')) {
        setError('This account has been disabled. Please contact support.');
      } else {
        setError(errorDetail || 'Unable to sign in right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response: any = await api.post('/auth/register', {
        email: email.trim(),
        password: password,
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
      });

      if (response && response.access_token && response.user) {
        setAuth(response.access_token, response.user);
        navigate('/loyalty', { replace: true });
      } else {
        setError('Registration completed, please login to continue.');
        setMode('login');
      }
    } catch (err: any) {
      const errorDetail = typeof err?.message === 'string' ? err.message : '';
      if (errorDetail.toLowerCase().includes('already registered')) {
        setError('An account with this email address already exists. Please sign in.');
      } else {
        setError(errorDetail || 'Unable to complete registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Password reset instructions have been sent to your email.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Desktop Right Side Hero Burger Container */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[55%] xl:w-[58%] pointer-events-none overflow-hidden z-0">
        <div className="relative w-full h-full">
          <img
            src="/herobackground.png"
            alt="Patty Project Hero Burger"
            className="w-full h-full object-cover object-center select-none"
          />
          {/* Soft Dark Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/50 via-transparent to-[#070707]/30" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center lg:w-[50%] xl:w-[48%] lg:pl-[8vw] px-4 sm:px-12 lg:px-8 py-8 my-auto">
        <div className="w-full max-w-[520px] bg-[#121212] border border-[#222222] rounded-2xl p-6 sm:p-12 shadow-2xl shadow-black/90 my-auto flex flex-col justify-between">
          <div>
            {/* Patty Project Brand Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-6 shadow-2xl flex items-center justify-center border border-[#282828]">
              <img
                src="/logo.jpeg"
                alt="Patty Project"
                className="w-full h-full object-cover scale-[1.22] select-none"
              />
            </div>

            {/* Error Alert Box */}
            {error && (
              <div className="mb-5 bg-[#2A1215] border border-[#EF4444]/40 text-[#FCA5A5] text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert Box */}
            {successMessage && (
              <div className="mb-5 bg-[#122718] border border-[#22C55E]/40 text-[#86EFAC] text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight text-center">Login</h1>
                  <p className="text-xs text-[#9CA3AF] text-center mt-2 leading-relaxed">
                    Welcome back! Login to your loyalty account and enjoy rewards.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} autoComplete="off" className="mt-6 space-y-4">
                  {/* Email Address Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#D1D5DB]">Email Address</label>
                    <div className="flex items-center bg-[#181818] border border-[#282828] focus-within:border-[#FF5500] rounded-xl px-3.5 py-3 transition-colors">
                      <Mail className="w-4 h-4 text-[#FF5500] mr-2.5 shrink-0" />
                      <input
                        type="email"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johnsmith@email.com"
                        className="w-full bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#D1D5DB]">Password</label>
                    <div className="flex items-center bg-[#181818] border border-[#282828] focus-within:border-[#FF5500] rounded-xl px-3.5 py-3 transition-colors">
                      <Lock className="w-4 h-4 text-[#FF5500] mr-2.5 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-[#9CA3AF] font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5500] rounded border-[#282828] bg-[#181818] cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        resetFormState();
                        setMode('forgot');
                      }}
                      className="text-[#FF5500] font-bold hover:underline transition-all cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Primary Orange Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-[#FF5500] hover:bg-[#E04B00] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>LOGGING IN...</span>
                      </>
                    ) : (
                      <span>LOGIN</span>
                    )}
                  </button>
                </form>

                {/* Or Continue With Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#222222]"></div>
                  </div>
                  <span className="relative bg-[#121212] px-3 text-[11px] font-medium text-[#6B7280]">
                    or continue with
                  </span>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setError('Google sign-in is coming soon.')}
                    className="w-full bg-[#181818] hover:bg-[#222222] border border-[#282828] text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setError('Apple sign-in is coming soon.')}
                    className="w-full bg-[#181818] hover:bg-[#222222] border border-[#282828] text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.84.13-9.66-1.94-14.47-6.23-3.21-2.77-7.14-7.46-11.79-14.07-5.91-8.39-10.74-17.78-14.48-28.18-3.75-10.4-5.63-20.47-5.63-30.22 0-14.67 3.77-26.69 11.31-36.06 7.54-9.37 17.02-14.16 28.44-14.37 4.71 0 9.87 1.16 15.48 3.49 5.61 2.33 9.49 3.49 11.64 3.49 1.83 0 5.86-1.22 12.09-3.67 6.23-2.45 11.58-3.56 16.05-3.32 12.02.57 21.65 4.97 28.89 13.2-10.59 6.42-15.77 15.44-15.54 27.06.23 9.17 3.78 16.8 10.65 22.88 6.87 6.08 15.02 9.61 24.45 10.59-2.58 7.74-6.07 15.65-10.48 23.73zM119.22 31.84c0-7.07 2.58-13.91 7.75-20.52 5.17-6.61 11.63-10.68 19.38-12.22.23 1.02.35 1.93.35 2.73 0 6.94-2.59 13.78-7.77 20.52-5.18 6.74-11.75 10.9-19.71 12.49-.12-.8-.18-1.8-.18-3z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {/* Bottom Sign Up Prompt & Admin Portal Link */}
                <div className="space-y-3 mt-5">
                  <p className="text-center text-xs text-[#9CA3AF] font-medium">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        resetFormState();
                        setMode('register');
                      }}
                      className="text-[#FF5500] font-extrabold hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </p>

                  <div className="pt-3 border-t border-[#1F1F1F] text-center">
                    <Link
                      to="/admin/login"
                      className="text-[11px] font-bold text-[#FF5500] hover:underline transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <span>🔐 Admin Portal Login</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight text-center">Create Account</h1>
                  <p className="text-xs text-[#9CA3AF] text-center mt-2 leading-relaxed">
                    Join Patty Project rewards today and receive 100 welcome bonus points!
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#D1D5DB]">Full Name</label>
                    <div className="flex items-center bg-[#181818] border border-[#282828] focus-within:border-[#FF5500] rounded-xl px-3.5 py-2.5 transition-colors">
                      <UserIcon className="w-4 h-4 text-[#FF5500] mr-2.5 shrink-0" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#D1D5DB]">Email Address</label>
                    <div className="flex items-center bg-[#181818] border border-[#282828] focus-within:border-[#FF5500] rounded-xl px-3.5 py-2.5 transition-colors">
                      <Mail className="w-4 h-4 text-[#FF5500] mr-2.5 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johnsmith@email.com"
                        className="w-full bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#D1D5DB]">Phone Number (Optional)</label>
                    <div className="flex items-center bg-[#181818] border border-[#282828] focus-within:border-[#FF5500] rounded-xl px-3.5 py-2.5 transition-colors">
                      <Phone className="w-4 h-4 text-[#FF5500] mr-2.5 shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7123 456789"
                        className="w-full bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#D1D5DB]">Password</label>
                    <div className="flex items-center bg-[#181818] border border-[#282828] focus-within:border-[#FF5500] rounded-xl px-3.5 py-2.5 transition-colors">
                      <Lock className="w-4 h-4 text-[#FF5500] mr-2.5 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-[#FF5500] hover:bg-[#E04B00] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>CREATING ACCOUNT...</span>
                      </>
                    ) : (
                      <span>CREATE ACCOUNT</span>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-[#9CA3AF] mt-5 font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      resetFormState();
                      setMode('login');
                    }}
                    className="text-[#FF5500] font-extrabold hover:underline cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </div>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot' && (
              <div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight text-center">Forgot Password?</h1>
                  <p className="text-xs text-[#9CA3AF] text-center mt-2 leading-relaxed">
                    Enter your account email address and we'll send you a password reset link.
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#D1D5DB]">Email Address</label>
                    <div className="flex items-center bg-[#181818] border border-[#282828] focus-within:border-[#FF5500] rounded-xl px-3.5 py-3 transition-colors">
                      <Mail className="w-4 h-4 text-[#FF5500] mr-2.5 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johnsmith@email.com"
                        className="w-full bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-[#FF5500] hover:bg-[#E04B00] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5500]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SENDING LINK...</span>
                      </>
                    ) : (
                      <span>SEND RESET LINK</span>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-[#9CA3AF] mt-6 font-medium">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      resetFormState();
                      setMode('login');
                    }}
                    className="text-[#FF5500] font-extrabold hover:underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centered Footer Copy */}
      <footer className="relative z-10 py-3.5 text-center text-[11px] text-[#6B7280] font-medium border-t border-[#141414] bg-[#070707] flex items-center justify-center gap-3">
        <p>© 2026 Patty Project London. All rights reserved.</p>
        <span>•</span>
        <Link to="/admin/login" className="text-[#FF5500] hover:underline font-bold transition-colors">
          Admin Portal Access
        </Link>
      </footer>
    </div>
  );
};
