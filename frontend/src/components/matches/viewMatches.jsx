import React, { useEffect, useState } from 'react';
import DeleteMatches from './deleteMatches';
import UpdateMatches from './updateMatches';
import axios from 'axios';

const ViewMatches = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      
      try {
        setError(null);
        const response = await axios.post('/api/match', {username:localStorage.getItem('user')});
        setMatches(response.data);

      } catch {
        setError('Failed to fetch matches');
      }
    };

    fetchMatches();
  }, []);

  const handleDeleteSuccess = (id) => {
    setMatches(prev => prev.filter(match => match._id !== id));
  };

  const handleUpdateSuccess = (updatedMatch) => {
    setMatches(prev => prev.map(m => (m._id === updatedMatch._id ? updatedMatch : m)));
  };

  const handleError = (msg) => {
    setError(msg);
  };

  return (
    <>
      <h2>All Available Outfit Matches</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {matches.length === 0 && !error && <p>No matches found.</p>}

      <ul>
        {matches.filter(match => !match.rejected).map(match => (
          <li key={match._id} style={{ marginBottom: '1.5rem' }}>
            <p><strong>Top:</strong> {match.top || 'N/A'}</p>
            <p><strong>Bottom:</strong> {match.bottom || 'N/A'}</p>
            <p><strong>Outerwear:</strong> {match.outer || 'N/A'}</p>
            <p><strong>One-piece:</strong> {match.onepiece || 'N/A'}</p>
            <p><strong>Colors:</strong> {(match.colors || []).join(', ')}</p>
            <p><strong>Tags:</strong> {(match.tags || []).join(', ')}</p>
            <p><strong>Rejected:</strong> {match.rejected ? 'true' : 'false'}</p>
            <p><strong>Temperature:</strong> {match.min_temp}° - {match.max_temp}°</p>
            <p><strong>Type:</strong> {match.type}</p>
            <p><strong>Seasons:</strong> {[match.spring && 'Spring', match.summer && 'Summer', match.autumn && 'Autumn', match.winter && 'Winter'].filter(Boolean).join(', ') || 'N/A'}</p>
            <p><strong>Styles:</strong> {(match.styles || []).join(', ')}</p>
            <p><strong>Last Worn:</strong> {match.lastWornDate ? new Date(match.lastWornDate).toLocaleDateString() : 'Never'}</p>

            <DeleteMatches
              matchId={match._id}
              onDeleteSuccess={handleDeleteSuccess}
              onError={handleError}
            />

            <button
              onClick={() => setEditingMatch(match)}
              style={{
                marginTop: '0.5rem',
                color: 'white',
                backgroundColor: 'blue',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                marginLeft: '1rem'
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {editingMatch && (
        <UpdateMatches
          match={editingMatch}
          onClose={() => setEditingMatch(null)}
          onUpdateSuccess={handleUpdateSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default ViewMatches;
