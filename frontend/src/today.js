import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000'; // Replace with your actual backend URL if needed

function App() {
  const [season, setSeason] = useState('spring');
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');
  const [matches, setMatches] = useState([]);
  const [todayOutfits, setTodayOutfits] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all matches
  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_BASE}/matches`);
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  // Fetch today's outfits
  const fetchToday = async () => {
    try {
      const res = await fetch(`${API_BASE}/today`);
      const data = await res.json();
      setTodayOutfits(data);
    } catch (err) {
      console.error('Error fetching today outfits:', err);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      season_today: season,
      min_temp_today: parseFloat(minTemp),
      max_temp_today: parseFloat(maxTemp),
    };

    try {
      const res = await fetch(`${API_BASE}/today`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setMessage(result.message || 'Success');
      fetchToday(); // Refresh today's outfits
    } catch (err) {
      console.error('Error submitting form:', err);
      setMessage('Submission failed.');
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchToday();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Outfit Matcher</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Season: </label>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
          </select>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Min Temperature: </label>
          <input
            type="number"
            value={minTemp}
            onChange={(e) => setMinTemp(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Max Temperature: </label>
          <input
            type="number"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: '15px' }}>
          Generate Today's Outfits
        </button>
      </form>

      {message && <p><strong>{message}</strong></p>}

      <hr />

      <h2>All Matches</h2>
      <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(matches, null, 2)}
      </pre>

      <h2>Today's Outfits</h2>
      <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(todayOutfits, null, 2)}
      </pre>
    </div>
  );
}

export default App;
