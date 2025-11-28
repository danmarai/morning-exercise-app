import { useState } from 'react';

const DifficultyRating = ({ onRatingSubmit, title = "Rate Your Workout" }) => {
  const [rating, setRating] = useState(null);

  const handleManualRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating !== null && onRatingSubmit) {
      onRatingSubmit(rating);
    }
  };

  return (
    <div className="difficulty-rating">
      <h2>{title}</h2>
      <p className="rating-description">
        How difficult was this exercise for you?
      </p>

      <div className="manual-rating-mode">
        <div className="rating-buttons">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className={`rating-btn ${rating === value ? 'selected' : ''}`}
              onClick={() => handleManualRating(value)}
            >
              {value}
            </button>
          ))}
        </div>

        {rating !== null && (
          <button
            className="btn btn-primary btn-large"
            onClick={handleSubmit}
          >
            Submit Rating
          </button>
        )}
      </div>

      <div className="rating-scale">
        <span>1 = Too Easy</span>
        <span>5 = Too Hard</span>
      </div>
    </div>
  );
};

export default DifficultyRating;

