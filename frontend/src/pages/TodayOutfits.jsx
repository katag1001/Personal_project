import React, { useState } from 'react';
import Header from '../components/header';
import AutoWeather from '../components/today/autoWeather';
import ViewToday from '../components/today/viewToday';
import './Pages.css';

const TodayOutfits = ({ loggedIn, logout }) => {

  return (
    <><div className="full-page">
      <Header loggedIn={loggedIn} />
      <div className="page-container">
        <h2>Today's Outfit</h2>
      <AutoWeather />
      <ViewToday />
      </div>
</div>
    </>
  );
};

export default TodayOutfits;
