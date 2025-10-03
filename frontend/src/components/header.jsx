import React from 'react';
import { Link } from 'react-router-dom';
import wearableLogo from '../assets/images/wearable_logo.png';
import './header.css'

const Header = ({ loggedIn }) => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={wearableLogo} alt="Wearable Logo" className="navbar-logo" />
        </div>

        <div className="navbar-right">
          {loggedIn ? (
            <>
            <Link to="/user" className="nav-link">User Page</Link>
              <select
                className="nav-select"
                onChange={(e) => {
                  const path = e.target.value;
                  if (path) window.location.href = path;
                }}
              >
                <option value="">Select Page</option>
                <option value="/clothes">Clothes</option>
                <option value="/matches">Matches</option>
                <option value="/today-outfits">Today’s Outfits</option>
                <option value="/">Homepage</option>
              </select>

              
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <span className="separator">|</span>
              <Link to="/register" className="nav-link">Register</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
