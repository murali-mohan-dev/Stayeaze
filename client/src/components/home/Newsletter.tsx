import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setSubscribed(true);
    showToast('Welcome to StayEase Club! A ₹1,500 welcome voucher code has been credited to your email.', 'success');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The StayEase Privilege Club</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
          Unlock Secret Luxury Rates & Privileges
        </h2>

        <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
          Subscribe to our private invitation newsletter. Receive unadvertised seasonal discounts, complimentary room upgrades, and dining credits directly in your inbox.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Thank you for joining! Check your inbox for your welcome voucher: <strong>WELCOME10</strong></span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
          >
            <div className="w-full relative">
              <Mail className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your personal email..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C5A059] text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B38F24] hover:to-[#C5A059] text-[#0B132B] font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              Join VIP Club
            </button>
          </form>
        )}

        <p className="text-xs text-stone-400 mt-4">
          Strictly confidential. No spam, ever. Unsubscribe at any time with one click.
        </p>

      </div>
    </section>
  );
};
