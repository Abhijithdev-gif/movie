import React, { useState } from 'react';
import { Film, Tv, CheckCircle, Clock, Edit2, Trash2 } from 'lucide-react';
import StarRating from './StarRating';

const MovieCard = ({ item, onToggleStatus, onRate, onEdit, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  const isWatched = item.status === 'Watched';

  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        {item.poster && !imgError ? (
          <img
            src={item.poster}
            alt={item.title}
            className="poster-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="poster-placeholder">
            {item.type === 'TV Show' ? <Tv size={42} /> : <Film size={42} />}
            <span>No Image Poster</span>
          </div>
        )}

        <div className="card-badges">
          <span className={`badge ${item.type === 'TV Show' ? 'badge-tv' : 'badge-movie'}`}>
            {item.type === 'TV Show' ? '📺 TV Show' : '🎬 Movie'}
          </span>
          <span className={`badge badge-status ${isWatched ? 'watched' : 'unwatched'}`}>
            {isWatched ? '✓ Watched' : '⏱ To Watch'}
          </span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-description">
          {item.description || 'No description provided.'}
        </p>

        {isWatched && (
          <div className="rating-section">
            <StarRating
              rating={item.rating}
              onRate={(newRating) => onRate(item.id, newRating)}
              readOnly={false}
            />
          </div>
        )}

        <div className="card-actions">
          <button
            className="btn-card-action btn-toggle-status"
            onClick={() => onToggleStatus(item)}
            title={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
          >
            {isWatched ? (
              <>
                <Clock size={15} /> Move to To Watch
              </>
            ) : (
              <>
                <CheckCircle size={15} /> Mark as Watched
              </>
            )}
          </button>

          <button
            className="btn-icon-only"
            onClick={() => onEdit(item)}
            title="Edit Item"
          >
            <Edit2 size={16} />
          </button>

          <button
            className="btn-icon-only danger"
            onClick={() => onDelete(item)}
            title="Delete Item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
