import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Coupon } from '../../types/index';
import { useToast } from '../../context/ToastContext';
import { Gift, Copy, Check, Sparkles, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export const SpecialOffers: React.FC = () => {
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
        console.error('Failed to fetch coupons', err);
      }
    };
    fetchOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code '${code}' copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (coupons.length === 0) return null;

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">
            <Gift className="w-4 h-4" />
            <span>Exclusive Savings</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B]">
            Special Offers & Member Discounts
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Apply these verified promotional codes during checkout to enjoy premier rates and complementary upgrades.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coupons.map((coupon, i) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Decorative corner tag */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#C5A059]/10 rounded-bl-3xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
              </div>

              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FAF7F2] text-[#8C7A5B] text-xs font-bold mb-4">
                  <Tag className="w-3.5 h-3.5 mr-1 text-[#C5A059]" />
                  {coupon.discountType === 'PERCENTAGE'
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} FLAT OFF`}
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0B132B]">
                  {coupon.code}
                </h3>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed min-h-[36px]">
                  {coupon.description}
                </p>

                <p className="text-[11px] text-stone-400 mt-3">
                  Min. Booking: ₹{coupon.minBookingAmount.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Copy Coupon Action */}
              <div className="pt-4 mt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-1 rounded-md">
                  {coupon.code}
                </span>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0B132B] text-white hover:bg-[#C5A059] hover:text-[#0B132B]'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
