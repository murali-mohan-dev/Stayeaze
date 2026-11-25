import React from 'react';
import { Star, Filter, RotateCcw } from 'lucide-react';

interface HotelFiltersProps {
  minPrice: number;
  maxPrice: number;
  selectedStar: number | null;
  selectedAmenities: string[];
  sortBy: string;
  onPriceChange: (min: number, max: number) => void;
  onStarChange: (star: number | null) => void;
  onAmenityToggle: (amenity: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const HotelFilters: React.FC<HotelFiltersProps> = ({
  minPrice,
  maxPrice,
  selectedStar,
  selectedAmenities,
  sortBy,
  onPriceChange,
  onStarChange,
  onAmenityToggle,
  onSortChange,
  onReset,
}) => {
  const commonAmenities = [
    'Private Beach',
    'Infinity Pool',
    'Spa',
    'Fine Dining',
    'Free Wi-Fi',
    'Valet Parking',
    'Butler Service',
    'Fitness Center',
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-6">
      
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center space-x-2 font-serif font-bold text-lg text-[#0B132B]">
          <Filter className="w-4 h-4 text-[#C5A059]" />
          <span>Filter Hotels</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-stone-500 hover:text-[#C5A059] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
        >
          <option value="rating">Highest Guest Rating</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>

      {/* Price Range Slider / Inputs */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
          Max Price / Night: ₹{maxPrice.toLocaleString('en-IN')}
        </label>
        <input
          type="range"
          min="3000"
          max="35000"
          step="1000"
          value={maxPrice}
          onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
          className="w-full accent-[#C5A059] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
          <span>₹3,000</span>
          <span>₹35,000+</span>
        </div>
      </div>

      {/* Star Rating Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
          Star Rating
        </label>
        <div className="space-y-2">
          {[5, 4, 3].map((star) => (
            <label
              key={star}
              className="flex items-center space-x-2.5 text-xs text-stone-700 hover:text-[#0B132B] cursor-pointer"
            >
              <input
                type="radio"
                name="starFilter"
                checked={selectedStar === star}
                onChange={() => onStarChange(selectedStar === star ? null : star)}
                className="accent-[#C5A059]"
              />
              <div className="flex items-center space-x-1">
                {Array.from({ length: star }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                ))}
                <span className="font-medium text-stone-600 ml-1">{star} Stars</span>
              </div>
            </label>
          ))}
          <label className="flex items-center space-x-2.5 text-xs text-stone-700 cursor-pointer pt-1">
            <input
              type="radio"
              name="starFilter"
              checked={selectedStar === null}
              onChange={() => onStarChange(null)}
              className="accent-[#C5A059]"
            />
            <span className="font-medium text-stone-600">All Ratings</span>
          </label>
        </div>
      </div>

      {/* Facilities & Amenities */}
      <div className="pt-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
          Facilities & Amenities
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {commonAmenities.map((amenity) => {
            const checked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center space-x-2.5 text-xs text-stone-700 hover:text-[#0B132B] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onAmenityToggle(amenity)}
                  className="rounded border-stone-300 accent-[#C5A059] focus:ring-[#C5A059]"
                />
                <span className={checked ? 'font-semibold text-[#0B132B]' : ''}>
                  {amenity}
                </span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
};
