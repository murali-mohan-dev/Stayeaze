import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { Booking } from '../types/index';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Printer,
  ConciergeBell,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.error('Failed to load booking pass', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-lg text-[#0B132B]">Generating your verified booking pass...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Booking Pass Not Found</h2>
          <Link to="/" className="text-xs font-bold text-[#C5A059] mt-2 inline-block">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Animated Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-xl text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] block">
            Reservation Confirmed & Guaranteed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B]">
            Your Luxury Sanctuary Awaits
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
            A copy of this digital confirmation and itinerary receipt has been registered under reference:
          </p>
          <div className="inline-block px-4 py-2 rounded-xl bg-[#0B132B] text-[#C5A059] font-mono font-bold text-base shadow">
            {booking.bookingReference}
          </div>
        </motion.div>

        {/* Printable Hotel Pass / Invoice Card */}
        <div id="booking-invoice" className="bg-white rounded-3xl border border-[#EBE3D5] shadow-lg overflow-hidden">
          
          {/* Header Strip */}
          <div className="bg-[#0B132B] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-serif text-[#C5A059] tracking-widest uppercase">StayEase Official Guest Pass</p>
              <h2 className="font-serif text-2xl font-bold">{booking.hotel?.name}</h2>
              <p className="text-xs text-stone-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                {booking.hotel?.address}, {booking.hotel?.city}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-stone-400 block">Status</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {booking.status}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Itinerary Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Check-In</span>
                <span className="font-bold text-sm text-[#0B132B]">{formatDate(booking.checkInDate)}</span>
                <span className="text-[11px] text-stone-500 block">From {booking.hotel?.checkInTime || '14:00'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Check-Out</span>
                <span className="font-bold text-sm text-[#0B132B]">{formatDate(booking.checkOutDate)}</span>
                <span className="text-[11px] text-stone-500 block">Until {booking.hotel?.checkOutTime || '11:00'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Nights & Rooms</span>
                <span className="font-bold text-sm text-[#0B132B]">
                  {booking.nights} Nights, {booking.numRooms} Room{booking.numRooms > 1 ? 's' : ''}
                </span>
                <span className="text-[11px] text-stone-500 block">{booking.numGuests} Guests</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Assigned Rooms</span>
                <span className="font-mono font-bold text-xs text-[#C5A059] bg-[#FAF7F2] px-2 py-1 rounded border border-[#EBE3D5] inline-block">
                  {booking.selectedRoomNumbers || 'Room 101'}
                </span>
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 block">Primary Guest Name:</span>
                <span className="font-bold text-stone-800 text-sm">{booking.guestName}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Contact Credentials:</span>
                <span className="font-semibold text-stone-800">{booking.guestEmail} • {booking.guestPhone}</span>
              </div>
              {booking.specialRequests && (
                <div className="sm:col-span-2">
                  <span className="text-stone-400 block">Special Requests Noted:</span>
                  <span className="text-stone-700 italic">{booking.specialRequests}</span>
                </div>
              )}
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[11px] mb-2">
                Simulated Payment Statement
              </h4>

              <div className="flex justify-between text-stone-600">
                <span>Room Charges ({booking.nights} nights × {formatCurrency(booking.roomPrice)})</span>
                <span className="font-semibold">{formatCurrency(booking.roomPrice * booking.nights * booking.numRooms)}</span>
              </div>

              {booking.extraServicesPrice > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Additional Experience Add-ons</span>
                  <span className="font-semibold">{formatCurrency(booking.extraServicesPrice)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>GST Hospitality Taxes</span>
                <span className="font-semibold">{formatCurrency(booking.taxes)}</span>
              </div>

              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promotional Discount ({booking.couponCode || 'PROMO'})</span>
                  <span>-{formatCurrency(booking.discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm text-[#0B132B]">
                <span>Total Amount Paid</span>
                <span className="font-serif text-2xl font-extrabold text-[#0B132B]">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>

              {booking.payment && (
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Payment Method: {booking.payment.method}</span>
                  <span>Transaction Ref: {booking.payment.transactionId}</span>
                </div>
              )}
            </div>

          </div>

          {/* Action Bar */}
          <div className="bg-[#FAF7F2] p-4 sm:p-6 border-t border-[#EBE3D5] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <div className="flex items-center space-x-3">
              <Link
                to={`/dashboard?tab=services&bookingId=${booking.id}`}
                className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] text-xs font-bold transition-all shadow flex items-center gap-1.5"
              >
                <ConciergeBell className="w-4 h-4" />
                <span>Request Room Service</span>
              </Link>

              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-white border border-[#C5A059] text-xs font-bold text-[#0B132B] hover:bg-[#FAF7F2] transition-all flex items-center gap-1.5"
              >
                <span>My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
