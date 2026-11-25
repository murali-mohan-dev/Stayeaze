import React from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { Sparkles, Award, ShieldCheck, Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Warm Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury StayEase Hotel Sanctuary"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/85 via-[#0B132B]/60 to-[#0B132B]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Subtle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C5A059]/50 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Luxury Stays Across India</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl"
        >
          Find Your <span className="gold-gradient-text">Perfect Stay</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-5 text-lg sm:text-xl text-stone-200 max-w-2xl font-light leading-relaxed"
        >
          Discover amazing hotels and unforgettable experiences. From tranquil coastal retreats to royal palaces, reserve your sanctuary with effortless ease.
        </motion.p>

        {/* Hero Search Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full mt-10"
        >
          <SearchBar variant="hero" />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-stone-300 text-xs sm:text-sm font-medium"
        >
          <div className="flex items-center justify-center space-x-2">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>5-Star Rated Hospitality</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Zero Double-Booking Guarantee</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>Instant Room Confirmation</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Exclusive VIP Perks</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
