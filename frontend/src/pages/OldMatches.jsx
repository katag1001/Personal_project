import React from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import RejectedMatches from '../components/matches/rejectedMatches';
import './Clothes.css';
import './Matches.css';


const OldMatches = ({ loggedIn, logout }) => {
  return (

      <div className="full-page">
      <Header loggedIn={loggedIn} />

      <div className="sticky-upload-container">
        <Link to="/buildmatches">
          <button className="top-button">Build Matches</button>
        </Link>
      </div>

      <div className="match-page-container">
      <RejectedMatches />
      </div>
      </div>

  );
};

export default OldMatches;

