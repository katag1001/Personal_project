import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewToday = () => {
  const [outfits, setOutfits] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [itemDetails, setItemDetails] = useState({});

  const fetchTodayOutfits = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/today/get', {
        username: localStorage.getItem('user'),
      });

      const data = response.data;

      if (Array.isArray(data)) {
        setOutfits(data);
        const ranks = data.map((o) => o.rank).filter((r) => r != null);
        const maxRank = ranks.length ? Math.max(...ranks) : null;

        if (maxRank != null) {
          const maxRankOutfits = data.filter((o) => o.rank === maxRank);
          setFilteredOutfits(maxRankOutfits);
          setCurrentIndex(0);

          // Fetch clothing item images
          const itemsToFetch = [];
          maxRankOutfits.forEach((match) => {
            ['top', 'bottom', 'outer', 'onepiece'].forEach((type) => {
              const name = match[type];
              if (name) itemsToFetch.push({ type, name });
            });
          });

          const uniqueItems = [
            ...new Set(itemsToFetch.map((i) => `${i.type}_${i.name}`)),
          ];

          const fetchItem = async ({ type, name }) => {
            try {
              const res = await axios.post(`/api/clothing/${type}/${name}`, {
                username: localStorage.getItem('user'),
              });
              return { key: `${type}_${name}`, data: res.data };
            } catch {
              return null;
            }
          };

          const fetchedItems = await Promise.all(
            uniqueItems.map((key) => {
              const [type, name] = key.split('_');
              return fetchItem({ type, name });
            })
          );

          const itemMap = {};
          fetchedItems.forEach((entry) => {
            if (entry && entry.data && !entry.data.error) {
              itemMap[entry.key] = entry.data;
            }
          });

          setItemDetails(itemMap);
        } else {
          setFilteredOutfits([]);
          setMessage('No outfits with rank found.');
        }
      } else {
        setMessage(data.message || 'Failed to fetch outfits.');
      }
    } catch (err) {
      setMessage('Error fetching outfits: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayOutfits();
  }, []);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredOutfits.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredOutfits.length) % filteredOutfits.length);
  };

  const markAsWornToday = async () => {
    const outfit = filteredOutfits[currentIndex];
    if (!outfit._id) return alert('No valid ID for this outfit.');

    try {
      const response = await fetch(`/api/match/${outfit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastWornDate: new Date().toISOString() }),
      });

      if (response.ok) {
        const updatedMatch = await response.json();
        setFilteredOutfits((prev) => {
          const newOutfits = [...prev];
          newOutfits[currentIndex] = {
            ...newOutfits[currentIndex],
            lastWornDate: updatedMatch.lastWornDate,
          };
          return newOutfits;
        });
        alert('Marked as worn today!');
      } else {
        const errData = await response.json();
        alert('Failed to update: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error updating lastWornDate: ' + err.message);
    }
  };

  const rejectOutfit = async () => {
    const outfit = filteredOutfits[currentIndex];
    if (!outfit._id) return alert('No valid ID for this outfit.');

    try {
      const response = await fetch(`/api/match/${outfit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejected: true }),
      });

      if (response.ok) {
        const updatedMatch = await response.json();
        setFilteredOutfits((prev) => {
          const newOutfits = [...prev];
          newOutfits[currentIndex] = {
            ...newOutfits[currentIndex],
            rejected: updatedMatch.rejected,
          };
          return newOutfits;
        });
        alert('Outfit rejected.');
      } else {
        const errData = await response.json();
        alert('Failed to reject: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error rejecting outfit: ' + err.message);
    }
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
            style={{
              maxWidth: '150px',
              maxHeight: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
        </div>
      );
    }
    return null;
  };

  if (loading) return <p>Loading outfits for today...</p>;
  if (message) return <p>{message}</p>;
  if (filteredOutfits.length === 0)
    return <p>No outfits saved for today with highest rank.</p>;

  const outfit = filteredOutfits[currentIndex];

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Today's Best Outfit (Rank {outfit.rank})</h2>

      {/* Outfit Images */}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {renderItemImage('top', outfit.top)}
        {renderItemImage('bottom', outfit.bottom)}
        {renderItemImage('outer', outfit.outer)}
        {renderItemImage('onepiece', outfit.onepiece)}
      </div>


      {/* Buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={markAsWornToday}>Mark as Worn Today</button>
        <button
          onClick={rejectOutfit}
          style={{
            marginLeft: '1rem',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reject
        </button>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: 200,
          margin: 'auto',
        }}
      >
        <button onClick={goPrev} disabled={filteredOutfits.length <= 1}>
          Previous
        </button>
        <button onClick={goNext} disabled={filteredOutfits.length <= 1}>
          Next
        </button>
      </div>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        {currentIndex + 1} of {filteredOutfits.length}
      </p>
    </div>
  );
};

export default ViewToday;
