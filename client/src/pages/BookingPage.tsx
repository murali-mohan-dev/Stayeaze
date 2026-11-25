import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Hotel, RoomCategory } from '../types/index';
import { BookingStepper } from '../components/booking/BookingStepper';
import { GuestForm } from '../components/booking/GuestForm';
import { PriceSummary } from '../components/booking/PriceSummary';
import { PaymentModal } from '../components/booking/PaymentModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { calculateNights, formatCurrency } from '../utils/formatters';
import { ArrowLeft, ArrowRight, Sparkles, Check, Car, UtensilsCrossed, Flower2 } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const hotelId = searchParams.get('hotelId') || '';
  const categoryId = searchParams.get('categoryId') || '';

  // Dates state
  const defaultCheckIn = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const defaultCheckOut = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [checkInDate, setCheckInDate] = useState(searchParams.get('checkIn') || defaultCheckIn());
  const [checkOutDate, setCheckOutDate] = useState(searchParams.get('checkOut') || defaultCheckOut());
  const [numRooms, setNumRooms] = useState(1);
  const [numGuests, setNumGuests] = useState(Number(searchParams.get('guests')) || 2);

  // Stepper state
  const steps = ['Room & Dates', 'Guest Info', 'Add-ons & Promo', 'Payment'];
  const [currentStep, setCurrentStep] = useState(1);

  // Data state
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [category, setCategory] = useState<RoomCategory | null>(null);
  const [loading, setLoading] = useState(true);

  // Guest Info state
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState('');

  // Extra Services state
  const availableServices = [
    {
      id: 'airport_pickup',
      name: 'Chauffeur Airport Transfer',
      desc: 'Seamless luxury sedan pickup directly from arrivals terminal',
      price: 2200,
      icon: Car,
    },
    {
      id: 'gourmet_breakfast',
      name: 'Royal Champagne Breakfast Buffet',
      desc: 'Daily multi-cuisine artisan breakfast with sparkling wine',
      price: 1500,
      icon: UtensilsCrossed,
    },
    {
      id: 'spa_pass',
      name: 'Ayurvedic Wellness Spa Session',
      desc: '60-minute signature rejuvenating herbal therapy for 2 guests',
      price: 3800,
      icon: Flower2,
    },
  ];
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  // Financials state
  const [calculation, setCalculation] = useState({
    nights: 2,
    roomPrice: 0,
    roomSubtotal: 0,
    extraServicesPrice: 0,
    taxes: 0,
    discountAmount: 0,
    totalAmount: 0,
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Fetch Hotel & Category details
  useEffect(() => {
    const fetchData = async () => {
      if (!hotelId) {
        navigate('/hotels');
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/hotels/${hotelId}`);
        if (res.data.success) {
          setHotel(res.data.hotel);
          const matchedCategory = res.data.hotel.roomCategories?.find((c: any) => c.id === categoryId);
          if (matchedCategory) {
            setCategory(matchedCategory);
          } else if (res.data.hotel.roomCategories && res.data.hotel.roomCategories.length > 0) {
            setCategory(res.data.hotel.roomCategories[0]);
          }
        }
      } catch (err) {
        showToast('Error loading booking configuration.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hotelId, categoryId]);

  // Recalculate price server-side whenever dates, category, rooms, services, or coupon changes
  useEffect(() => {
    const fetchCalculation = async () => {
      if (!category) return;
      try {
        const res = await api.post('/bookings/calculate', {
          categoryId: category.id,
          checkInDate,
          checkOutDate,
          numRooms,
          couponCode: appliedCouponCode || undefined,
          extraServices: selectedServices,
        });

        if (res.data.success) {
          setCalculation(res.data.calculation);
        }
      } catch (err: any) {
        console.error('Calculation error', err);
      }
    };

    fetchCalculation();
  }, [category, checkInDate, checkOutDate, numRooms, selectedServices, appliedCouponCode]);

  const handleToggleService = (service: any) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    if (!code) return;
    setCouponValidating(true);
    try {
      const res = await api.post('/coupons/validate', {
        code,
        bookingAmount: calculation.roomSubtotal + calculation.extraServicesPrice,
      });

      if (res.data.success) {
        setAppliedCouponCode(res.data.coupon.code);
        showToast(res.data.message, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid or expired coupon.', 'error');
    } finally {
      setCouponValidating(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        showToast('Check-out date must be strictly after check-in date.', 'error');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!guestName || !guestEmail || !guestPhone) {
        showToast('Please fill out all required guest contact fields.', 'error');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleConfirmReservation = async (paymentMethod: string) => {
    if (!isAuthenticated) {
      showToast('Please sign in to confirm and record your reservation.', 'info');
      navigate('/login', { state: { from: { pathname: window.location.pathname + window.location.search } } });
      return;
    }

    if (!hotel || !category) return;
    setSubmittingBooking(true);

    try {
      const res = await api.post('/bookings', {
        hotelId: hotel.id,
        categoryId: category.id,
        checkInDate,
        checkOutDate,
        numRooms,
        numGuests,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        extraServices: selectedServices,
        couponCode: appliedCouponCode || undefined,
        paymentMethod,
      });

      if (res.data.success) {
        showToast('Reservation confirmed! Generated booking pass.', 'success');
        navigate(`/booking-confirmation/${res.data.booking.id}`);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Reservation failed. Please check room availability.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading || !hotel || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-lg text-[#0B132B]">Preparing your reservation session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Stepper */}
        <BookingStepper currentStep={currentStep} steps={steps} />

        {/* 2-Column Booking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Room & Dates */}
            {currentStep === 1 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#0B132B]">
                    Confirm Accommodation & Dates
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Select your itinerary dates and room requirements.
                  </p>
                </div>

                {/* Selected Room Card Preview */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D5] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block">
                      Selected Sanctuary
                    </span>
                    <h4 className="font-serif text-xl font-bold text-[#0B132B]">{category.name}</h4>
                    <p className="text-xs text-stone-500">{category.bedType} • {category.sizeSqFt} sq.ft</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#0B132B]">
                      {formatCurrency(category.basePrice)}
                    </span>
                    <span className="text-xs text-stone-400"> / night</span>
                  </div>
                </div>

                {/* Date Selection Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Number of Rooms
                    </label>
                    <select
                      value={numRooms}
                      onChange={(e) => setNumRooms(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B]"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Room' : 'Rooms'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Total Guests
                    </label>
                    <select
                      value={numGuests}
                      onChange={(e) => setNumGuests(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-semibold text-[#0B132B]"
                    >
                      {[1, 2, 3, 4, 6, 8].map((g) => (
                        <option key={g} value={g}>
                          {g} {g === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3.5 rounded-2xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Guest Information</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Guest Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <GuestForm
                  guestName={guestName}
                  guestEmail={guestEmail}
                  guestPhone={guestPhone}
                  specialRequests={specialRequests}
                  onChange={(field, val) => {
                    if (field === 'guestName') setGuestName(val);
                    if (field === 'guestEmail') setGuestEmail(val);
                    if (field === 'guestPhone') setGuestPhone(val);
                    if (field === 'specialRequests') setSpecialRequests(val);
                  }}
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3.5 rounded-2xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Add-ons & Vouchers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Add-ons & Experiences */}
            {currentStep === 3 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#0B132B]">
                    Enhance Your Stay
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Select tailored luxury services curated by the hotel front concierge.
                  </p>
                </div>

                <div className="space-y-3">
                  {availableServices.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selectedServices.some((s) => s.id === service.id);

                    return (
                      <div
                        key={service.id}
                        onClick={() => handleToggleService(service)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FAF7F2] border-[#C5A059] shadow-sm ring-1 ring-[#C5A059]'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#0B132B] text-[#C5A059]' : 'bg-stone-100 text-stone-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-[#0B132B]">{service.name}</h5>
                            <p className="text-xs text-stone-500">{service.desc}</p>
                          </div>
                        </div>

                        <div className="text-right flex items-center space-x-3">
                          <span className="font-serif font-bold text-sm text-[#0B132B]">
                            +{formatCurrency(service.price)}
                          </span>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                            isSelected ? 'bg-[#C5A059] border-[#C5A059] text-[#0B132B]' : 'border-stone-300'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3.5 rounded-2xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Simulated Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <PaymentModal
                  totalAmount={calculation.totalAmount}
                  onConfirmPayment={handleConfirmReservation}
                  loading={submittingBooking}
                />

                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={submittingBooking}
                  className="px-5 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Add-ons</span>
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Live Price Summary */}
          <div className="lg:col-span-1">
            <PriceSummary
              hotel={hotel}
              category={category}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              nights={calculation.nights}
              numRooms={numRooms}
              roomSubtotal={calculation.roomSubtotal}
              extraServicesPrice={calculation.extraServicesPrice}
              taxes={calculation.taxes}
              discountAmount={calculation.discountAmount}
              couponCode={appliedCouponCode}
              totalAmount={calculation.totalAmount}
              onApplyCoupon={handleApplyCoupon}
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              couponValidating={couponValidating}
            />
          </div>

        </div>

      </div>
    </div>
  );
};
