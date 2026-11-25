import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomCategory } from '../../types/index';
import { formatCurrency } from '../../utils/formatters';
import { Users, Bed, Maximize, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoomCardProps {
  room: RoomCategory;
  hotelId: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  hotelId,
  checkIn,
  checkOut,
  guests = 2,
}) => {
  const navigate = useNavigate();

  const handleSelectRoom = () => {
    const query = new URLSearchParams({
      hotelId,
      categoryId: room.id,
      checkIn: checkIn || '',
      checkOut: checkOut || '',
      guests: String(guests),
    });
    navigate(`/book?${query.toString()}`);
  };

  const image = room.images && room.images.length > 0
    ? room.images[0]
    : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  const isAvailable = room.availableRoomCount === undefined || room.availableRoomCount > 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#EBE3D5] hover:border-[#C5A059]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group">
      
      {/* Room Image */}
      <div className="relative md:w-72 h-56 md:h-auto shrink-0 overflow-hidden">
        <img
          src={image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {room.availableRoomCount !== undefined && (
          <div className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white border border-[#C5A059]/40">
            {room.availableRoomCount > 0 ? (
              <span className="text-emerald-400">● {room.availableRoomCount} Rooms Available</span>
            ) : (
              <span className="text-rose-400">Sold Out for Selected Dates</span>
            )}
          </div>
        )}
      </div>

      {/* Room Information */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h4 className="font-serif text-xl font-bold text-[#0B132B] group-hover:text-[#C5A059] transition-colors">
              {room.name}
            </h4>
            <div className="text-right">
              <span className="font-serif text-2xl font-bold text-[#0B132B]">
                {formatCurrency(room.basePrice)}
              </span>
              <span className="text-xs text-stone-500"> / night</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {room.description}
          </p>

          {/* Specifications Pills */}
          <div className="flex flex-wrap gap-4 text-xs text-stone-600 py-3 border-y border-stone-100">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-4 h-4 text-[#C5A059]" />
              <span>{room.bedType}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Maximize className="w-4 h-4 text-[#C5A059]" />
              <span>{room.sizeSqFt} sq.ft</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-[#C5A059]" />
              <span>Up to {room.capacityAdults} Adults, {room.capacityChildren} Child</span>
            </div>
          </div>

          {/* Room Amenities */}
          <div className="flex flex-wrap gap-2 mt-4">
            {room.amenities && room.amenities.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[11px] font-medium text-stone-600 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#EBE3D5]"
              >
                <Check className="w-3 h-3 text-emerald-600 mr-1" />
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
            <span>Free cancellation up to 48 hours before check-in</span>
          </div>

          <button
            onClick={handleSelectRoom}
            disabled={!isAvailable}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
              isAvailable
                ? 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B38F24] hover:to-[#C5A059] text-[#0B132B] hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Reserve This Room' : 'Sold Out'}</span>
            {isAvailable && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
};
