import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Destination } from '../../types/index';
import { formatCurrency } from '../../utils/formatters';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const PopularDestinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback high-res destinations if loading
  const fallbackDestinations: Destination[] = [
    {
      city: 'Goa',
      hotelCount: 3,
      startingPrice: 8500,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Bengaluru',
      hotelCount: 4,
      startingPrice: 7200,
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Mumbai',
      hotelCount: 4,
      startingPrice: 11000,
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Jaipur',
      hotelCount: 3,
      startingPrice: 9500,
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Udaipur',
      hotelCount: 2,
      startingPrice: 12000,
      image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Delhi',
      hotelCount: 3,
      startingPrice: 6800,
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    },
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/hotels/destinations');
        if (res.data.success && res.data.destinations.length > 0) {
          setDestinations(res.data.destinations);
        } else {
          setDestinations(fallbackDestinations);
        }
      } catch {
        setDestinations(fallbackDestinations);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const displayList = destinations.length > 0 ? destinations : fallbackDestinations;

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">
              <MapPin className="w-4 h-4" />
              <span>Explore India</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B]">
              Popular Luxury Destinations
            </h2>
            <p className="mt-2 text-stone-600 max-w-xl text-sm sm:text-base">
              Immerse yourself in royal heritage, coastal horizons, and vibrant cultural metropolises.
            </p>
          </div>

          <Link
            to="/hotels"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-[#0B132B] hover:text-[#C5A059] transition-colors group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayList.slice(0, 6).map((dest, index) => (
            <motion.div
              key={dest.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/hotels?city=${encodeURIComponent(dest.city)}`}
                className="group relative block h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Background image */}
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="self-end">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {dest.hotelCount} {dest.hotelCount === 1 ? 'Hotel' : 'Hotels'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#C5A059] transition-colors">
                      {dest.city}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Starting from <span className="text-white font-bold text-sm">{formatCurrency(dest.startingPrice)}</span> / night
                    </p>
                    <div className="mt-3 flex items-center text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
                      <span>Explore properties</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
