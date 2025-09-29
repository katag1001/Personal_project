import React from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';

const Matches = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <Link to="/buildmatches">
        <button>Build Matches</button>
      </Link>
    </>
  );
};

export default Matches;
