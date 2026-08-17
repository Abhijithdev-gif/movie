import React from 'react';
import { Film, LayoutDashboard, BookmarkCheck, Clock, CheckCircle2, Tv, LogOut, X } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, activeTab, setActiveTab, user, onLogout, isOpen, onClose }) => {
  const handleNavClick = (page, tab = null) => {
    setActivePage(page);
    if (tab) setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="brand">
        <div className="brand-icon">
          <Film size={22} color="#fff" />
        </div>
        <span>WatchList</span>
        {isOpen && (
          <button className="btn-close" style={{ marginLeft: 'auto' }} onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="nav-menu">
        <button
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <div className="nav-item-content">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
        </button>

        <div className="nav-section-title">My Watchlist</div>

        <button
          className={`nav-item ${activePage === 'watchlist' && activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleNavClick('watchlist', 'all')}
        >
          <div className="nav-item-content">
            <BookmarkCheck size={18} />
            <span>All Items</span>
          </div>
        </button>

        <button
          className={`nav-item ${activePage === 'watchlist' && activeTab === 'unwatched' ? 'active' : ''}`}
          onClick={() => handleNavClick('watchlist', 'unwatched')}
        >
          <div className="nav-item-content">
            <Clock size={18} />
            <span>To Watch</span>
          </div>
        </button>

        <button
          className={`nav-item ${activePage === 'watchlist' && activeTab === 'watched' ? 'active' : ''}`}
          onClick={() => handleNavClick('watchlist', 'watched')}
        >
          <div className="nav-item-content">
            <CheckCircle2 size={18} />
            <span>Watched</span>
          </div>
        </button>

        <div className="nav-section-title">Categories</div>

        <button
          className={`nav-item ${activePage === 'movies' ? 'active' : ''}`}
          onClick={() => handleNavClick('movies')}
        >
          <div className="nav-item-content">
            <Film size={18} />
            <span>Movies</span>
          </div>
        </button>

        <button
          className={`nav-item ${activePage === 'tvshows' ? 'active' : ''}`}
          onClick={() => handleNavClick('tvshows')}
        >
          <div className="nav-item-content">
            <Tv size={18} />
            <span>TV Shows</span>
          </div>
        </button>
      </nav>

      {user && (
        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="user-name">{user.username}</div>
              <div className="user-email">{user.email || 'Member'}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
