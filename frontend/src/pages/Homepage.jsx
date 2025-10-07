import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import './Pages.css';

const Homepage = ({ loggedIn, logout }) => {
  return (
    <>
      <div className="full-page">
      <Header loggedIn={loggedIn} />
      <div className="clothes-page-container">
        {loggedIn ? (
          <>
            <p>Welcome!</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <p>You are not logged in.</p>
            <Link to="/login">Login</Link><Link to="/register">Register</Link>
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default Homepage;
