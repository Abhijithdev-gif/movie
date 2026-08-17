import React from 'react';
import { Clock, CheckCircle2, Layers } from 'lucide-react';

const WatchlistTabs = ({ activeTab, onTabChange, counts = { unwatched: 0, watched: 0, total: 0 } }) => {
  return (
    <div className="watchlist-tabs">
      <button
        className={`tab-btn ${activeTab === 'unwatched' ? 'active' : ''}`}
        onClick={() => onTabChange('unwatched')}
      >
        <Clock size={18} />
        <span>To Watch</span>
        <span className="tab-count">{counts.unwatched}</span>
      </button>

      <button
        className={`tab-btn ${activeTab === 'watched' ? 'active' : ''}`}
        onClick={() => onTabChange('watched')}
      >
        <CheckCircle2 size={18} />
        <span>Watched</span>
        <span className="tab-count">{counts.watched}</span>
      </button>

      <button
        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        onClick={() => onTabChange('all')}
      >
        <Layers size={18} />
        <span>All Items</span>
        <span className="tab-count">{counts.total}</span>
      </button>
    </div>
  );
};

export default WatchlistTabs;
