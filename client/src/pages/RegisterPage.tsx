import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { Crown, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showToast('Registration successful! Welcome to StayEase.', 'success');
        navigate('/dashboard');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Registration failed.', 'error');
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
          <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Join StayEase</h2>
          <p className="text-xs text-stone-500 mt-1">Unlock seamless reservations and member vouchers</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. arjun@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#C5A059] hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
