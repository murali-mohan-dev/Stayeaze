import React from 'react';
import { Crown, Award, ShieldCheck, HeartHandshake, Compass, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B132B] text-[#C5A059] flex items-center justify-center mx-auto shadow-xl border border-[#C5A059]">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0B132B]">
            About StayEase
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            A Smart Hotel Room Reservation System crafted for the college Software Design mini-project under the Tourism and Hospitality domain.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C5A059] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0B132B]">Our Vision</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              To engineer a commercial-grade, intuitive, and secure hotel booking ecosystem that rivals industry benchmarks like Booking.com, Airbnb, and MakeMyTrip — highlighting cutting-edge software architecture, atomic double-booking prevention, and elegant UI design.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C5A059] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0B132B]">Architectural Standards</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Built on a solid relational foundation using Prisma ORM with SQLite, JWT role-based security, modular Express REST endpoints, and a high-performance React + Tailwind CSS client designed with luxury aesthetics.
            </p>
          </div>
        </div>

        {/* Domain Pillars */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EBE3D5] shadow-lg space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B132B]">
              Key Software Engineering Highlights
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Demonstrating full-stack principles across authentication, database concurrency, and interactive UX.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-[#FAF7F2]">
              <ShieldCheck className="w-6 h-6 text-[#C5A059] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#0B132B]">Concurrency Protection</h4>
              <p className="text-xs text-stone-500 mt-1">
                Zero double-booking guarantee via transactional date-overlap queries.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2]">
              <Users className="w-6 h-6 text-[#C5A059] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#0B132B]">Role-Based Access</h4>
              <p className="text-xs text-stone-500 mt-1">
                Strict separation between Customer and Administrator dashboard privileges.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2]">
              <HeartHandshake className="w-6 h-6 text-[#C5A059] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#0B132B]">Simulated Payments</h4>
              <p className="text-xs text-stone-500 mt-1">
                Educational simulated payment gateway generating verified invoice references.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
