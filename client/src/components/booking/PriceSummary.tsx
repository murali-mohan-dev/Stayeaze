import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Hotel, RoomCategory } from '../../types/index';
import { Tag, Sparkles, Shield, Check, Info } from 'lucide-react';

interface PriceSummaryProps {
  hotel: Hotel;
  category: RoomCategory;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  numRooms: number;
  roomSubtotal: number;
  extraServicesPrice: number;
  taxes: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  onApplyCoupon: (code: string) => void;
  couponInput: string;
  setCouponInput: (val: string) => void;
  couponValidating: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  hotel,
  category,
  checkInDate,
  checkOutDate,
  nights,
  numRooms,
  roomSubtotal,
  extraServicesPrice,
  taxes,
  discountAmount,
  couponCode,
  totalAmount,
  onApplyCoupon,
  couponInput,
  setCouponInput,
  couponValidating,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE3D5] shadow-lg space-y-6 sticky top-28">
      
      {/* Hotel and Room Overview */}
      <div className="flex gap-4 pb-5 border-b border-stone-100">
        <img
          src={
            (category.images && category.images[0]) ||
            (hotel.images && hotel.images[0]) ||
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'
          }
          alt={category.name}
          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-stone-200"
        />
        <div>
          <h4 className="font-serif font-bold text-base text-[#0B132B] line-clamp-1">{hotel.name}</h4>
          <p className="text-xs font-semibold text-[#C5A059]">{category.name}</p>
          <p className="text-[11px] text-stone-500 mt-1">
            {formatDate(checkInDate)} - {formatDate(checkOutDate)} ({nights} {nights === 1 ? 'Night' : 'Nights'})
          </p>
        </div>
      </div>

      {/* Coupon Code Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
            Promotional Voucher
          </span>
          <span className="text-[10px] text-stone-400 font-normal">Try: WELCOME10, STAYEASE20</span>
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder="ENTER PROMO CODE"
            className="flex-1 px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-mono font-bold text-[#0B132B] uppercase tracking-wider focus:outline-none focus:border-[#C5A059]"
          />
          <button
            type="button"
            disabled={!couponInput || couponValidating}
            onClick={() => onApplyCoupon(couponInput)}
            className="px-4 py-2.5 rounded-xl bg-[#0B132B] text-white text-xs font-bold hover:bg-[#C5A059] hover:text-[#0B132B] disabled:opacity-50 transition-all shadow-sm"
          >
            {couponValidating ? 'Checking...' : 'Apply'}
          </button>
        </div>

        {couponCode && (
          <div className="mt-2 text-xs text-emerald-700 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Voucher '{couponCode}' applied! Saved {formatCurrency(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Detailed Bill Breakdown */}
      <div className="space-y-3 pt-4 border-t border-stone-100 text-xs">
        <div className="flex justify-between text-stone-600">
          <span>
            {formatCurrency(category.basePrice)} × {nights} {nights === 1 ? 'night' : 'nights'} ({numRooms} {numRooms === 1 ? 'room' : 'rooms'})
          </span>
          <span className="font-semibold text-stone-800">{formatCurrency(roomSubtotal)}</span>
        </div>

        {extraServicesPrice > 0 && (
          <div className="flex justify-between text-stone-600">
            <span>Additional Selected Experiences</span>
            <span className="font-semibold text-stone-800">{formatCurrency(extraServicesPrice)}</span>
          </div>
        )}

        <div className="flex justify-between text-stone-600">
          <span className="flex items-center gap-1">
            GST Hospitality Taxes (12% / 18%)
          </span>
          <span className="font-semibold text-stone-800">{formatCurrency(taxes)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Special Promotional Discount</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        {/* Final Payable Amount */}
        <div className="pt-4 border-t border-stone-200 flex items-baseline justify-between">
          <div>
            <span className="block font-serif text-sm font-bold text-[#0B132B]">Total Payable</span>
            <span className="text-[10px] text-stone-400">All inclusive in INR</span>
          </div>
          <span className="font-serif text-2xl font-extrabold text-[#0B132B]">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EBE3D5] text-[11px] text-stone-500 space-y-1">
        <div className="flex items-center space-x-1.5 text-stone-700 font-bold">
          <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>StayEase Best Price Guarantee</span>
        </div>
        <p>No unexpected hidden charges at check-in. Instant confirmation.</p>
      </div>

    </div>
  );
};
