import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ search, onSearchChange, activeFilter, onFilterChange }) => {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search movies or TV shows..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            className="btn-close"
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => onSearchChange('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-group">
        <button
          className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All Types
        </button>
        <button
          className={`filter-chip ${activeFilter === 'movie' ? 'active' : ''}`}
          onClick={() => onFilterChange('movie')}
        >
          🎬 Movies
        </button>
        <button
          className={`filter-chip ${activeFilter === 'tv' ? 'active' : ''}`}
          onClick={() => onFilterChange('tv')}
        >
          📺 TV Shows
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
