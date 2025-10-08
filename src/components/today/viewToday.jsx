import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './viewToday.css';
import {URL} from "../../config"; 

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
      const response = await axios.post(`${URL}/today/get`, {
        username: localStorage.getItem('user'),
      });
      const data = response.data;

      if (Array.isArray(data)) {
        console.log('[STEP 1] Raw outfits from backend:', data);
        setOutfits(data);

        const ranks = data.map((o) => o.rank).filter((r) => r != null);
        const maxRank = ranks.length ? Math.max(...ranks) : null;

        if (maxRank != null) {
          const maxRankOutfits = data.filter((o) => o.rank === maxRank);
          console.log('[STEP 2] Filtered outfits with max rank:', maxRankOutfits);
          setFilteredOutfits(maxRankOutfits);
          setCurrentIndex(0);

          const itemsToFetch = [];

          maxRankOutfits.forEach((match, i) => {
            console.log(`[STEP 3] Outfit[${i}] =`, match);
            ['top', 'bottom', 'outer', 'onepiece'].forEach((type) => {
              const name = match[type];
              if (name) {
                console.log(`[STEP 3.1] Adding item to fetch: ${type} - ${name}`);
                itemsToFetch.push({ type, name });
              }
            });
          });

          console.log('[STEP 4] Items to fetch:', itemsToFetch);

          const uniqueKeys = [
            ...new Set(itemsToFetch.map((i) => `${i.type}_${i.name}`)),
          ];

          const fetchItem = async ({ type, name }) => {
            const apiType = type === 'outer' ? 'outer' : type;
            console.log(`[FETCH] Fetching item: type=${type}, name=${name}, apiType=${apiType}`);
            try {
              const res = await axios.post(`${URL}/clothing/${apiType}/${name}`, {
                username: localStorage.getItem('user'),
              });
              console.log(`[FETCH] Success for ${type}_${name}`, res.data);
              return { key: `${type}_${name}`, data: res.data };
            } catch (err) {
              console.error(`[FETCH ERROR] Failed to fetch ${type}_${name}:`, err);
              return null;
            }
          };

          const fetched = await Promise.all(
            uniqueKeys.map((key) => {
              const [type, name] = key.split('_');
              return fetchItem({ type, name });
            })
          );

          const itemMap = {};
          fetched.forEach((entry) => {
            if (entry && entry.data && !entry.data.error) {
              itemMap[entry.key] = entry.data;
              console.log(`[STEP 5] Added item to itemMap:`, entry.key, entry.data);
            } else {
              console.warn(`[STEP 5] Missing or error data for entry:`, entry);
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
      console.error('[ERROR] Failed to fetch outfits:', err);
      setMessage('Error fetching outfits: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayOutfits();
  }, []);

  const goNext = () => {
    if (filteredOutfits.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredOutfits.length);
    }
  };

  const goPrev = () => {
    if (filteredOutfits.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredOutfits.length) % filteredOutfits.length);
    }
  };

  const markAsWornToday = async () => {
    const outfit = filteredOutfits[currentIndex];
    if (!outfit?._id) {
      alert('No valid ID for this outfit.');
      return;
    }
    try {
      const response = await fetch(`${URL}/match/${outfit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastWornDate: new Date().toISOString() }),
      });
      if (response.ok) {
        const updated = await response.json();
        setFilteredOutfits((prev) => {
          const arr = [...prev];
          arr[currentIndex] = { ...arr[currentIndex], lastWornDate: updated.lastWornDate };
          return arr;
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
    if (!outfit?._id) {
      alert('No valid ID for this outfit.');
      return;
    }
    try {
      const response = await fetch(`${URL}/match/${outfit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejected: true }),
      });
      if (response.ok) {
        const updated = await response.json();
        setFilteredOutfits((prev) => {
          const arr = [...prev];
          arr[currentIndex] = { ...arr[currentIndex], rejected: updated.rejected };
          return arr;
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
    if (!name) {
      console.warn(`[RENDER] No name for type ${type}, skipping.`);
      return null;
    }
    const key = `${type}_${name}`;
    const item = itemDetails[key];
    if (item && item.imageUrl) {
      console.log(`[RENDER] Rendering image for: ${key}`, item.imageUrl);
      return (
        <img
          key={key}
          src={item.imageUrl}
          alt={`${type}-${name}`}
          className="today-image"
        />
      );
    } else {
      console.warn(`[RENDER] No image data for key: ${key}`, item);
      return null;
    }
  };

  if (loading) {
    return <p className="today-message">Loading outfits for today...</p>;
  }
  if (message) {
    return <p className="today-message">{message}</p>;
  }
  if (!filteredOutfits.length) {
    return <p className="today-message">No outfits saved for today with highest rank.</p>;
  }

  const outfit = filteredOutfits[currentIndex];
  const types = ['top', 'bottom', 'outer', 'onepiece'];
  const images = types.map((type) => renderItemImage(type, outfit[type])).filter(Boolean);
  

  return (
    <div className="view-today-container">

      <div className="horizontal-scroll-wrapper">
        <button className="left-right" onClick={goPrev}>‹</button>

        <div className="clothing-card">
          <div className="today-image-group">
            {images}
          </div>

          <div className="today-buttons">
            <button className="regular-button" onClick={markAsWornToday}>
              Mark as Worn Today
            </button>
            <button className="regular-button" onClick={rejectOutfit}>
              Reject
            </button>
          </div>
        </div>

        <button className="left-right" onClick={goNext}>›</button>
      </div>
    </div>
  );
};

export default ViewToday;
