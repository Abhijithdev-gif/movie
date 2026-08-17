import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRate = null, readOnly = false, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentDisplay = hoverRating || rating;

  const handleClick = (value) => {
    if (!readOnly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= currentDisplay;
        return (
          <button
            key={starValue}
            type="button"
            className={`star-btn ${!readOnly ? 'interactive' : ''} ${isFilled ? 'filled' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
            aria-label={`Rate ${starValue} stars out of 5`}
          >
            <Star
              size={size}
              fill={isFilled ? '#fbbf24' : 'transparent'}
              stroke={isFilled ? '#fbbf24' : '#4b5563'}
            />
          </button>
        );
      })}
      {rating > 0 && <span className="rating-label">{rating} / 5</span>}
    </div>
  );
};

export default StarRating;
