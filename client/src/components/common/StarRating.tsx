import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  showScore = false,
  size = 'md',
  interactive = false,
  onRatingChange,
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            className={`transition-transform ${interactive ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-[#C5A059] text-[#C5A059]'
                  : 'fill-stone-200 text-stone-300'
              }`}
            />
          </button>
        );
      })}
      {showScore && (
        <span className="ml-1.5 text-xs font-bold text-[#0B132B]">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
