import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewClothes = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [type, setType] = useState('top');

  const clothingTypes = ['top', 'bottom', 'outerwear', 'onepiece'];

  // Fetch items by selected type
  const fetchItems = async () => {
    try {
      setError(null);
      setItems([]);

      const response = await axios.post(`/api/clothing/${type}`, {
        username: localStorage.getItem('user'),
      });

      setItems(response.data);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  // Helper to get season names where the value is true
  const getSeasons = (item) => {
    const seasons = [];
    if (item.spring) seasons.push('Spring');
    if (item.summer) seasons.push('Summer');
    if (item.autumn) seasons.push('Autumn');
    if (item.winter) seasons.push('Winter');
    return seasons.length > 0 ? seasons.join(', ') : 'None';
  };

  return (
    <>
      <h2>Select Clothing Type</h2>
      <div style={{ marginBottom: '1rem' }}>
        {clothingTypes.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: type === t ? '#007BFF' : '#e0e0e0',
              color: type === t ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.length === 0 && !error && <p>No items found.</p>}
        {items.map((item) => (
          <li
            key={item._id}
            style={{
              marginBottom: '2rem',
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '300px',
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name || 'Clothing item'}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
            <p>
              <strong>Seasons:</strong> {getSeasons(item)}
            </p>
            <p>
              <strong>Temperature:</strong> {item.min_temp}° - {item.max_temp}°
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ViewClothes;
