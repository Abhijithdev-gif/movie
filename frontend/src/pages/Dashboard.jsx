import React, { useState, useEffect } from 'react';
import { Film, Clock, CheckCircle2, Star, ArrowRight } from 'lucide-react';
import { getStats } from '../services/api';
import StarRating from '../components/StarRating';

const Dashboard = ({ onNavigateWatchlist }) => {
  const [stats, setStats] = useState({
    total: 0,
    to_watch: 0,
    watched: 0,
    avg_rating: 0,
    recently_watched: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="spinner" style={{ width: '36px', height: '36px', borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-banner">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">Overview of your movie and TV show watching stats</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Film size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.total}</div>
            <div className="stat-label">Total Watchlist</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon to-watch">
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.to_watch}</div>
            <div className="stat-label">To Watch</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon watched">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.watched}</div>
            <div className="stat-label">Watched</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rating">
            <Star size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.avg_rating} ⭐</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Recently Watched</h3>
        <button
          className="btn-secondary"
          onClick={() => onNavigateWatchlist('watched')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <span>View All Watched</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {stats.recently_watched.length > 0 ? (
        <div className="cards-grid">
          {stats.recently_watched.map((item) => (
            <div key={item.id} className="movie-card">
              <div className="poster-wrapper" style={{ height: '160px' }}>
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="poster-img" />
                ) : (
                  <div className="poster-placeholder">
                    <Film size={36} />
                  </div>
                )}
                <div className="card-badges">
                  <span className={`badge ${item.type === 'TV Show' ? 'badge-tv' : 'badge-movie'}`}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="card-content" style={{ padding: '1rem' }}>
                <h4 className="card-title" style={{ fontSize: '1rem' }}>{item.title}</h4>
                <div style={{ marginTop: '0.5rem' }}>
                  <StarRating rating={item.rating} readOnly={true} size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
          <Star size={28} color="var(--text-dim)" />
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            No recently watched titles. Mark movies as watched to see them here!
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
