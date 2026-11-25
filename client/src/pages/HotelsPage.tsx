import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { Hotel } from '../types/index';
import { HotelCard } from '../components/hotel/HotelCard';
import { HotelFilters } from '../components/hotel/HotelFilters';
import { SearchBar } from '../components/home/SearchBar';
import { HotelCardSkeleton } from '../components/common/LoadingSkeleton';
import { Compass, SlidersHorizontal, X } from 'lucide-react';

export const HotelsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const cityParam = searchParams.get('city') || '';
  const checkInParam = searchParams.get('checkIn') || '';
  const checkOutParam = searchParams.get('checkOut') || '';
  const guestsParam = Number(searchParams.get('guests')) || 2;
  const roomsParam = Number(searchParams.get('rooms')) || 1;

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [minPrice, setMinPrice] = useState(3000);
  const [maxPrice, setMaxPrice] = useState(35000);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params: any = {
        sortBy,
      };

      if (cityParam) params.city = cityParam;
      if (maxPrice < 35000) params.maxPrice = maxPrice;
      if (minPrice > 3000) params.minPrice = minPrice;
      if (selectedStar) params.starRating = selectedStar;
      if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');

      const res = await api.get('/hotels', { params });
      if (res.data.success) {
        setHotels(res.data.hotels);
      }
    } catch (err) {
      console.error('Failed to load hotels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [cityParam, maxPrice, minPrice, selectedStar, selectedAmenities, sortBy]);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setMinPrice(3000);
    setMaxPrice(35000);
    setSelectedStar(null);
    setSelectedAmenities([]);
    setSortBy('rating');
    searchParams.delete('city');
    setSearchParams(searchParams);
  };

  const handleSearchBarSearch = (params: {
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
  }) => {
    const nextParams = new URLSearchParams({
      city: params.city,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: String(params.guests),
      rooms: String(params.rooms),
    });
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Search Bar */}
        <div>
          <SearchBar
            variant="compact"
            initialCity={cityParam}
            initialCheckIn={checkInParam}
            initialCheckOut={checkOutParam}
            initialGuests={guestsParam}
            initialRooms={roomsParam}
            onSearch={handleSearchBarSearch}
          />
        </div>

        {/* Results Count & Mobile Filter Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B132B]">
              {cityParam ? `Hotels in ${cityParam}` : 'Explore All Luxury Stays'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Found <strong>{hotels.length}</strong> available sanctuaries matching your search
            </p>
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-[#0B132B] flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
            <span>Filters</span>
          </button>
        </div>

        {/* Layout: Sidebar + Hotel Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <HotelFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedStar={selectedStar}
              selectedAmenities={selectedAmenities}
              sortBy={sortBy}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              onStarChange={(star) => setSelectedStar(star)}
              onAmenityToggle={handleAmenityToggle}
              onSortChange={(sort) => setSortBy(sort)}
              onReset={handleResetFilters}
            />
          </div>

          {/* Hotel Listings Column */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE3D5] shadow-sm space-y-4">
                <Compass className="w-12 h-12 text-[#C5A059] mx-auto opacity-70" />
                <h3 className="font-serif text-2xl font-bold text-[#0B132B]">
                  No matching properties found
                </h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto">
                  We could not find any properties matching all your criteria. Try widening your price range, relaxing amenities, or exploring nearby cities.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#0B132B] text-white text-xs font-bold hover:bg-[#C5A059] hover:text-[#0B132B] transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white min-h-screen p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="font-serif font-bold text-lg text-[#0B132B]">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <HotelFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedStar={selectedStar}
              selectedAmenities={selectedAmenities}
              sortBy={sortBy}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              onStarChange={(star) => setSelectedStar(star)}
              onAmenityToggle={handleAmenityToggle}
              onSortChange={(sort) => setSortBy(sort)}
              onReset={handleResetFilters}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#0B132B] text-white font-bold text-xs rounded-xl"
            >
              Show {hotels.length} Properties
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
