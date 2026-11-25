import React from 'react';
import { Hero } from '../components/home/Hero';
import { PopularDestinations } from '../components/home/PopularDestinations';
import { FeaturedHotels } from '../components/home/FeaturedHotels';
import { SpecialOffers } from '../components/home/SpecialOffers';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <PopularDestinations />
      <FeaturedHotels />
      <SpecialOffers />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
};
