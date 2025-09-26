import React, { useEffect, useState } from 'react';

const ViewToday = ({ refreshKey }) => {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayOutfits = async () => {
      try {
        const response = await fetch('/api/today/get');
        const data = await response.json();

        if (data.message) {
          setError(data.message);
          setOutfits([]);
        } else {
          setOutfits(data);
          setError(null);
        }
      } catch (err) {
        setError('Failed to fetch today\'s outfits.');
      }
    };

    fetchTodayOutfits();
  }, [refreshKey]); // ✅ Refetch every time refreshKey changes

  return (
    <div>
      <h2>Today's Outfit Recommendations</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {outfits.length === 0 && !error && <p>No outfits found.</p>}

      <ul>
        {outfits.map((outfit) => (
          <li key={outfit._id} style={{ marginBottom: '1.5rem' }}>
            <p><strong>Rank:</strong> {outfit.rank ?? 'N/A'}</p>
            <p><strong>Top:</strong> {outfit.top || 'N/A'}</p>
            <p><strong>Bottom:</strong> {outfit.bottom || 'N/A'}</p>
            <p><strong>Outerwear:</strong> {outfit.outer || 'N/A'}</p>
            <p><strong>One-piece:</strong> {outfit.onepiece || 'N/A'}</p>
            <p><strong>Colors:</strong> {outfit.colors.join(', ')}</p>
            <p><strong>Temperature:</strong> {outfit.min_temp}° - {outfit.max_temp}°</p>
            <p><strong>Type:</strong> {outfit.type}</p>
            <p><strong>Seasons:</strong> 
              {[
                outfit.spring && 'Spring',
                outfit.summer && 'Summer',
                outfit.autumn && 'Autumn',
                outfit.winter && 'Winter',
              ].filter(Boolean).join(', ') || 'N/A'}
            </p>
            <p><strong>Styles:</strong> {outfit.styles.join(', ')}</p>
            <p><strong>Last Worn:</strong> {outfit.lastWornDate ? new Date(outfit.lastWornDate).toLocaleDateString() : 'Never'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewToday;
