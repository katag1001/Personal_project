import React, { useEffect, useState } from 'react';

const ViewToday = ({ refreshKey }) => {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[ViewToday] useEffect triggered. refreshKey =', refreshKey);

    const fetchTodayOutfits = async () => {
      try {
        const response = await fetch('/api/today/get');
        const data = await response.json();

        console.log('[ViewToday] Fetched response:', data);

        if (data.message) {
          // Server responded with a message instead of outfit data
          console.warn('[ViewToday] Server returned message:', data.message);
          setError(data.message);
          setOutfits([]);
        } else if (Array.isArray(data)) {
          // Got an array of outfits
          console.log('[ViewToday] Updating outfits with:', data);
          setOutfits(data);
          setError(null);
        } else {
          // Unexpected response structure
          console.error('[ViewToday] Unexpected response format:', data);
          setError('Unexpected response from server.');
          setOutfits([]);
        }
      } catch (err) {
        console.error('[ViewToday] Fetch error:', err);
        setError('Failed to fetch today\'s outfits.');
        setOutfits([]);
      }
    };

    fetchTodayOutfits();
  }, [refreshKey]); // ✅ Triggers fetch when refreshKey changes

  return (
    <div>
      <h2>Today's Outfit Recommendations</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!error && outfits.length === 0 && <p>No outfits found.</p>}

      <ul>
        {outfits.map((outfit, index) => (
          <li key={outfit._id || index} style={{ marginBottom: '1.5rem' }}>
            <p><strong>Rank:</strong> {outfit.rank ?? 'N/A'}</p>
            <p><strong>Top:</strong> {outfit.top || 'N/A'}</p>
            <p><strong>Bottom:</strong> {outfit.bottom || 'N/A'}</p>
            <p><strong>Outerwear:</strong> {outfit.outer || 'N/A'}</p>
            <p><strong>One-piece:</strong> {outfit.onepiece || 'N/A'}</p>
            <p><strong>Colors:</strong> {outfit.colors?.join(', ') || 'N/A'}</p>
            <p><strong>Temperature:</strong> {outfit.min_temp}° - {outfit.max_temp}°</p>
            <p><strong>Type:</strong> {outfit.type || 'N/A'}</p>
            <p><strong>Seasons:</strong> 
              {[
                outfit.spring && 'Spring',
                outfit.summer && 'Summer',
                outfit.autumn && 'Autumn',
                outfit.winter && 'Winter',
              ].filter(Boolean).join(', ') || 'N/A'}
            </p>
            <p><strong>Styles:</strong> {outfit.styles?.join(', ') || 'N/A'}</p>
            <p><strong>Last Worn:</strong> {outfit.lastWornDate ? new Date(outfit.lastWornDate).toLocaleDateString() : 'Never'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewToday;
