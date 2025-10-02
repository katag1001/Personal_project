import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteMatches from './deleteMatches';
import UpdateMatches from './updateMatches';

const ViewMatches = () => {
  const [matches, setMatches] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [error, setError] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError(null);
        const response = await axios.post('/api/match', { username: localStorage.getItem('user') });
        const fetchedMatches = response.data;
        setMatches(fetchedMatches);

        const itemsToFetch = [];
        fetchedMatches.forEach(match => {
          ['top', 'bottom', 'outerwear', 'onepiece'].forEach(type => {
            const name = match[type];
            if (name) itemsToFetch.push({ type, name });
          });
        });

        const uniqueItems = [...new Set(itemsToFetch.map(i => `${i.type}_${i.name}`))];

        const fetchItem = async ({ type, name }) => {
        try {
          const res = await axios.post(`/api/clothing/${type}/${name}`, { username: localStorage.getItem('user') });
          console.log(`Fetched ${type} ${name}:`, res.data);
          return { key: `${type}_${name}`, data: res.data };
        } catch {
          return null;
        }
      };

        const fetchedItems = await Promise.all(
          uniqueItems.map(key => {
            const [type, name] = key.split('_');
            return fetchItem({ type, name });
          })
        );

        const itemMap = {};
        fetchedItems.forEach(entry => {
          if (entry && entry.data && !entry.data.error) {
            itemMap[entry.key] = entry.data;
          }
        });

        setItemDetails(itemMap);
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

  const renderItemImage = (type, name) => {
    if (!name) return null;
    const item = itemDetails[`${type}_${name}`];
    if (item?.imageUrl) {
      return (
        <div style={{ display: 'inline-block', marginRight: '1rem' }}>
          <img
            src={item.imageUrl}
            alt={`${type}-${name}`}
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h2>Outfit Matches</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {matches.length === 0 && !error && <p>No matches found.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.filter(match => !match.rejected).map(match => (
          <li key={match._id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            {/* Images */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              {renderItemImage('top', match.top)}
              {renderItemImage('bottom', match.bottom)}
              {renderItemImage('outerwear', match.outer)}
              {renderItemImage('onepiece', match.onepiece)}
            </div>
        

            {/* Match Info */}
            <p><strong>Temperature Range:</strong> {match.min_temp}° - {match.max_temp}°</p>
            <p><strong>Seasons:</strong> {
              ['spring', 'summer', 'autumn', 'winter']
                .filter(season => match[season])
                .map(season => season.charAt(0).toUpperCase() + season.slice(1))
                .join(', ') || 'N/A'
            }</p>

            {/* Action Buttons */}
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

      {/* Update Modal */}
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
