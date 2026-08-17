import React from 'react';
import { Film, Star, Search, Plus } from 'lucide-react';

const EmptyState = ({ tab = 'unwatched', onAddClick }) => {
  if (tab === 'search') {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Search size={32} />
        </div>
        <h3 className="empty-title">No matching results found</h3>
        <p className="empty-text">Try adjusting your search terms or filter criteria.</p>
      </div>
    );
  }

  if (tab === 'watched') {
    return (
      <div className="empty-state">
        <div className="empty-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
          <Star size={32} />
        </div>
        <h3 className="empty-title">No watched movies yet</h3>
        <p className="empty-text">Start marking items as watched to rate them and build your collection!</p>
        <button className="btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Add Movie / Show</span>
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Film size={32} />
      </div>
      <h3 className="empty-title">Your watchlist is empty</h3>
      <p className="empty-text">Keep track of all the movies and TV shows you want to watch in one place.</p>
      <button className="btn-primary" onClick={onAddClick}>
        <Plus size={18} />
        <span>Add Movie / Show</span>
      </button>
    </div>
  );
};

export default EmptyState;
