import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Hotel,
  RoomCategory,
  Booking,
  ServiceRequest,
  Review,
  Coupon,
  DashboardStats,
  DashboardCharts,
} from '../types/index';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { StatCard } from '../components/admin/StatCard';
import { HotelModal } from '../components/admin/HotelModal';
import { RoomCategoryModal } from '../components/admin/RoomCategoryModal';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Users,
  Building2,
  BedDouble,
  CalendarCheck,
  CreditCard,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  ConciergeBell,
  MessageSquare,
  ShieldAlert,
  Tag,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);

  // Entities state
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [bookingFilterStatus, setBookingFilterStatus] = useState('ALL');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals state
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null);

  // Coupon Modal state
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponType, setNewCouponType] = useState('PERCENTAGE');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(5000);
  const [newCouponMax, setNewCouponMax] = useState<number | undefined>(2500);

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      showToast('Administrator privileges required to access the admin portal.', 'error');
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, hotelsRes, bookingsRes, servicesRes, customersRes, paymentsRes, reviewsRes, couponsRes] =
        await Promise.all([
          api.get('/admin/stats'),
          api.get('/hotels'),
          api.get('/admin/bookings'),
          api.get('/admin/services'),
          api.get('/admin/customers'),
          api.get('/admin/payments'),
          api.get('/admin/reviews'),
          api.get('/admin/coupons'),
        ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setCharts(statsRes.data.charts);
      }
      if (hotelsRes.data.success) {
        setHotels(hotelsRes.data.hotels);
        const allCats: RoomCategory[] = [];
        hotelsRes.data.hotels.forEach((h: Hotel) => {
          if (h.roomCategories) {
            h.roomCategories.forEach((rc) => allCats.push({ ...rc, hotelId: h.id }));
          }
        });
        setCategories(allCats);
      }
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (servicesRes.data.success) setServices(servicesRes.data.serviceRequests);
      if (customersRes.data.success) setCustomers(customersRes.data.customers);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.payments);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews);
      if (couponsRes.data.success) setCoupons(couponsRes.data.coupons);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Actions
  const handleDeleteHotel = async (hotelId: string) => {
    if (!window.confirm('Are you sure you want to delete this hotel and all its room categories?')) return;
    try {
      const res = await api.delete(`/admin/hotels/${hotelId}`);
      if (res.data.success) {
        showToast('Hotel deleted successfully.', 'success');
        loadData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete hotel.', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this room category?')) return;
    try {
      const res = await api.delete(`/admin/room-categories/${categoryId}`);
      if (res.data.success) {
        showToast('Room category deleted.', 'success');
        loadData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete category.', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, { status });
      if (res.data.success) {
        showToast(`Booking marked as ${status}.`, 'success');
        setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: status as any } : b)));
      }
    } catch (err: any) {
      showToast('Failed to update booking status.', 'error');
    }
  };

  const handleUpdateServiceStatus = async (serviceId: string, status: string) => {
    try {
      const res = await api.patch(`/services/${serviceId}/status`, { status });
      if (res.data.success) {
        showToast(`Service status updated to ${status}.`, 'success');
        setServices(services.map((s) => (s.id === serviceId ? { ...s, status: status as any } : s)));
      }
    } catch (err: any) {
      showToast('Failed to update service status.', 'error');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      const res = await api.delete(`/admin/reviews/${reviewId}`);
      if (res.data.success) {
        showToast('Review removed.', 'success');
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch (err: any) {
      showToast('Failed to delete review.', 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/coupons', {
        code: newCouponCode,
        description: newCouponDesc,
        discountType: newCouponType,
        discountValue: Number(newCouponValue),
        minBookingAmount: Number(newCouponMin),
        maxDiscount: newCouponMax ? Number(newCouponMax) : null,
      });

      if (res.data.success) {
        showToast('New promotional coupon created!', 'success');
        setCoupons([res.data.coupon, ...coupons]);
        setCouponModalOpen(false);
        setNewCouponCode('');
        setNewCouponDesc('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create coupon.', 'error');
    }
  };

  const handleToggleCoupon = async (couponId: string) => {
    try {
      const res = await api.patch(`/admin/coupons/${couponId}/toggle`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setCoupons(coupons.map((c) => (c.id === couponId ? res.data.coupon : c)));
      }
    } catch (err: any) {
      showToast('Failed to toggle coupon status.', 'error');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!window.confirm('Delete this promotional coupon?')) return;
    try {
      const res = await api.delete(`/admin/coupons/${couponId}`);
      if (res.data.success) {
        showToast('Coupon deleted.', 'success');
        setCoupons(coupons.filter((c) => c.id !== couponId));
      }
    } catch (err: any) {
      showToast('Failed to delete coupon.', 'error');
    }
  };

  // Pie chart colors
  const STATUS_COLORS: Record<string, string> = {
    CONFIRMED: '#10B981',
    'CHECKED IN': '#0284C7',
    'CHECKED OUT': '#64748B',
    CANCELLED: '#EF4444',
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingFilterStatus === 'ALL' || b.status === bookingFilterStatus;
    const q = bookingSearch.toLowerCase();
    const matchesSearch =
      !q ||
      b.bookingReference.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestEmail.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#0B132B]">
                  Executive Operations Overview
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Real-time occupancy metrics, revenue performance, and enterprise KPIs.
                </p>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(stats?.totalRevenue || 0)}
                  subtitle="Gross simulated settlement"
                  icon={DollarSign}
                  trend="+18.4% this month"
                />
                <StatCard
                  title="Total Reservations"
                  value={stats?.totalReservations || 0}
                  subtitle="Confirmed customer stays"
                  icon={CalendarCheck}
                  trend="+12% growth"
                />
                <StatCard
                  title="Available Inventory"
                  value={`${stats?.availableRooms || 0} Rooms`}
                  subtitle={`Out of ${stats?.totalRooms || 0} total rooms`}
                  icon={BedDouble}
                />
                <StatCard
                  title="Registered Guests"
                  value={stats?.totalCustomers || 0}
                  subtitle="Verified user accounts"
                  icon={Users}
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Monthly Revenue Chart */}
                <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0B132B]">Monthly Revenue (INR)</h4>
                      <p className="text-xs text-stone-400">Total room sales across verified bookings</p>
                    </div>
                    <span className="text-xs font-bold text-[#C5A059]">₹ Recharts Analytics</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={charts?.monthlyData || []}>
                        <defs>
                          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" textAnchor="end" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                        <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                        <Area type="monotone" dataKey="revenue" stroke="#C5A059" fillOpacity={1} fill="url(#goldGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Bookings Chart */}
                <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0B132B]">Booking Volume Trends</h4>
                      <p className="text-xs text-stone-400">Number of reservations created per month</p>
                    </div>
                    <span className="text-xs font-bold text-[#0B132B]">Volume Pulse</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts?.monthlyData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#0B132B" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Hotel Occupancy Rates */}
                <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-4">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#0B132B]">Room Occupancy by Property (%)</h4>
                    <p className="text-xs text-stone-400">Percentage of currently booked rooms per hotel</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts?.roomOccupancyChart || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                        <YAxis type="category" dataKey="hotelName" tick={{ fontSize: 10 }} width={110} />
                        <Tooltip formatter={(val: any) => `${val}% Occupied`} />
                        <Bar dataKey="occupancyRate" fill="#C5A059" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Booking Status Distribution */}
                <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-4">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#0B132B]">Reservation Status Distribution</h4>
                    <p className="text-xs text-stone-400">Proportion of Confirmed, In-Stay, and Cancelled</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={charts?.bookingStatusChart || []}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {(charts?.bookingStatusChart || []).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[entry.name] || '#94A3B8'}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: HOTEL MANAGEMENT */}
          {activeTab === 'hotels' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Hotel Properties Directory</h2>
                  <p className="text-xs text-stone-500">Manage hotel profiles, locations, ratings, and luxury descriptions.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingHotel(null);
                    setHotelModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register New Hotel</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4">Property</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Stars & Score</th>
                        <th className="p-4">Base Rate</th>
                        <th className="p-4">Featured</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {hotels.map((h) => (
                        <tr key={h.id} className="hover:bg-stone-50">
                          <td className="p-4 flex items-center space-x-3">
                            <img
                              src={(h.images && h.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80'}
                              alt={h.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                            />
                            <div>
                              <span className="font-serif font-bold text-sm text-[#0B132B] block">{h.name}</span>
                              <span className="text-stone-400 text-[11px] truncate max-w-xs block">{h.contactEmail}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-stone-700">{h.city}, {h.state}</td>
                          <td className="p-4">
                            <span className="font-bold text-[#C5A059]">{h.starRating}★</span> ({h.ratingScore.toFixed(1)} / 5.0)
                          </td>
                          <td className="p-4 font-serif font-bold text-stone-800">{formatCurrency(h.startingPrice)}</td>
                          <td className="p-4">
                            {h.featured ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#0B132B]">
                                Featured
                              </span>
                            ) : (
                              <span className="text-stone-400">Standard</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingHotel(h);
                                setHotelModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                              title="Edit Hotel"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHotel(h.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                              title="Delete Hotel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOM CATEGORIES */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Room Category Inventory</h2>
                  <p className="text-xs text-stone-500">Add, edit pricing, and configure room quotas across all hotels.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setRoomModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room Category</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4">Category Name</th>
                        <th className="p-4">Associated Hotel</th>
                        <th className="p-4">Nightly Price</th>
                        <th className="p-4">Capacity</th>
                        <th className="p-4">Total Inventory</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {categories.map((c) => {
                        const parentHotel = hotels.find((h) => h.id === c.hotelId);
                        return (
                          <tr key={c.id} className="hover:bg-stone-50">
                            <td className="p-4">
                              <span className="font-serif font-bold text-sm text-[#0B132B] block">{c.name}</span>
                              <span className="text-stone-400 text-[10px]">{c.bedType} • {c.sizeSqFt} sq.ft</span>
                            </td>
                            <td className="p-4 font-semibold text-stone-700">{parentHotel?.name || 'Hotel'}</td>
                            <td className="p-4 font-serif font-bold text-[#0B132B]">{formatCurrency(c.basePrice)}</td>
                            <td className="p-4 text-stone-600">{c.capacityAdults} Adults, {c.capacityChildren} Child</td>
                            <td className="p-4 font-mono font-bold text-[#C5A059]">{c.totalRooms} Rooms</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingCategory(c);
                                  setRoomModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALL RESERVATIONS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Master Booking Ledger</h2>
                  <p className="text-xs text-stone-500">Track and manage every customer reservation across India.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      placeholder="Search ref or guest..."
                      className="pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#0B132B]"
                    />
                  </div>

                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="p-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-[#0B132B]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CHECKED_IN">CHECKED_IN</option>
                    <option value="CHECKED_OUT">CHECKED_OUT</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4">Reference</th>
                        <th className="p-4">Guest</th>
                        <th className="p-4">Property & Room</th>
                        <th className="p-4">Dates</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-stone-50">
                          <td className="p-4 font-mono font-bold text-[#C5A059]">{b.bookingReference}</td>
                          <td className="p-4">
                            <span className="font-bold text-stone-800 block">{b.guestName}</span>
                            <span className="text-stone-400 text-[10px]">{b.guestPhone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#0B132B] block">{b.hotel?.name}</span>
                            <span className="text-stone-500 text-[11px]">{b.category?.name} ({b.selectedRoomNumbers || 'Room 101'})</span>
                          </td>
                          <td className="p-4 text-stone-600">
                            {formatDate(b.checkInDate)} - {formatDate(b.checkOutDate)} ({b.nights}n)
                          </td>
                          <td className="p-4 font-serif font-bold text-sm text-[#0B132B]">{formatCurrency(b.totalAmount)}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                b.status === 'CONFIRMED'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : b.status === 'CHECKED_IN'
                                  ? 'bg-sky-50 text-sky-700'
                                  : b.status === 'CANCELLED'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                              className="p-1.5 rounded-lg bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-700"
                            >
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="CHECKED_IN">CHECKED_IN</option>
                              <option value="CHECKED_OUT">CHECKED_OUT</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICE REQUESTS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Hotel Service Requests</h2>
                <p className="text-xs text-stone-500">Manage room cleaning, laundry, dining, and concierge requests in real-time.</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4">Hotel & Room</th>
                        <th className="p-4">Service Type</th>
                        <th className="p-4">Guest Details</th>
                        <th className="p-4">Request Notes</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Update Workflow</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {services.map((s) => (
                        <tr key={s.id} className="hover:bg-stone-50">
                          <td className="p-4">
                            <span className="font-bold text-[#0B132B] block">{s.hotel?.name}</span>
                            <span className="font-mono text-[#C5A059] font-bold text-xs">{s.roomNumber}</span>
                          </td>
                          <td className="p-4 font-semibold text-stone-800">
                            {s.serviceType.replace(/_/g, ' ')}
                          </td>
                          <td className="p-4">
                            <span className="font-bold block">{s.booking?.guestName || s.user?.name}</span>
                            <span className="text-stone-400 text-[10px]">{s.booking?.guestPhone}</span>
                          </td>
                          <td className="p-4 text-stone-600 max-w-xs truncate">{s.details || 'No special instructions'}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                s.status === 'COMPLETED'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : s.status === 'IN_PROGRESS'
                                  ? 'bg-amber-50 text-amber-700'
                                  : s.status === 'ACCEPTED'
                                  ? 'bg-sky-50 text-sky-700'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={s.status}
                              onChange={(e) => handleUpdateServiceStatus(s.id, e.target.value)}
                              className="p-1.5 rounded-lg bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-700"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="ACCEPTED">ACCEPTED</option>
                              <option value="IN_PROGRESS">IN_PROGRESS</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROMOTIONAL COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Promotional Voucher Codes</h2>
                  <p className="text-xs text-stone-500">Configure discounts, percentage reductions, and spending thresholds.</p>
                </div>
                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Voucher</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4">Coupon Code</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Discount Value</th>
                        <th className="p-4">Min Spend</th>
                        <th className="p-4">Max Cap</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {coupons.map((c) => (
                        <tr key={c.id} className="hover:bg-stone-50">
                          <td className="p-4 font-mono font-bold text-sm text-[#0B132B]">{c.code}</td>
                          <td className="p-4 text-stone-600 max-w-xs">{c.description}</td>
                          <td className="p-4 font-bold text-[#C5A059]">
                            {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                          </td>
                          <td className="p-4">{formatCurrency(c.minBookingAmount)}</td>
                          <td className="p-4">{c.maxDiscount ? formatCurrency(c.maxDiscount) : 'No Cap'}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {c.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleCoupon(c.id)}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                              title="Toggle Active/Inactive"
                            >
                              {c.isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-stone-400" />}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(c.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                              title="Delete Voucher"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Registered Guest Directory</h2>
                <p className="text-xs text-stone-500">All registered customer accounts and reservation tallies.</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4">Guest Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Total Reservations</th>
                        <th className="p-4">Reviews Authored</th>
                        <th className="p-4">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-stone-50">
                          <td className="p-4 font-bold text-[#0B132B]">{c.name}</td>
                          <td className="p-4 text-stone-600">{c.email}</td>
                          <td className="p-4 text-stone-500">{c.phone || 'N/A'}</td>
                          <td className="p-4 font-bold text-[#C5A059]">{c._count?.bookings || 0} Stays</td>
                          <td className="p-4">{c._count?.reviews || 0} Reviews</td>
                          <td className="p-4 text-stone-400">{formatDate(c.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Payment Transaction Records</h2>
                <p className="text-xs text-stone-500">Live ledger of simulated credit card, UPI, and Pay-at-Hotel transactions.</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#EBE3D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Reservation Ref</th>
                        <th className="p-4">Guest</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-4 font-mono font-bold text-[#0B132B]">{p.transactionId}</td>
                          <td className="p-4 font-mono text-[#C5A059]">{p.booking?.bookingReference}</td>
                          <td className="p-4 font-medium text-stone-800">{p.booking?.guestName}</td>
                          <td className="p-4 font-bold">{p.method}</td>
                          <td className="p-4 font-serif font-bold text-sm text-[#0B132B]">{formatCurrency(p.amount)}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === 'SUCCESS'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : p.status === 'REFUNDED'
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-stone-400">{formatDate(p.paymentDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Customer Reviews Moderation</h2>
                <p className="text-xs text-stone-500">Monitor and moderate guest testimonials and star ratings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white p-5 rounded-2xl border border-[#EBE3D5] shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#0B132B]">{r.title}</h4>
                        <p className="text-xs text-stone-500">{r.hotel?.name} ({r.hotel?.city})</p>
                      </div>
                      <span className="font-bold text-xs text-[#C5A059]">{r.rating} ★</span>
                    </div>
                    <p className="text-xs text-stone-600 italic">"{r.comment}"</p>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                      <span>By {r.user?.name} on {formatDate(r.createdAt)}</span>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-rose-600 hover:text-rose-800 font-bold"
                      >
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Hotel Add/Edit Modal */}
      <HotelModal
        isOpen={hotelModalOpen}
        onClose={() => setHotelModalOpen(false)}
        hotel={editingHotel}
        onSaved={loadData}
      />

      {/* Room Category Add/Edit Modal */}
      <RoomCategoryModal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        category={editingCategory}
        hotels={hotels}
        onSaved={loadData}
      />

      {/* Coupon Modal */}
      <Modal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        title="Create Promotional Voucher"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Voucher Code *
            </label>
            <input
              type="text"
              required
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. MONSOON25"
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-mono font-bold text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={newCouponDesc}
              onChange={(e) => setNewCouponDesc(e.target.value)}
              placeholder="e.g. 25% discount for monsoon season bookings"
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Discount Type
              </label>
              <select
                value={newCouponType}
                onChange={(e) => setNewCouponType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="1"
                value={newCouponValue}
                onChange={(e) => setNewCouponValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Min. Booking Spend (₹)
              </label>
              <input
                type="number"
                min="0"
                value={newCouponMin}
                onChange={(e) => setNewCouponMin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                min="0"
                value={newCouponMax || ''}
                onChange={(e) => setNewCouponMax(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optional"
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCouponModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] text-xs font-bold transition-all shadow"
            >
              Create Voucher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
