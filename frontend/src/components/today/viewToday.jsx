import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewToday = () => {
  const [outfits, setOutfits] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchTodayOutfits = async () => {

    setLoading(true);
    try {
      const response = await axios.post('/api/today/get', {username:localStorage.getItem('user')});
      const data = response.data;

      if (data) {
        if (Array.isArray(data)) {
          setOutfits(data);
          setMessage(null);

          const ranks = data
            .map((o) => o.rank)
            .filter((r) => r !== null && r !== undefined);
          const maxRank = ranks.length ? Math.max(...ranks) : null;

        if (maxRank !== null) {
            const maxRankOutfits = data.filter((o) => o.rank === maxRank);
            setFilteredOutfits(maxRankOutfits);
            setCurrentIndex(0);
          } else {
            setFilteredOutfits([]);
            setMessage('No outfits with rank found.');
          }
        } else if (data.message) {
          setOutfits([]);
          setFilteredOutfits([]);
          setMessage(data.message);
        } else {
          setOutfits([]);
          setFilteredOutfits([]);
          setMessage('Unexpected response format from outfits API.');
        }
      } else {
        setOutfits([]);
        setFilteredOutfits([]);
        setMessage(data.message || 'Failed to fetch outfits.');
      }
    } catch (err) {
      setOutfits([]);
      setFilteredOutfits([]);
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
    if (!outfit._id) {
      alert('No valid ID for this outfit.');
      return;
    }

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
    if (!outfit._id) {
      alert('No valid ID for this outfit.');
      return;
    }

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

  if (loading) return <p>Loading outfits for today...</p>;
  if (message) return <p>{message}</p>;
  if (filteredOutfits.length === 0) return <p>No outfits saved for today with highest rank.</p>;

  const outfit = filteredOutfits[currentIndex];

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Today's Outfits (Rank {outfit.rank})</h2>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li
          key={outfit._id || currentIndex}
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '1rem',
            marginBottom: '1rem',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            backgroundColor: '#f9f9f9',
          }}
        >
          {Object.entries(outfit).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>{' '}
              {typeof value === 'object' && value !== null
                ? JSON.stringify(value)
                : String(value)}
            </div>
          ))}

          <button onClick={markAsWornToday} style={{ marginTop: '1rem' }}>
            Mark as Worn Today
          </button>

          <button
            onClick={rejectOutfit}
            style={{
              marginTop: '0.5rem',
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
        </li>
      </ul>

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
