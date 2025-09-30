import React, { useState } from 'react';
import Header from '../components/header';
import TodayOutfitsPage from '../components/todayOutfitsPage';
import ViewMatches from '../components/viewMatches';


const TodayOutfits = ({ loggedIn, logout }) => {

  return (
    <>
      <Header loggedIn={loggedIn} />
      <TodayOutfitsPage />
      <ViewMatches />
    </>
  );
};

export default TodayOutfits;
