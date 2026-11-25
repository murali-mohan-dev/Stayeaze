import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { Crown, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showToast(res.data.message || 'Signed in successfully!', 'success');
        if (res.data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#EBE3D5] shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B132B] flex items-center justify-center border border-[#C5A059]">
              <Crown className="w-5 h-5 text-[#C5A059]" />
            </div>
            <span className="font-serif text-2xl font-bold text-[#0B132B]">
              Stay<span className="text-[#C5A059]">Ease</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Welcome Back</h2>
          <p className="text-xs text-stone-500 mt-1">Sign in to manage your luxury reservations</p>
        </div>

        {/* Demo Credentials Quick-Fill Pill */}
        <div className="mb-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D5] space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0B132B]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Demo Quick-Fill:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@stayease.com', 'customer123')}
              className="flex-1 py-1.5 px-2 bg-white rounded-xl border border-stone-200 text-[11px] font-bold text-stone-700 hover:border-[#C5A059] shadow-sm"
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@stayease.com', 'admin123')}
              className="flex-1 py-1.5 px-2 bg-amber-50 rounded-xl border border-amber-300 text-[11px] font-bold text-amber-800 hover:bg-amber-100 shadow-sm"
            >
              👑 Administrator
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@stayease.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-stone-500">
          New to StayEase?{' '}
          <Link to="/register" className="font-bold text-[#C5A059] hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
