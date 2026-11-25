import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { Hotel, RoomCategory, Review } from '../types/index';
import { HotelGallery } from '../components/hotel/HotelGallery';
import { RoomCard } from '../components/hotel/RoomCard';
import { ReviewSection } from '../components/hotel/ReviewSection';
import { DetailSkeleton } from '../components/common/LoadingSkeleton';
import { StarRating } from '../components/common/StarRating';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Heart,
  Share2,
  ShieldCheck,
  Check,
  Building,
  Sparkles,
} from 'lucide-react';

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests')) || 2;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/hotels/${id}`);
        if (res.data.success) {
          setHotel(res.data.hotel);
        }
      } catch (err) {
        console.error('Failed to load hotel', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save this property.', 'info');
      return;
    }
    if (!hotel) return;

    try {
      const res = await api.post('/wishlist/toggle', { hotelId: hotel.id });
      if (res.data.success) {
        setIsWishlisted(res.data.isWishlisted);
        showToast(res.data.message, 'success');
      }
    } catch {
      showToast('Could not update favorites.', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Hotel link copied to clipboard!', 'info');
  };

  const handleReviewAdded = (newReview: Review, updatedScore: number) => {
    if (!hotel) return;
    setHotel({
      ...hotel,
      ratingScore: updatedScore,
      reviewCount: hotel.reviewCount + 1,
      reviews: [newReview, ...(hotel.reviews || [])],
    });
  };

  if (loading) return <DetailSkeleton />;
  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-[#0B132B]">Hotel Not Found</h2>
          <Link to="/hotels" className="text-sm font-bold text-[#C5A059] mt-2 inline-block">
            ← Return to Hotel Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs & Header */}
        <div>
          <div className="flex items-center text-xs text-stone-400 space-x-2 mb-3">
            <Link to="/" className="hover:text-stone-700">Home</Link>
            <span>/</span>
            <Link to="/hotels" className="hover:text-stone-700">Hotels</Link>
            <span>/</span>
            <span className="text-stone-700 font-semibold">{hotel.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <StarRating rating={hotel.starRating} size="sm" />
                <span className="text-xs font-bold text-[#8C7A5B] uppercase tracking-wider">
                  {hotel.starRating}-Star Luxury Property
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B132B]">
                {hotel.name}
              </h1>
              {hotel.tagline && (
                <p className="font-serif italic text-base text-[#8C7A5B] mt-1">
                  "{hotel.tagline}"
                </p>
              )}
              <div className="flex items-center text-xs sm:text-sm text-stone-500 mt-2">
                <MapPin className="w-4 h-4 text-[#C5A059] mr-1.5 shrink-0" />
                <span>{hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}</span>
              </div>
            </div>

            {/* Actions: Wishlist & Share */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleWishlist}
                className="px-4 py-2.5 rounded-2xl bg-white border border-[#EBE3D5] text-xs font-bold text-stone-700 hover:text-red-500 shadow-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Save to Wishlist'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-2xl bg-white border border-[#EBE3D5] text-stone-700 hover:text-[#0B132B] shadow-sm transition-all hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <HotelGallery images={hotel.images} hotelName={hotel.name} />

        {/* Hotel Details Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Description & Amenities */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0B132B]">About The Property</h3>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                {hotel.description}
              </p>

              {/* Check-in / Check-out timings */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-100">
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#FAF7F2]">
                  <Clock className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Check-In</span>
                    <span className="text-xs font-bold text-[#0B132B]">From {hotel.checkInTime}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#FAF7F2]">
                  <Clock className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Check-Out</span>
                    <span className="text-xs font-bold text-[#0B132B]">Until {hotel.checkOutTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities & Amenities */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0B132B]">Property Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities && hotel.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 p-3 rounded-xl bg-[#FAF7F2] text-xs font-semibold text-stone-700 border border-stone-200/60"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Quick Reserve Pill */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EBE3D5] shadow-lg space-y-5">
              <div>
                <span className="text-xs text-stone-400 font-medium">Starting from</span>
                <div className="flex items-baseline space-x-1">
                  <span className="font-serif text-3xl font-extrabold text-[#0B132B]">
                    {formatCurrency(hotel.startingPrice)}
                  </span>
                  <span className="text-xs text-stone-500">/ night</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] space-y-2.5 text-xs text-stone-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-medium">{hotel.contactPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-medium truncate">{hotel.contactEmail}</span>
                </div>
              </div>

              <a
                href="#rooms"
                className="w-full py-3.5 rounded-2xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Select Room Category Below</span>
              </a>

              <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Official Price Guarantee & Verified Availability</span>
              </div>
            </div>
          </div>

        </div>

        {/* Available Room Categories Section */}
        <section id="rooms" className="space-y-6 pt-6">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#0B132B]">
              Available Room Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select your preferred accommodation to proceed with real-time price calculation and instant reservation.
            </p>
          </div>

          <div className="space-y-6">
            {hotel.roomCategories && hotel.roomCategories.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                hotelId={hotel.id}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
              />
            ))}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="pt-6">
          <ReviewSection
            hotelId={hotel.id}
            reviews={hotel.reviews || []}
            ratingScore={hotel.ratingScore}
            reviewCount={hotel.reviewCount}
            onReviewAdded={handleReviewAdded}
          />
        </section>

      </div>
    </div>
  );
};
