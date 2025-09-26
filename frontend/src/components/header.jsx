import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-logo">
        </div>
        <div className="navbar-dropdown">
          <select
            className="nav-select"
            onChange={(e) => {
              const path = e.target.value;
              if (path) {
                window.location.href = path;
              }
            }}
          >
            <option value="">Select Page</option>
            <option value="/clothes">Clothes</option>
            <option value="/matches">Matches</option>
            <option value="/today-outfits">Today’s Outfits</option>
            <option value="/">Homepage</option>
          </select>
        </div>
      </nav>
    </header>
  );
};

export default Header;
