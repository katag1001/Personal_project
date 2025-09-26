// TodayOutfits.jsx
import React, { useState } from 'react';
import Header from '../components/header';
import ViewToday from '../components/viewToday';
import GenerateToday from '../components/generateToday';

const TodayOutfits = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerated = () => {
    // Increment refresh key to trigger re-fetch in ViewToday
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Header />
      <GenerateToday onGenerated={handleGenerated} />
      <ViewToday refreshKey={refreshKey} />
    </>
  );
};

export default TodayOutfits;
