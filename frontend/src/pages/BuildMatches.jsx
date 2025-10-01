import React from 'react';
import Header from '../components/header';
import CreateMatch from '../components/matches/createMatch';

const BuildMatches = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <CreateMatch />
    </>
  );
};

export default BuildMatches;

