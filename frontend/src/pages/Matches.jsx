import React from 'react';
import Header from '../components/header';
import ViewMatches from '../components/matches/viewMatches';
import { Link } from 'react-router-dom';
import RejectedMatches from '../components/matches/rejectedMatches';

const Matches = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <Link to="/buildmatches">
        <button>Build Matches</button>
      </Link>
      <Link to="/oldmatches">
        <button>Rejected Matches</button>
      </Link>
      <ViewMatches />
      <RejectedMatches />
    </>
  );
};

export default Matches;
