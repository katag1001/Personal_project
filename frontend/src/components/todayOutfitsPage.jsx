// TodayOutfitsPage.jsx
import React, { useState, useEffect } from 'react';
import AutoWeather from './autoWeather';
import GenerateToday from './generateToday';
import ViewToday from './viewToday';

const TodayOutfitsPage = () => {
  const [autoMin, setAutoMin] = useState('');
  const [autoMax, setAutoMax] = useState('');
  const [autoSeason, setAutoSeason] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-trigger outfit generation when all auto-weather values are set
  useEffect(() => {
    const isValid = autoMin !== '' && autoMax !== '' && autoSeason;

    if (!isValid) return;

    const payload = {
      min_temp_today: Number(autoMin),
      max_temp_today: Number(autoMax),
      season_today: autoSeason,
    };

    console.log('[AutoTrigger] Sending auto weather to createToday:', payload);

    const sendRequest = async () => {
      try {
        const response = await fetch('/api/today/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (data.data) {
          console.log('[AutoTrigger] Created outfits:', data.data.length);
          setRefreshKey((prev) => prev + 1);
        } else {
          console.warn('[AutoTrigger] No outfits generated:', data.message);
        }
      } catch (err) {
        console.error('[AutoTrigger] Failed to generate outfits:', err);
      }
    };

    sendRequest();
  }, [autoMin, autoMax, autoSeason]);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Today’s Outfit Generator</h1>

      <AutoWeather
        setMinTemp={setAutoMin}
        setMaxTemp={setAutoMax}
        setSeason={setAutoSeason}
      />

      <GenerateToday
        autoMin={autoMin}
        autoMax={autoMax}
        autoSeason={autoSeason}
        onGenerated={() => setRefreshKey((prev) => prev + 1)}
      />

      <ViewToday refreshKey={refreshKey} />
    </div>
  );
};

export default TodayOutfitsPage;
