import React from 'react';
import Header from '../components/header';
import CreateMatch from '../components/matches/createMatch';
import './Clothes.css'; 

const BuildMatches = ({ loggedIn, logout }) => {
  return (
    <>
      <div className="full-page">
      <Header loggedIn={loggedIn} />
      <div className="clothes-page-container">
      <CreateMatch />
      </div>
      </div>
    </>
  );
};

export default BuildMatches;

