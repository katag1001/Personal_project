// src/todayClothes.jsx
import React, { useState, useEffect } from 'react';
import { useGeolocation } from "@uidotdev/usehooks";

const BASE_URL = 'http://localhost:4444';
const seasons = ['spring', 'summer', 'autumn', 'winter'];

export default function TodayClothes() {
  
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');
  const [season, setSeason] = useState('spring');

  const [todayOutfits, setTodayOutfits] = useState([]);
  const [matches, setMatches] = useState([]);

  const [message, setMessage] = useState('');

  // Geolocation hook
  const location = useGeolocation();

  useEffect(() => {
    fetchMatches();
    fetchToday();
  }, []);

  async function fetchMatches() {
    try {
      const res = await fetch(`${BASE_URL}/api/match/`);
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  }

  async function fetchToday() {
    try {
      const res = await fetch(`${BASE_URL}/api/today/get`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTodayOutfits(data);
      } else {
        setTodayOutfits([]);
        if (data.message) setMessage(data.message);
      }
    } catch (err) {
      console.error('Failed to fetch today:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (
      minTemp === '' ||
      maxTemp === '' ||
      isNaN(minTemp) ||
      isNaN(maxTemp) ||
      !seasons.includes(season)
    ) {
      setMessage('Please enter valid temperature and season.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/today/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          min_temp_today: Number(minTemp),
          max_temp_today: Number(maxTemp),
          season_today: season,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
      }

      fetchToday();
    } catch (err) {
      console.error('Failed to submit form:', err);
      setMessage('Error submitting form.');
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Geolocation Display */}
      <section style={{ marginBottom: '1.5rem' }}>
        {location.loading && <p>Loading location... (please enable location permissions)</p>}
        {location.error && <p style={{ color: 'red' }}>Unable to access location: {location.error.message}</p>}
        {location && location.latitude && location.longitude && (
          <p>
            Latitude: <strong>{location.latitude}</strong><br />
            Longitude: <strong>{location.longitude}</strong>
          </p>
        )}
      </section>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Min Temp Today:{' '}
            <input
              type="number"
              value={minTemp}
              onChange={(e) => setMinTemp(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Max Temp Today:{' '}
            <input
              type="number"
              value={maxTemp}
              onChange={(e) => setMaxTemp(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Season:{' '}
            <select value={season} onChange={(e) => setSeason(e.target.value)}>
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Generate Outfits
        </button>
      </form>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <section>
        <h2>Today's Outfits</h2>
        {todayOutfits.length === 0 ? (
          <p>No outfits for today.</p>
        ) : (
          <ul>
            {todayOutfits.map((outfit, idx) => (
              <li key={idx} style={{ marginBottom: 10 }}>
                <pre
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '10px',
                    borderRadius: '5px',
                    overflowX: 'auto',
                  }}
                >
                  {JSON.stringify(outfit, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>All Matches</h2>
        {matches.length === 0 ? (
          <p>No match records found.</p>
        ) : (
          <ul>
            {matches.map((match) => (
              <li key={match._id || Math.random()} style={{ marginBottom: 10 }}>
                <pre
                  style={{
                    backgroundColor: '#e0e0e0',
                    padding: '10px',
                    borderRadius: '5px',
                    overflowX: 'auto',
                  }}
                >
                  {JSON.stringify(match, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
