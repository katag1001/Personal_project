import React from 'react';
import Header from '../components/header';
import ViewMatches from '../components/matches/viewMatches';
import { Link } from 'react-router-dom';
import './Pages.css';
import './Matches.css';


const Matches = ({ loggedIn, logout }) => {
  return (

      <div className="full-page">
      <Header loggedIn={loggedIn} />

      <div className="sticky-upload-container">
        <Link to="/buildmatches">
          <button className="top-button">Build Outfits</button>
        </Link>
      </div>

      <div className="match-page-container">

      <Link to="/oldmatches">
        <button className="regular-button">View Rejected Outfits</button>
      </Link>
      <ViewMatches />
      </div>
      </div>

  );
};

export default Matches;
