import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
  showRatingText?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  size = 20, 
  interactive = false,
  showRatingText = false,
  className = '' 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleStarLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starRating) => {
          const isFilled = starRating <= displayRating;
          
          return (
            <button
              key={starRating}
              type="button"
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
              onMouseLeave={handleStarLeave}
              className={`${
                interactive 
                  ? 'cursor-pointer hover:scale-110 transition-transform' 
                  : 'cursor-default'
              }`}
              disabled={!interactive}
            >
              <Star
                size={size}
                className={`${
                  isFilled 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-600'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>
      
      {showRatingText && (
        <span className="text-sm text-gray-400 ml-2">
          {displayRating > 0 ? `${displayRating}/5` : 'Non noté'}
        </span>
      )}
    </div>
  );
}