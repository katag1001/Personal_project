import React from 'react';
import Header from '../components/header';

const BuildMatches = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
    </>
  );
};

export default BuildMatches;
