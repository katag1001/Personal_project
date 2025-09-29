import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';

const Homepage = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <div className="App">
        {loggedIn ? (
          <>
            <p>Welcome!</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <p>You are not logged in.</p>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Homepage;
