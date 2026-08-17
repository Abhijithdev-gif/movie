import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddMovieModal from './components/AddMovieModal';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import { getCurrentUser, logoutUser, createMedia } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // App navigation state
  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('unwatched');
  const [activeFilter, setActiveFilter] = useState('all');

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getCurrentUser();
        if (data.isAuthenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const handleAddMedia = async (newMediaData) => {
    await createMedia(newMediaData);
    // Switch to appropriate tab if item was added
    if (newMediaData.status === 'Watched') {
      setActiveTab('watched');
    } else {
      setActiveTab('unwatched');
    }
  };

  if (authChecking) {
    return (
      <div className="auth-wrapper">
        <div className="spinner" style={{ width: '42px', height: '42px', borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  // Header Title lookup
  const getHeaderTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard';
      case 'movies':
        return 'Movies Watchlist';
      case 'tvshows':
        return 'TV Shows Watchlist';
      default:
        return 'My Watchlist';
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="main-wrapper">
        <Header
          title={getHeaderTitle()}
          onAddClick={() => setIsAddModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="content-body">
          {activePage === 'dashboard' && (
            <Dashboard
              onNavigateWatchlist={(tab) => {
                setActivePage('watchlist');
                setActiveTab(tab);
              }}
            />
          )}

          {activePage === 'watchlist' && (
            <Watchlist
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activePage === 'movies' && (
            <Watchlist
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeFilter="movie"
              setActiveFilter={setActiveFilter}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              overrideTypeFilter="movie"
            />
          )}

          {activePage === 'tvshows' && (
            <Watchlist
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeFilter="tv"
              setActiveFilter={setActiveFilter}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              overrideTypeFilter="tv"
            />
          )}
        </main>
      </div>

      <AddMovieModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedia}
      />
    </div>
  );
}

export default App;
