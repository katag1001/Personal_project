import React, { useEffect, useState } from 'react';

const ViewMatches = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError(null);
        const response = await fetch('/api/match');
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setMatches(data);
        }
      } catch (err) {
        setError('Failed to fetch matches');
      }
    };

    fetchMatches();
  }, []);

  return (
    <>
      <h2>All Outfit Matches</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {matches.length === 0 && !error && <p>No matches found.</p>}

      <ul>
        {matches.map((match) => (
          <li key={match._id} style={{ marginBottom: '1.5rem' }}>
            <p><strong>Top:</strong> {match.top || 'N/A'}</p>
            <p><strong>Bottom:</strong> {match.bottom || 'N/A'}</p>
            <p><strong>Outerwear:</strong> {match.outer || 'N/A'}</p>
            <p><strong>One-piece:</strong> {match.onepiece || 'N/A'}</p>
            <p><strong>Colors:</strong> {match.colors.join(', ')}</p>
            <p><strong>Temperature:</strong> {match.min_temp}° - {match.max_temp}°</p>
            <p><strong>Type:</strong> {match.type}</p>
            <p><strong>Seasons:</strong> 
              {[
                match.spring && 'Spring',
                match.summer && 'Summer',
                match.autumn && 'Autumn',
                match.winter && 'Winter',
              ]
                .filter(Boolean)
                .join(', ') || 'N/A'}
            </p>
            <p><strong>Styles:</strong> {match.styles.join(', ')}</p>
            <p><strong>Last Worn:</strong> {match.lastWornDate ? new Date(match.lastWornDate).toLocaleDateString() : 'Never'}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ViewMatches;
