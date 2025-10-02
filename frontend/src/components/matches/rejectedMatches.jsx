import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RejectedMatches = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all matches on mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError(null);
        const response = await axios.post('/api/match', {username:localStorage.getItem('user')});
        setMatches(response.data);
      } catch (err) {
        setError('Failed to fetch matches');
      }
    };

    fetchMatches();
  }, []);

  // Delete match by ID
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/match/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Refresh matches list after delete
        setMatches((prevMatches) => prevMatches.filter((match) => match._id !== id));
      }
    } catch (err) {
      setError('Failed to delete match');
    }
  };

  // Reinstate match (set rejected to false)
  const handleReinstate = async (id) => {
    try {
      const response = await fetch(`/api/match/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejected: false }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Remove reinstated match from the rejected list
        setMatches((prevMatches) =>
          prevMatches.map((match) =>
            match._id === id ? { ...match, rejected: false } : match
          )
        );
      }
    } catch (err) {
      setError('Failed to reinstate match');
    }
  };

  return (
    <>
      <h2>Rejected Outfit Matches</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {matches.filter(match => match.rejected).length === 0 && !error && <p>No rejected matches found.</p>}

      <ul>
        {matches.filter(match => match.rejected).map((match) => (
          <li key={match._id} style={{ marginBottom: '1.5rem' }}>
            <p><strong>Top:</strong> {match.top || 'N/A'}</p>
            <p><strong>Bottom:</strong> {match.bottom || 'N/A'}</p>
            <p><strong>Outerwear:</strong> {match.outer || 'N/A'}</p>
            <p><strong>One-piece:</strong> {match.onepiece || 'N/A'}</p>
            <p><strong>Colors:</strong> {match.colors.join(', ')}</p>
            <p><strong>Tags:</strong> {match.tags}</p>
            <p><strong>Rejected:</strong> {match.rejected ? 'true' : 'false'}</p>
            <p><strong>Temperature:</strong> {match.min_temp}° - {match.max_temp}°</p>
            <p><strong>Type:</strong> {match.type}</p>
            <p><strong>Seasons:</strong> 
              {[match.spring && 'Spring', match.summer && 'Summer', match.autumn && 'Autumn', match.winter && 'Winter']
                .filter(Boolean)
                .join(', ') || 'N/A'}
            </p>
            <p><strong>Styles:</strong> {match.styles.join(', ')}</p>
            <p><strong>Last Worn:</strong> {match.lastWornDate ? new Date(match.lastWornDate).toLocaleDateString() : 'Never'}</p>

            {/* Reinstate button */}
            <button
              onClick={() => handleReinstate(match._id)}
              style={{
                marginRight: '1rem',
                marginTop: '0.5rem',
                color: 'white',
                backgroundColor: 'green',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Reinstate Match
            </button>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(match._id)}
              style={{
                marginTop: '0.5rem',
                color: 'white',
                backgroundColor: 'red',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RejectedMatches;
