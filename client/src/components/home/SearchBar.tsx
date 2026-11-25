import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  initialCity?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialRooms?: number;
  onSearch?: (params: { city: string; checkIn: string; checkOut: string; guests: number; rooms: number }) => void;
  variant?: 'hero' | 'compact';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialCity = '',
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2,
  initialRooms = 1,
  onSearch,
  variant = 'hero',
}) => {
  const navigate = useNavigate();

  // Tomorrow & 3 days from now default
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 3);

    return {
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: dayAfter.toISOString().split('T')[0],
    };
  };

  const defaults = getDefaultDates();

  const [city, setCity] = useState(initialCity);
  const [checkIn, setCheckIn] = useState(initialCheckIn || defaults.checkIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut || defaults.checkOut);
  const [guests, setGuests] = useState(initialGuests);
  const [rooms, setRooms] = useState(initialRooms);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ city, checkIn, checkOut, guests, rooms });
    } else {
      const query = new URLSearchParams({
        city,
        checkIn,
        checkOut,
        guests: String(guests),
        rooms: String(rooms),
      });
      navigate(`/hotels?${query.toString()}`);
    }
  };

  const popularCities = ['Goa', 'Bengaluru', 'Mumbai', 'Jaipur', 'Udaipur', 'Delhi', 'Chennai'];

  return (
    <div className={`w-full ${variant === 'hero' ? 'max-w-5xl mx-auto' : ''}`}>
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-[#EBE3D5] flex flex-col lg:flex-row items-stretch gap-3 relative z-30"
      >
        {/* Destination input */}
        <div className="flex-1 min-w-[200px] p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-stone-200/60 focus-within:border-[#C5A059] transition-all">
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8C7A5B] mb-1">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#C5A059]" />
            Destination
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Where to? (e.g. Goa, Jaipur)"
            className="w-full bg-transparent font-semibold text-[#0B132B] placeholder-stone-400 focus:outline-none text-sm"
          />
        </div>

        {/* Check-In */}
        <div className="flex-1 min-w-[150px] p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-stone-200/60 focus-within:border-[#C5A059] transition-all">
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8C7A5B] mb-1">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#C5A059]" />
            Check-In
          </div>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-transparent font-semibold text-[#0B132B] focus:outline-none text-sm cursor-pointer"
          />
        </div>

        {/* Check-Out */}
        <div className="flex-1 min-w-[150px] p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-stone-200/60 focus-within:border-[#C5A059] transition-all">
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8C7A5B] mb-1">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#C5A059]" />
            Check-Out
          </div>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className="w-full bg-transparent font-semibold text-[#0B132B] focus:outline-none text-sm cursor-pointer"
          />
        </div>

        {/* Guests & Rooms selector */}
        <div className="flex-1 min-w-[170px] relative">
          <button
            type="button"
            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            className="w-full h-full text-left p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-stone-200/60 focus:border-[#C5A059] transition-all flex items-center justify-between"
          >
            <div>
              <div className="flex items-center text-xs font-bold uppercase tracking-wider text-[#8C7A5B] mb-1">
                <Users className="w-3.5 h-3.5 mr-1.5 text-[#C5A059]" />
                Guests & Rooms
              </div>
              <div className="text-sm font-semibold text-[#0B132B] truncate">
                {guests} Guests, {rooms} Room{rooms > 1 ? 's' : ''}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-stone-400" />
          </button>

          {/* Guest Selector Dropdown */}
          {showGuestDropdown && (
            <div 
              className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setShowGuestDropdown(false)}
            >
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <div>
                  <p className="text-sm font-bold text-[#0B132B]">Guests</p>
                  <p className="text-xs text-stone-500">Ages 12 or above</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-[#0B132B]">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                    className="w-8 h-8 rounded-full border border-[#C5A059] text-[#C5A059] flex items-center justify-center font-bold hover:bg-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold text-[#0B132B]">Rooms</p>
                  <p className="text-xs text-stone-500">Maximum 5 rooms</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-[#0B132B]">{rooms}</span>
                  <button
                    type="button"
                    onClick={() => setRooms(Math.min(5, rooms + 1))}
                    className="w-8 h-8 rounded-full border border-[#C5A059] text-[#C5A059] flex items-center justify-center font-bold hover:bg-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuestDropdown(false)}
                className="w-full mt-3 py-2 bg-[#0B132B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1C2541]"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="lg:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B38F24] hover:to-[#C5A059] text-[#0B132B] font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5 text-[#0B132B]" />
          <span>Search Hotels</span>
        </button>
      </form>

      {/* Quick City Chips */}
      {variant === 'hero' && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-stone-300 font-medium">Trending Destinations:</span>
          {popularCities.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all font-medium"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
