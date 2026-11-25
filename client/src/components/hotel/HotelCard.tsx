import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel } from '../../types/index';
import { formatCurrency } from '../../utils/formatters';
import { StarRating } from '../common/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { MapPin, Heart, Wifi, Coffee, Utensils, Sparkles, ArrowRight } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  isWishlisted?: boolean;
  onWishlistToggle?: (hotelId: string, newState: boolean) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isWishlisted = false,
  onWishlistToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [favorited, setFavorited] = useState(isWishlisted);
  const [toggling, setToggling] = useState(false);

  const mainImage = hotel.images && hotel.images.length > 0
    ? hotel.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please sign in to save hotels to your wishlist.', 'info');
      return;
    }

    if (toggling) return;
    setToggling(true);

    try {
      const res = await api.post('/wishlist/toggle', { hotelId: hotel.id });
      if (res.data.success) {
        setFavorited(res.data.isWishlisted);
        showToast(res.data.message, 'success');
        if (onWishlistToggle) {
          onWishlistToggle(hotel.id, res.data.isWishlisted);
        }
      }
    } catch {
      showToast('Could not update favorites. Try again.', 'error');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#EBE3D5] hover:border-[#C5A059]/60 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row group">
      
      {/* Image Gallery Preview */}
      <div className="relative md:w-80 h-64 md:h-auto shrink-0 overflow-hidden">
        <img
          src={mainImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {hotel.featured && (
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0B132B]/85 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40 shadow">
              ★ Featured Sanctuary
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Add to wishlist"
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-stone-700 hover:text-red-500 hover:bg-white shadow transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : 'text-stone-700'
            }`}
          />
        </button>

        {/* Rating Score Pill over image */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#0B132B] text-[#C5A059] font-bold text-xs flex items-center justify-center">
            {hotel.ratingScore.toFixed(1)}
          </div>
          <div className="text-[11px] font-bold text-[#0B132B]">
            {hotel.ratingScore >= 4.8 ? 'Superb' : 'Exceptional'}
            <span className="block text-[10px] text-stone-400 font-normal">
              {hotel.reviewCount} verified reviews
            </span>
          </div>
        </div>
      </div>

      {/* Hotel Details Column */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location and Stars */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center text-xs font-semibold text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] mr-1 shrink-0" />
              <span>{hotel.city}, {hotel.state}</span>
              <span className="mx-2 text-stone-300">•</span>
              <span className="truncate max-w-[200px] text-stone-400">{hotel.address}</span>
            </div>
            <StarRating rating={hotel.starRating} size="sm" />
          </div>

          {/* Hotel Name */}
          <Link to={`/hotels/${hotel.id}`}>
            <h3 className="font-serif text-2xl font-bold text-[#0B132B] group-hover:text-[#C5A059] transition-colors leading-snug">
              {hotel.name}
            </h3>
          </Link>

          {hotel.tagline && (
            <p className="text-xs font-serif italic text-[#8C7A5B] mt-0.5">
              "{hotel.tagline}"
            </p>
          )}

          <p className="text-xs sm:text-sm text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {hotel.amenities && hotel.amenities.slice(0, 5).map((amenity, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#EBE3D5] text-[11px] font-medium text-stone-700"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities && hotel.amenities.length > 5 && (
              <span className="px-2 py-1 rounded-lg bg-stone-100 text-[11px] font-medium text-stone-500">
                +{hotel.amenities.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Bottom Bar */}
        <div className="pt-6 mt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-400">Starting from</div>
            <div className="flex items-baseline space-x-1">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0B132B]">
                {formatCurrency(hotel.startingPrice)}
              </span>
              <span className="text-xs text-stone-500">/ night</span>
            </div>
            <div className="text-[10px] text-stone-400">Excludes taxes & fees</div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/hotels/${hotel.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0B132B] text-white font-bold text-xs hover:bg-[#C5A059] hover:text-[#0B132B] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 group/btn"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
