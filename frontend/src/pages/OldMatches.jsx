import React from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import RejectedMatches from '../components/matches/rejectedMatches';

const OldMatches = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <RejectedMatches />
    </>
  );
};

export default OldMatches;
