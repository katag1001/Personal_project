import React from 'react';
import { Link } from 'react-router-dom';
import wearableLogo from '../assets/images/wearable_logo.png';

const Header = ({ loggedIn }) => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-logo">
        </div>

        {loggedIn ? (
          <>
            <div><img src={wearableLogo} alt="Wearable Logo" style={{width: "50px", height: "auto"}}/></div>
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
            <div className="user-link">
              <Link to="/user">User Page</Link>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
