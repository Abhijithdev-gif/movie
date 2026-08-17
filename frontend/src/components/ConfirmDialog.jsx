import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onClose, onConfirm, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.75rem', borderRadius: '50%' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>{title || 'Confirm Action'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <Trash2 size={16} /> Delete Item
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
