import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

export const HotelGallery: React.FC<HotelGalleryProps> = ({ images, hotelName }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const fallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  const displayImages = images && images.length > 0 ? images : [fallback];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Viewer */}
      <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-[#EBE3D5] group">
        <img
          src={displayImages[activeIdx]}
          alt={`${hotelName} showcase ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Tag */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white">
          {activeIdx + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative w-24 h-20 rounded-2xl overflow-hidden shrink-0 transition-all border-2 ${
                activeIdx === i
                  ? 'border-[#C5A059] scale-105 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
