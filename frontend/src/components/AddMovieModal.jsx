import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import StarRating from './StarRating';

const AddMovieModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Movie');
  const [status, setStatus] = useState('Unwatched');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onAdd({
        title: title.trim(),
        type,
        status,
        rating: status === 'Watched' ? rating : 0,
        description: description.trim(),
        poster: poster.trim(),
      });

      // Reset form
      setTitle('');
      setType('Movie');
      setStatus('Unwatched');
      setRating(0);
      setDescription('');
      setPoster('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.title?.[0] || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Movie or TV Show</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Interstellar, Breaking Bad"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Unwatched">To Watch</option>
                <option value="Watched">Watched</option>
              </select>
            </div>
          </div>

          {status === 'Watched' && (
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <StarRating rating={rating} onRate={(val) => setRating(val)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Poster Image URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/poster.jpg"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Synopsis (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Brief overview or your personal notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <Plus size={18} /> Add Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
