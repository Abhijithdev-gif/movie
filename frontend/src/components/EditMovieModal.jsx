import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import StarRating from './StarRating';

const EditMovieModal = ({ isOpen, item, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Movie');
  const [status, setStatus] = useState('Unwatched');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setType(item.type || 'Movie');
      setStatus(item.status || 'Unwatched');
      setRating(item.rating || 0);
      setDescription(item.description || '');
      setPoster(item.poster || '');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onSave(item.id, {
        title: title.trim(),
        type,
        status,
        rating: status === 'Watched' ? rating : 0,
        description: description.trim(),
        poster: poster.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit {item.type}</h2>
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
              <label className="form-label">Rating</label>
              <StarRating rating={rating} onRate={(val) => setRating(val)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Poster Image URL</label>
            <input
              type="url"
              className="form-input"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
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
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieModal;
