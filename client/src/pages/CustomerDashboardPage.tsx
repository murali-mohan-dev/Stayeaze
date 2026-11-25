import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { Booking, ServiceRequest, WishlistItem } from '../types/index';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import {
  Calendar,
  Heart,
  Clock,
  User,
  ConciergeBell,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Send,
  Lock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'bookings';
  const prefillBookingId = searchParams.get('bookingId') || '';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Service Request Modal state
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(prefillBookingId);
  const [serviceType, setServiceType] = useState('ROOM_CLEANING');
  const [serviceDetails, setServiceDetails] = useState('');
  const [serviceSubmitting, setServiceSubmitting] = useState(false);

  // Profile Edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Cancel Booking Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, servicesRes, wishlistRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/services/my'),
          api.get('/wishlist/my'),
        ]);

        if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
        if (servicesRes.data.success) setServices(servicesRes.data.serviceRequests);
        if (wishlistRes.data.success) setWishlist(wishlistRes.data.wishlist);

        if (prefillBookingId) {
          setSelectedBookingId(prefillBookingId);
          setServiceModalOpen(true);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, prefillBookingId]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        password: password || undefined,
      });

      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Profile information updated successfully!', 'success');
        setPassword('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleRequestService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      showToast('Please select which active booking this request belongs to.', 'error');
      return;
    }

    setServiceSubmitting(true);
    try {
      const res = await api.post('/services', {
        bookingId: selectedBookingId,
        serviceType,
        details: serviceDetails,
      });

      if (res.data.success) {
        showToast('Service request submitted to the front desk!', 'success');
        setServices([res.data.serviceRequest, ...services]);
        setServiceModalOpen(false);
        setServiceDetails('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit service request.', 'error');
    } finally {
      setServiceSubmitting(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);

    try {
      const res = await api.patch(`/bookings/${bookingToCancel.id}/cancel`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setBookings(
          bookings.map((b) => (b.id === bookingToCancel.id ? { ...b, status: 'CANCELLED' } : b))
        );
        setCancelModalOpen(false);
        setBookingToCancel(null);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel reservation.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN');
  const pastBookings = bookings.filter((b) => b.status === 'CHECKED_OUT');
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Profile Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name || 'User'}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#C5A059]"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B132B]">
                  Welcome, {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8C7A5B] border border-[#C5A059]/40 uppercase tracking-wider">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {user?.email} • Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (activeBookings.length > 0) {
                  setSelectedBookingId(activeBookings[0].id);
                }
                setServiceModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <ConciergeBell className="w-4 h-4" />
              <span>New In-Room Service</span>
            </button>
            <Link
              to="/hotels"
              className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#0B132B] font-bold text-xs border border-stone-200 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Explore New Stays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-stone-200">
          {[
            { id: 'bookings', label: `My Reservations (${bookings.length})`, icon: Calendar },
            { id: 'services', label: `Room Services (${services.length})`, icon: ConciergeBell },
            { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart },
            { id: 'profile', label: 'Profile Settings', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`px-5 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0B132B] text-white shadow-md'
                    : 'bg-white text-stone-600 hover:text-[#0B132B] hover:bg-stone-50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: RESERVATIONS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE3D5] space-y-3">
                <Calendar className="w-12 h-12 text-[#C5A059] mx-auto opacity-70" />
                <h3 className="font-serif text-xl font-bold text-[#0B132B]">No Reservations Found</h3>
                <p className="text-xs text-stone-500">You do not have any room bookings yet.</p>
                <Link
                  to="/hotels"
                  className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-[#0B132B] text-white font-bold text-xs hover:bg-[#C5A059] hover:text-[#0B132B] transition-all"
                >
                  Book Your First Stay
                </Link>
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE3D5] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between"
                >
                  {/* Left: Hotel & Room Info */}
                  <div className="flex gap-4">
                    <img
                      src={
                        (b.hotel?.images && b.hotel.images[0]) ||
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={b.hotel?.name || 'Hotel'}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-stone-200"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#C5A059]">
                          {b.bookingReference}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.status === 'CHECKED_IN'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : b.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h4 className="font-serif text-xl font-bold text-[#0B132B]">
                        {b.hotel?.name}
                      </h4>
                      <p className="text-xs text-stone-500 font-semibold">{b.category?.name}</p>
                      
                      <div className="text-xs text-stone-600 pt-1 space-y-0.5">
                        <p>
                          📅 <strong>{formatDate(b.checkInDate)}</strong> - <strong>{formatDate(b.checkOutDate)}</strong> ({b.nights} {b.nights === 1 ? 'Night' : 'Nights'})
                        </p>
                        <p>
                          📍 Assigned Room(s): <span className="font-mono font-bold text-[#0B132B]">{b.selectedRoomNumbers || 'Room 101'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Financials & Action Buttons */}
                  <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-stone-400 block">Total Amount</span>
                      <span className="font-serif text-2xl font-bold text-[#0B132B]">
                        {formatCurrency(b.totalAmount)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium block">
                        {b.payment?.status === 'SUCCESS' ? '● Payment Settled' : 'Payment at Hotel'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <Link
                        to={`/booking-confirmation/${b.id}`}
                        className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-stone-200 text-xs font-bold text-[#0B132B] transition-all"
                      >
                        Digital Pass / Receipt
                      </Link>

                      {b.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBookingId(b.id);
                              setServiceModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <ConciergeBell className="w-3.5 h-3.5" />
                            <span>Room Service</span>
                          </button>

                          <button
                            onClick={() => {
                              setBookingToCancel(b);
                              setCancelModalOpen(true);
                            }}
                            className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ROOM SERVICE REQUESTS */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0B132B]">
                  In-Room Concierge & Service Requests
                </h3>
                <p className="text-xs text-stone-500">
                  Track room cleaning, food & beverages, laundry, and extra towel orders.
                </p>
              </div>
              <button
                onClick={() => setServiceModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] text-xs font-bold transition-all flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>New Request</span>
              </button>
            </div>

            {services.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE3D5] space-y-3">
                <ConciergeBell className="w-12 h-12 text-[#C5A059] mx-auto opacity-70" />
                <h4 className="font-serif text-lg font-bold text-[#0B132B]">No Active Service Requests</h4>
                <p className="text-xs text-stone-500">Request room cleaning, housekeeping, or dining directly to your assigned room.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-5 rounded-2xl border border-[#EBE3D5] shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-serif font-bold text-base text-[#0B132B] block">
                          {req.serviceType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-stone-500">
                          {req.hotel?.name} • <strong>{req.roomNumber}</strong>
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          req.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {req.details && (
                      <p className="text-xs text-stone-600 bg-[#FAF7F2] p-2.5 rounded-xl border border-stone-200/60 italic">
                        "{req.details}"
                      </p>
                    )}

                    <div className="text-[11px] text-stone-400 flex items-center justify-between pt-2 border-t border-stone-100">
                      <span>Ref: {req.booking?.bookingReference}</span>
                      <span>Requested: {formatDateTime(req.requestedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENT LEDGER */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100">
              <h3 className="font-serif text-xl font-bold text-[#0B132B]">Simulated Payment Transactions</h3>
              <p className="text-xs text-stone-500">Verified record of reservation transactions and refunds.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Reservation Ref</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="p-4 font-mono font-bold text-[#0B132B]">
                        {b.payment?.transactionId || 'PENDING-AT-CHECKIN'}
                      </td>
                      <td className="p-4 font-mono text-[#C5A059]">{b.bookingReference}</td>
                      <td className="p-4 font-medium">{b.payment?.method || 'PAY_AT_HOTEL'}</td>
                      <td className="p-4 text-stone-500">
                        {b.payment?.paymentDate ? formatDate(b.payment.paymentDate) : formatDate(b.createdAt)}
                      </td>
                      <td className="p-4 font-serif font-bold text-sm text-[#0B132B]">
                        {formatCurrency(b.totalAmount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.payment?.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-700'
                              : b.payment?.status === 'REFUNDED'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {b.payment?.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#0B132B]">Saved Sanctuaries</h3>
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE3D5] space-y-3">
                <Heart className="w-12 h-12 text-[#C5A059] mx-auto opacity-70" />
                <h4 className="font-serif text-lg font-bold text-[#0B132B]">Your Wishlist is Empty</h4>
                <p className="text-xs text-stone-500">Tap the heart icon on any hotel card to bookmark properties for your next holiday.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#EBE3D5] shadow-sm hover:shadow-xl transition-all"
                  >
                    <img
                      src={
                        (item.hotel.images && item.hotel.images[0]) ||
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={item.hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-xs text-stone-400">{item.hotel.city}, {item.hotel.state}</span>
                        <h4 className="font-serif text-lg font-bold text-[#0B132B]">{item.hotel.name}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                        <div>
                          <span className="text-[10px] text-stone-400">From</span>
                          <span className="font-bold text-sm text-[#0B132B] block">
                            {formatCurrency(item.hotel.startingPrice)}
                          </span>
                        </div>
                        <Link
                          to={`/hotels/${item.hotel.id}`}
                          className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs transition-all shadow"
                        >
                          Book Stay
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0B132B]">Personal Credentials</h3>
              <p className="text-xs text-stone-500">Update your verified personal details and security password.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address (Immutable)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-medium text-stone-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs transition-all shadow"
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* New Service Request Modal */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title="Request In-Room Hotel Service"
      >
        <form onSubmit={handleRequestService} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Select Active Reservation *
            </label>
            <select
              required
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            >
              <option value="">-- Choose Reservation --</option>
              {activeBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.hotel?.name} (Ref: {b.bookingReference}) • {b.selectedRoomNumbers || 'Room 101'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Service Category *
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            >
              <option value="ROOM_CLEANING">🧹 Daily Room Cleaning / Turn-down</option>
              <option value="FOOD_BEVERAGE">🍽️ Food & Beverage In-Room Dining</option>
              <option value="EXTRA_TOWELS">🛁 Extra Towels & Luxury Toiletries</option>
              <option value="LAUNDRY">👔 Express Laundry & Dry Cleaning</option>
              <option value="MAINTENANCE">🔧 Room Maintenance / AC Adjustment</option>
              <option value="AIRPORT_PICKUP">🚗 Airport Chauffeur Pickup / Drop</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Special Instructions / Dietary / Timing Details
            </label>
            <textarea
              rows={3}
              value={serviceDetails}
              onChange={(e) => setServiceDetails(e.target.value)}
              placeholder="e.g. Please deliver 2 bottles of sparkling water and organic towels around 4:00 PM."
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setServiceModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={serviceSubmitting}
              className="px-6 py-2 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs transition-all shadow"
            >
              {serviceSubmitting ? 'Transmitting...' : 'Dispatch to Front Desk'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Booking Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Reservation Cancellation"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Are you sure you wish to cancel this reservation?</span>
            </div>
            <p>
              Booking Reference: <strong>{bookingToCancel?.bookingReference}</strong> at <strong>{bookingToCancel?.hotel?.name}</strong>.
            </p>
            <p>
              Your room reservation will be released and any simulated payment will be marked as REFUNDED.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
            >
              Keep My Reservation
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
