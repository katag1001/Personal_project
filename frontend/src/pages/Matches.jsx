import React from 'react';
import Header from '../components/header';
import ViewMatches from '../components/viewMatches';
import { Link } from 'react-router-dom';

const Matches = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <Link to="/buildmatches">
        <button>Build Matches</button>
      </Link>
      <ViewMatches />
    </>
  );
};

export default Matches;
