import React, { useState } from 'react';
import Header from '../components/header';
import AutoWeather from '../components/today/autoWeather';
import ViewToday from '../components/today/viewToday';
 

const TodayOutfits = ({ loggedIn, logout }) => {

  return (
    <>
      <Header loggedIn={loggedIn} />
      <AutoWeather />
      <ViewToday />

    </>
  );
};

export default TodayOutfits;
