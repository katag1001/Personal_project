import React from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import RejectedMatches from '../components/matches/rejectedMatches';
import './Pages.css';
import './Matches.css';


const OldMatches = ({ loggedIn, logout }) => {
  return (

      <div className="full-page">
      <Header loggedIn={loggedIn} />

      <div className="sticky-upload-container">
        <Link to="/buildmatches">
          <button className="top-button">Build Outfits</button>
        </Link>
      </div>

      <div className="match-page-container">
      <Link to="/matches">
      <button className="regular-button"> Back to Current Outfits</button>
      </Link>
      <RejectedMatches />
      </div>
      </div>

  );
};

export default OldMatches;

