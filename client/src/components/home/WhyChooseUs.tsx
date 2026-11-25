import React from 'react';
import { ShieldCheck, Award, Clock, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Award,
      title: 'Vetted Luxury Standards',
      desc: 'Each hotel and resort undergoes a rigorous multi-point inspection to ensure unparalleled luxury, plush bedding, and immaculate upkeep.',
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed Availability',
      desc: 'Our real-time transactional synchronization prevents double-booking, ensuring your reserved sanctuary is waiting upon arrival.',
    },
    {
      icon: Clock,
      title: '24/7 Dedicated Concierge',
      desc: 'From custom airport transfers to late-night culinary requests, our concierge and in-room services cater to your every itinerary need.',
    },
    {
      icon: HeartHandshake,
      title: 'Flexible & Transparent',
      desc: 'No hidden resort fees, instant transparent GST calculations, and smooth simulated payment choices tailored for modern travelers.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">
            The StayEase Difference
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B]">
            Why Discerning Travelers Choose Us
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Crafting seamless, elegant, and secure hospitality reservations with modern convenience and timeless prestige.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#EBE3D5] hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0B132B] flex items-center justify-center text-[#C5A059] shadow-md group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-[#0B132B] transition-all mb-6">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0B132B] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
