import React, { useEffect, useState } from 'react';

const ViewToday = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);  // separate from error, for user info
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await fetch('/api/today/get'); // Uses Vite proxy
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setOutfits(data);
            setMessage(null);
            setError(null);
          } else if (data.message) {
            // Clear outfits when only a message is returned
            setOutfits([]);
            setMessage(data.message);
            setError(null);
          } else {
            setOutfits([]);
            setMessage(null);
            setError('Unexpected response format.');
          }
        } else {
          setOutfits([]);
          setMessage(null);
          setError(data.message || 'Failed to fetch outfits.');
        }
      } catch (err) {
        setOutfits([]);
        setMessage(null);
        setError('Error fetching outfits: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  if (loading) return <p>Loading outfits for today...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (message) return <p>{message}</p>;
  if (outfits.length === 0) return <p>No outfits saved for today.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Today's Outfits</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {outfits.map((outfit, index) => (
          <li
            key={outfit._id || index}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {outfit.image_url && (
              <img
                src={outfit.image_url}
                alt={outfit.name || 'Outfit'}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
              />
            )}
            <div>
              <h3 style={{ margin: 0 }}>{outfit.name || 'Unnamed Outfit'}</h3>
              <p style={{ margin: '0.2rem 0' }}>
                Min Temp: {outfit.min_temp}°C | Max Temp: {outfit.max_temp}°C | Rank: {outfit.rank}
              </p>
              <p style={{ margin: 0 }}>Seasons: {['spring', 'summer', 'autumn', 'winter']
                .filter(season => outfit[season])
                .join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewToday;
