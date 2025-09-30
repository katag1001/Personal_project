import React, { useState, useEffect } from 'react';

const GenerateToday = ({ onGenerated, autoMin, autoMax, autoSeason }) => {
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');
  const [season, setSeason] = useState('spring');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Set defaults from AutoWeather when they change
  useEffect(() => {
    if (autoMin !== '') setMinTemp(autoMin);
    if (autoMax !== '') setMaxTemp(autoMax);
    if (autoSeason) setSeason(autoSeason);
  }, [autoMin, autoMax, autoSeason]);

  const generateOutfits = async () => {
    setMessage(null);
    setError(null);

    const payload = {
      min_temp_today: Number(minTemp),
      max_temp_today: Number(maxTemp),
      season_today: season,
    };

    try {
      const response = await fetch('/api/today/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.message) {
        if (data.data) {
          setMessage(data.message);
          onGenerated?.();
        } else {
          setError(data.message);
        }
      } else {
        setError('Unexpected response.');
      }
    } catch (err) {
      setError('Failed to generate today\'s outfits.');
    }
  };

  return (
    <div>
      <h2>Generate Outfits for Today</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Min Temp:
          <input
            type="number"
            value={minTemp}
            onChange={(e) => setMinTemp(e.target.value)}
            style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
          />
        </label>

        <label>
          Max Temp:
          <input
            type="number"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value)}
            style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
          />
        </label>

        <label>
          Season:
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
          </select>
        </label>

        <button onClick={generateOutfits} style={{ marginLeft: '1rem' }}>
          Generate
        </button>
      </div>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default GenerateToday;
