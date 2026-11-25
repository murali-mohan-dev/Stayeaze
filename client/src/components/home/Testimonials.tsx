import React from 'react';
import { StarRating } from '../common/StarRating';
import { Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Aditya Kashyap',
      role: 'Verified StayEase Guest',
      hotel: 'The Grand Palace Resort, Goa',
      rating: 5,
      comment: 'Booking through StayEase was completely seamless. The sea-facing suite exceeded our expectations, and the in-room service request feature allowed us to order late-night dining with a single tap!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Priya Nambiar',
      role: 'Luxury Travel Enthusiast',
      hotel: 'Lake Pichola Waterside Resort, Udaipur',
      rating: 5,
      comment: 'The private boat transfer and the sunset view over Lake Pichola were straight out of a royal fairytale. The pricing transparency and automated coupons saved us ₹5,000 instantly!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Vikramaditya Rathore',
      role: 'Corporate Executive',
      hotel: 'The Oberoi Sky Garden, Bengaluru',
      rating: 5,
      comment: 'StayEase is by far the most refined hotel booking portal in India. Impeccable interface, verified availability, and professional simulated invoices that made expense tracking a breeze.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Guest Chronicles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B]">
            Echoes of Extraordinary Journeys
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Read authentic stories and impressions shared by our distinguished community of travelers.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white p-8 rounded-3xl border border-[#EBE3D5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="w-10 h-10 text-[#C5A059]/20 absolute top-6 right-6" />

              <div>
                <div className="mb-4">
                  <StarRating rating={r.rating} size="sm" />
                </div>
                <p className="text-stone-700 text-sm leading-relaxed italic mb-6">
                  "{r.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-stone-100">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#C5A059]/50"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#0B132B]">{r.name}</h4>
                  <p className="text-[11px] text-stone-400">{r.hotel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
