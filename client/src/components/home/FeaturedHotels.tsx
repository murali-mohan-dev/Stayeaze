import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Hotel } from '../../types/index';
import { formatCurrency } from '../../utils/formatters';
import { StarRating } from '../common/StarRating';
import { HotelCardSkeleton } from '../common/LoadingSkeleton';
import { Sparkles, MapPin, ArrowRight, ShieldCheck, Wifi, Coffee, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturedHotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/hotels?featured=true&limit=4');
        if (res.data.success) {
          setHotels(res.data.hotels);
        }
      } catch (err) {
        console.error('Failed to load featured hotels', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Sanctuaries</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B]">
              Featured Luxury Stays
            </h2>
            <p className="mt-2 text-stone-600 max-w-xl text-sm sm:text-base">
              Each sanctuary is personally vetted to uphold our impeccable benchmarks of luxury, hospitality, and privacy.
            </p>
          </div>

          <Link
            to="/hotels"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-[#0B132B] hover:text-[#C5A059] transition-colors group"
          >
            <span>Browse All {hotels.length > 0 ? 'Hotels' : ''}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel, index) => {
              const mainImage = hotel.images && hotel.images.length > 0
                ? hotel.images[0]
                : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

              return (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EBE3D5] shadow-sm hover:shadow-xl hover:border-[#C5A059]/40 transition-all duration-300 flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={mainImage}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B132B]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#C5A059] border border-[#C5A059]/30">
                      ★ Featured
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-extrabold text-[#0B132B] shadow">
                      {hotel.ratingScore.toFixed(1)} / 5.0
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-xs text-stone-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#C5A059] shrink-0" />
                        <span className="truncate">{hotel.city}, {hotel.state}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#0B132B] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                        {hotel.name}
                      </h3>

                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <StarRating rating={hotel.starRating} size="sm" />
                        <span className="text-[11px] text-stone-400">({hotel.reviewCount} reviews)</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-4 mt-4 border-t border-stone-200/70 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-stone-500 block">From</span>
                        <span className="font-bold text-lg text-[#0B132B]">
                          {formatCurrency(hotel.startingPrice)}
                        </span>
                        <span className="text-[10px] text-stone-400"> / night</span>
                      </div>

                      <Link
                        to={`/hotels/${hotel.id}`}
                        className="px-4 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold hover:bg-[#C5A059] hover:text-[#0B132B] transition-all shadow-sm"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
