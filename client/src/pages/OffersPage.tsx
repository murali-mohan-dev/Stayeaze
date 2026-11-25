import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Coupon } from '../types/index';
import { useToast } from '../context/ToastContext';
import { Gift, Copy, Check, Sparkles, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OffersPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/coupons');
        if (res.data.success) {
          setCoupons(res.data.coupons);
        }
      } catch (err) {
        console.error('Failed to load coupons', err);
      }
    };
    fetchOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Voucher code '${code}' copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-8 sm:p-14 mb-16 shadow-2xl border border-[#C5A059]/30">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-4">
              <Gift className="w-4 h-4" />
              <span>Privilege Vouchers & Promotions</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Curated Luxury At <span className="text-[#C5A059]">Exceptional Rates</span>
            </h1>
            <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed">
              Explore our current roster of verified promotional vouchers. Redeemable instantly during room reservation for instant discounts and complimentary upgrades.
            </p>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-3xl p-8 border border-[#EBE3D5] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FAF7F2] text-[#8C7A5B] text-xs font-bold">
                    <Tag className="w-3.5 h-3.5 mr-1.5 text-[#C5A059]" />
                    {coupon.discountType === 'PERCENTAGE'
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} FLAT OFF`}
                  </span>
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#0B132B]">
                  {coupon.code}
                </h3>

                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  {coupon.description}
                </p>

                <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1">
                  <div>Min. Booking Value: ₹{coupon.minBookingAmount.toLocaleString('en-IN')}</div>
                  {coupon.maxDiscount && (
                    <div>Maximum Discount Limit: ₹{coupon.maxDiscount.toLocaleString('en-IN')}</div>
                  )}
                  <div>Valid through: {new Date(coupon.validUntil).toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0B132B] text-white hover:bg-[#C5A059] hover:text-[#0B132B]'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Code Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Voucher</span>
                    </>
                  )}
                </button>

                <Link
                  to="/hotels"
                  className="text-xs font-bold text-[#0B132B] hover:text-[#C5A059] flex items-center gap-1"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
