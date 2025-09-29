// src/pages/User.jsx
import React from 'react';
import Header from '../components/header';

const User = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <div>
        <h2>You are logged in</h2>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
};

export default User;
