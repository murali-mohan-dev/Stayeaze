import React from 'react';

export const HotelCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm animate-pulse">
      <div className="h-60 bg-stone-200" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-100 rounded w-1/2" />
          </div>
          <div className="w-12 h-6 bg-stone-200 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-stone-100 rounded-full w-16" />
          <div className="h-6 bg-stone-100 rounded-full w-20" />
          <div className="h-6 bg-stone-100 rounded-full w-14" />
        </div>
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-stone-100 rounded w-16" />
            <div className="h-6 bg-stone-200 rounded w-24" />
          </div>
          <div className="h-10 bg-stone-200 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="h-8 bg-stone-200 rounded w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[420px]">
        <div className="md:col-span-2 bg-stone-200 rounded-2xl h-full" />
        <div className="grid grid-rows-2 gap-4 h-full">
          <div className="bg-stone-200 rounded-2xl" />
          <div className="bg-stone-200 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-stone-200 rounded w-1/4" />
          <div className="h-24 bg-stone-100 rounded" />
          <div className="h-40 bg-stone-100 rounded-2xl" />
        </div>
        <div className="h-80 bg-stone-200 rounded-2xl" />
      </div>
    </div>
  );
};
