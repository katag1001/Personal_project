import React from 'react';
import Header from '../components/header';
import CreateMatch from '../components/matches/createMatch';
import './Pages.css'; 

const BuildMatches = ({ loggedIn, logout }) => {
  return (
    <>
      <div className="full-page">
      <Header loggedIn={loggedIn} />
      <h2 className="page-title">create outfits</h2>
      <CreateMatch />
      </div>
    </>
  );
};

export default BuildMatches;

