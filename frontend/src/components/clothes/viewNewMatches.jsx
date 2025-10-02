import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteMatches from '../matches/deleteMatches';
import UpdateMatches from '../matches/updateMatches';

const ViewNewMatches = ({ newItemName, newItemType }) => {
  const [matches, setMatches] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [error, setError] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError(null);
        const response = await axios.post('/api/match', { username: localStorage.getItem('user') });

        // Filter matches to only include those that include the new item
        const relevantMatches = response.data.filter(match => {
          if (newItemType === 'outerwear') return match.outer === newItemName;
          return match[newItemType] === newItemName;
        });

        setMatches(relevantMatches);

        const itemsToFetch = [];
        relevantMatches.forEach(match => {
          ['top', 'bottom', 'outer', 'onepiece'].forEach(key => {
            const name = match[key];
            if (name) {
              const type = key === 'outer' ? 'outerwear' : key;
              itemsToFetch.push({ type, name });
            }
          });
        });

        const uniqueItems = [...new Set(itemsToFetch.map(i => `${i.type}_${i.name}`))];

        const fetchItem = async ({ type, name }) => {
          try {
            const res = await axios.post(`/api/clothing/${type}/${name}`, { username: localStorage.getItem('user') });
            return { key: `${type}_${name}`, data: res.data };
          } catch {
            return null;
          }
        };

        const fetchedItems = await Promise.all(
          uniqueItems.map(key => {
            const [type, ...nameParts] = key.split('_');
            const name = nameParts.join('_');
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
        setError('Failed to fetch new matches');
      }
    };

    fetchMatches();
  }, [newItemName, newItemType]);

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
    const lookupType = type === 'outer' ? 'outerwear' : type;
    const item = itemDetails[`${lookupType}_${name}`];

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
    <div>
      <h2>New Matches for: {newItemName}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {matches.length === 0 && !error && <p>No new matches found.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.filter(match => !match.rejected).map(match => (
          <li key={match._id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              {renderItemImage('top', match.top)}
              {renderItemImage('bottom', match.bottom)}
              {renderItemImage('outer', match.outer)}
              {renderItemImage('onepiece', match.onepiece)}
            </div>

            <p><strong>Temperature Range:</strong> {match.min_temp}° - {match.max_temp}°</p>
            <p><strong>Seasons:</strong> {
              ['spring', 'summer', 'autumn', 'winter']
                .filter(season => match[season])
                .map(season => season.charAt(0).toUpperCase() + season.slice(1))
                .join(', ') || 'N/A'
            }</p>

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
    </div>
  );
};

export default ViewNewMatches;
