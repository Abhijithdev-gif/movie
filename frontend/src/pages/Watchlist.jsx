import React, { useState, useEffect, useCallback } from 'react';
import WatchlistTabs from '../components/WatchlistTabs';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import EditMovieModal from '../components/EditMovieModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getMedia, patchMedia, updateRating, updateMedia, deleteMedia } from '../services/api';

const Watchlist = ({
  activeTab,
  setActiveTab,
  activeFilter,
  setActiveFilter,
  onOpenAddModal,
  overrideTypeFilter = null
}) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const effectiveType = overrideTypeFilter || activeFilter;
      const data = await getMedia({
        status: activeTab === 'all' ? null : activeTab,
        type: effectiveType === 'all' ? null : effectiveType,
        search: search.trim() || null
      });
      setItems(data);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Something went wrong loading your watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeFilter, overrideTypeFilter, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle rating click
  const handleRate = async (id, newRating) => {
    try {
      // Optimistic update
      setItems(prev => prev.map(item => item.id === id ? { ...item, rating: newRating } : item));
      await updateRating(id, newRating);
    } catch (err) {
      console.error('Failed to update rating:', err);
      fetchItems(); // revert on failure
    }
  };

  // Toggle status between Unwatched & Watched
  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'Watched' ? 'Unwatched' : 'Watched';
    try {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
      await patchMedia(item.id, { status: nextStatus });
      fetchItems();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      fetchItems();
    }
  };

  // Save edits
  const handleSaveEdit = async (id, updatedData) => {
    await updateMedia(id, updatedData);
    fetchItems();
  };

  // Delete item
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setActionLoading(true);
      await deleteMedia(deletingItem.id);
      setDeletingItem(null);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate counts for tabs from current fetched list or overall
  const unwatchedCount = items.filter(i => i.status === 'Unwatched').length;
  const watchedCount = items.filter(i => i.status === 'Watched').length;

  return (
    <div>
      <div className="page-banner">
        <h2 className="page-title">Movie & TV Show Watchlist</h2>
        <p className="page-subtitle">Keep track of movies and shows you want to watch and rate the ones you have seen.</p>
      </div>

      <WatchlistTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{ unwatched: unwatchedCount, watched: watchedCount, total: items.length }}
      />

      {!overrideTypeFilter && (
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      )}

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', borderTopColor: 'var(--primary)' }} />
        </div>
      ) : items.length > 0 ? (
        <div className="cards-grid">
          {items.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              onToggleStatus={handleToggleStatus}
              onRate={handleRate}
              onEdit={(itemToEdit) => setEditingItem(itemToEdit)}
              onDelete={(itemToDelete) => setDeletingItem(itemToDelete)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          tab={search ? 'search' : activeTab}
          onAddClick={onOpenAddModal}
        />
      )}

      {/* Edit Modal */}
      <EditMovieModal
        isOpen={Boolean(editingItem)}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        title="Delete Watchlist Item"
        message={deletingItem ? `Are you sure you want to delete "${deletingItem.title}"?` : ''}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </div>
  );
};

export default Watchlist;
