import React from 'react';
import { Menu, Plus } from 'lucide-react';

const Header = ({ title, onAddClick, onToggleMobileMenu }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-toggle" onClick={onToggleMobileMenu} title="Toggle Navigation">
          <Menu size={24} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-actions">
        <button className="btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Add Movie / Show</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
