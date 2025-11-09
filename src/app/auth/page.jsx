'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import logo from '@/assets/logor.webp';
import Image from 'next/image';

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      
      const payload = isLogin 
        ? { 
            email: formData.email.trim(), 
            password: formData.password.trim()
          }
        : {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password.trim()
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requiresVerification) {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
        } else {
          dispatch(setUser(data.user));
          router.push('/');
        }
      } else {
        if (data.requiresVerification) {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        } else {
          setError(data.error || 'Authentication failed');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:min-h-screen bg-gradient-to-br from-gray-50 via-white-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#3A5D1E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3A5D1E]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#3A5D1E]/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block space-y-4 text-center lg:text-left">
          <div>
            <Link href="/" className="inline-block">
              <Image src={logo} alt="Nature Medica" width={220} height={90} className="mb-4" />
            </Link>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#3A5D1E' }}>
              Welcome to Nature Medica
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Your trusted partner for quality medicines, vitamins, and organic health products
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2 max-w-md">
            {[
              { icon: ShieldCheck, text: 'Licensed & Certified Pharmacy' },
              { icon: Leaf, text: '100% Authentic Products' },
              { icon: Phone, text: '24/7 Customer Support' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl p-3 shadow-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(58, 93, 30, 0.1)' }}>
                  <feature.icon className="w-5 h-5" style={{ color: '#3A5D1E' }} />
                </div>
                <span className="text-gray-700 font-medium text-xs">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Mobile Logo */}
            <div className="lg:hidden pt-6 pb-3 text-center bg-gradient-to-br from-white to-green-50">
              <Link href="/" className="inline-block">
                <Image src={logo} alt="Nature Medica" width={160} height={65} />
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setFormData({ name: '', email: '', phone: '', password: '' });
                }}
                className={`flex-1 py-2.5 font-bold text-xs transition-all relative ${
                  isLogin
                    ? 'text-[#3A5D1E]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Login
                {isLogin && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5D1E]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setFormData({ name: '', email: '', phone: '', password: '' });
                }}
                className={`flex-1 py-2.5 font-bold text-xs transition-all relative ${
                  !isLogin
                    ? 'text-[#3A5D1E]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign Up
                {!isLogin && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5D1E]" />
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>
                <p className="text-gray-600 text-xs">
                  {isLogin 
                    ? 'Login to access your wellness journey' 
                    : 'Join us for a healthier lifestyle'
                  }
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 text-xs font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name<span className='text-red-500'>*</span>
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#3A5D1E] transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#3A5D1E] focus:outline-none transition-all bg-gray-50 focus:bg-white text-xs"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address<span className='text-red-500'>*</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#3A5D1E] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#3A5D1E] focus:outline-none transition-all bg-gray-50 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number<span className='text-red-500'>*</span>
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#3A5D1E] transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#3A5D1E] focus:outline-none transition-all bg-gray-50 focus:bg-white text-xs"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#3A5D1E] transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#3A5D1E] focus:outline-none transition-all bg-gray-50 focus:bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3A5D1E] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="mt-1 text-[10px] text-gray-500">
                      Must be at least 6 characters
                    </p>
                  )}
                </div>
              </div>

              {isLogin && (
                <div className="mt-2 text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold hover:underline"
                    style={{ color: '#3A5D1E' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95 text-xs"
                style={{ background: 'linear-gradient(135deg, #3A5D1E 0%, #2d4818 100%)' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Login to Account' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!isLogin && (
                <p className="mt-4 text-[10px] text-center text-gray-500 leading-relaxed">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="font-semibold hover:underline" style={{ color: '#3A5D1E' }}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="font-semibold hover:underline" style={{ color: '#3A5D1E' }}>
                    Privacy Policy
                  </Link>
                </p>
              )}
            </form>
          </div>

          <p className="text-center mt-4 text-gray-600 text-xs">
            <Link href="/" className="inline-flex items-center gap-2 hover:text-[#3A5D1E] font-semibold transition-colors">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
