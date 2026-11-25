import React from 'react';
import { User, Mail, Phone, MessageSquare, ShieldCheck } from 'lucide-react';

interface GuestFormProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  onChange: (field: string, value: string) => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({
  guestName,
  guestEmail,
  guestPhone,
  specialRequests,
  onChange,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-6">
      <div className="pb-4 border-b border-stone-100">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B132B]">
          Guest Details & Arrival Preferences
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Your booking confirmation and digital key pass will be dispatched to these credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Full Name (as per Govt ID) *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => onChange('guestName', e.target.value)}
              placeholder="e.g. Aditya Kashyap"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={guestEmail}
              onChange={(e) => onChange('guestEmail', e.target.value)}
              placeholder="e.g. aditya@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Mobile Phone */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Phone Number (for SMS & WhatsApp concierge updates) *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              value={guestPhone}
              onChange={(e) => onChange('guestPhone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Special Requests / Dietary / Arrival Notes (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <textarea
              rows={3}
              value={specialRequests}
              onChange={(e) => onChange('specialRequests', e.target.value)}
              placeholder="e.g. Quiet upper floor room, twin beds, early flight arrival at 11:00 AM..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-medium text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-xs text-emerald-800">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Double Booking Protection:</strong> Rooms are atomically locked upon reservation confirmation. Your room assignment is 100% guaranteed.
        </span>
      </div>
    </div>
  );
};
