import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RejectedMatches = () => {
  const [matches, setMatches] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [error, setError] = useState(null);

  // Fetch all matches on mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError(null);
        const response = await axios.post('/api/match', { username: localStorage.getItem('user') });
        const fetchedMatches = response.data;
        setMatches(fetchedMatches);

        // ==== Extract item names and types from rejected matches ====
        const itemsToFetch = [];
        fetchedMatches
          .filter(match => match.rejected)
          .forEach(match => {
            ['top', 'bottom', 'outer', 'onepiece'].forEach(type => {
              const name = match[type];
              if (name) itemsToFetch.push({ type, name });
            });
          });

        // ==== Remove duplicates ====
        const uniqueItems = [...new Set(itemsToFetch.map(i => `${i.type}_${i.name}`))];

        // ==== Fetch each item from clothing API ====
        const fetchItem = async ({ type, name }) => {
          try {
            const res = await axios.post(`/api/clothing/${type}/${name}`, {
              username: localStorage.getItem('user')
            });
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

        // ==== Store fetched item data by key ====
        const itemMap = {};
        fetchedItems.forEach(entry => {
          if (entry && entry.data && !entry.data.error) {
            itemMap[entry.key] = entry.data;
          }
        });

        setItemDetails(itemMap);
      } catch (err) {
        setError('Failed to fetch matches');
      }
    };

    fetchMatches();
  }, []);

  // Render item image
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

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.filter(match => match.rejected).map((match) => (
          <li key={match._id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            
            {/* ==== Images ==== */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              {renderItemImage('top', match.top)}
              {renderItemImage('bottom', match.bottom)}
              {renderItemImage('outer', match.outer)}
              {renderItemImage('onepiece', match.onepiece)}
            </div>


           
            {/* ==== Action Buttons ==== */}
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
