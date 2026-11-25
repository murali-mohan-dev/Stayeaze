import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Shield, Award, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B132B] text-stone-300 border-t border-[#C5A059]/30 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1C2541]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] flex items-center justify-center border border-[#C5A059]">
                <Crown className="w-5 h-5 text-[#C5A059]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Stay<span className="text-[#C5A059]">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed pr-6">
              StayEase is India’s premier luxury hotel reservation platform, crafting exceptional hospitality experiences from tranquil coastal retreats in Goa to royal palaces in Rajasthan.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900 border border-[#C5A059]/30 text-xs text-[#C5A059]">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Properties</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900 border border-[#C5A059]/30 text-xs text-[#C5A059]">
                <Award className="w-3.5 h-3.5" />
                <span>Best Rate Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-base tracking-wide">Quick Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hotels" className="hover:text-[#C5A059] transition-colors">All Luxury Hotels</Link>
              </li>
              <li>
                <Link to="/hotels?city=Goa" className="hover:text-[#C5A059] transition-colors">Beachfront Resorts in Goa</Link>
              </li>
              <li>
                <Link to="/hotels?city=Jaipur" className="hover:text-[#C5A059] transition-colors">Palace Hotels in Jaipur</Link>
              </li>
              <li>
                <Link to="/hotels?city=Bengaluru" className="hover:text-[#C5A059] transition-colors">Garden Luxury in Bengaluru</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#C5A059] transition-colors">Exclusive Offers & Perks</Link>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-base tracking-wide">Guest Care</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-[#C5A059] transition-colors">My Reservations</Link>
              </li>
              <li>
                <Link to="/dashboard?tab=services" className="hover:text-[#C5A059] transition-colors">In-Room Services</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C5A059] transition-colors">Our Story & Standards</Link>
              </li>
              <li>
                <span className="text-stone-500 cursor-not-allowed">24/7 Royal Concierge</span>
              </li>
              <li>
                <span className="text-stone-500 cursor-not-allowed">Flexible Cancellation Policy</span>
              </li>
            </ul>
          </div>

          {/* Contact Concierge */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-base tracking-wide">Contact Us</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>StayEase Towers, MG Road, Bengaluru, Karnataka 560001</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>+91 800 234 5678 (Toll Free)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>concierge@stayease.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} StayEase Luxury Hotel Reservation System. Built for Software Design Project.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
            <span className="text-[#C5A059] flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Crafted with Elegance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
