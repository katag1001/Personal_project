// TodayOutfits.jsx
import React, { useState } from 'react';
import Header from '../components/header';
import ViewToday from '../components/viewToday';
import GenerateToday from '../components/generateToday';

const TodayOutfits = ({ loggedIn, logout }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Header loggedIn={loggedIn} />
      <GenerateToday onGenerated={handleGenerated} />
      <ViewToday refreshKey={refreshKey} />
    </>
  );
};

export default TodayOutfits;
