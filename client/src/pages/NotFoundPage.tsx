import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#0B132B] text-[#C5A059] flex items-center justify-center mx-auto shadow-xl">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-6xl font-extrabold text-[#0B132B]">404</h1>
        <h2 className="font-serif text-2xl font-bold text-[#0B132B]">Sanctuary Not Found</h2>
        <p className="text-xs text-stone-500">
          The luxury destination or page you are seeking seems to have wandered beyond our map.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs transition-all shadow-md"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
