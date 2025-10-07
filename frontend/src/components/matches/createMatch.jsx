import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../clothes/viewClothes.css'; // ✅ Reuse the same CSS as ViewClothes

const CreateMatch = () => {
  const [formData, setFormData] = useState({
    top: null,
    bottom: null,
    outer: null,
    onepiece: null,
  });

  const [clothesData, setClothesData] = useState({
    tops: [],
    bottoms: [],
    outers: [],
    onepieces: [],
  });

  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchClothes = async () => {
      const user = localStorage.getItem('user');
      try {
        const [tops, bottoms, outers, onepieces] = await Promise.all([
          axios.post('/api/clothing/top', { username: user }).then(res => res.data),
          axios.post('/api/clothing/bottom', { username: user }).then(res => res.data),
          axios.post('/api/clothing/outer', { username: user }).then(res => res.data),
          axios.post('/api/clothing/onepiece', { username: user }).then(res => res.data),
        ]);
        setClothesData({ tops, bottoms, outers, onepieces });
      } catch (err) {
        console.error('Error fetching clothing data:', err);
      }
    };
    fetchClothes();
  }, []);

  const handleSelect = (category, item) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category]?.name === item.name ? null : item
    }));
  };

  const isSelected = (category, item) => {
    return formData[category]?.name === item.name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedItems = ['top', 'bottom', 'outer', 'onepiece']
      .map(key => formData[key])
      .filter(Boolean);

    const allColors = [...new Set(selectedItems.flatMap(item => item.colors))];

    const minTempAvg = Math.round(
      selectedItems.reduce((sum, item) => sum + item.min_temp, 0) / selectedItems.length || 0
    );

    const maxTempAvg = Math.round(
      selectedItems.reduce((sum, item) => sum + item.max_temp, 0) / selectedItems.length || 0
    );

    const seasonKeys = ['spring', 'summer', 'autumn', 'winter'];
    const seasons = {};
    seasonKeys.forEach(season => {
      seasons[season] = selectedItems.every(item => item[season]);
    });

    const payload = {
      top: formData.top?.name || null,
      bottom: formData.bottom?.name || null,
      outer: formData.outer?.name || null,
      onepiece: formData.onepiece?.name || null,
      colors: allColors,
      min_temp: minTempAvg,
      max_temp: maxTempAvg,
      ...seasons,
      styles: [],
      type: 'match',
      lastWornDate: '1925-09-25',
      tags: [],
      rejected: false,
      userMade: true,
      username: localStorage.getItem('user') || null,
    };

    try {
      const res = await fetch('/api/match/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  const renderItems = (items, category) => (
    <div className="clothing-section">
      <div className="section-wrapper">
        <h3 className="section-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <div className="horizontal-scroll-wrapper">
          <div className="scroll-container">
            {items.length === 0 ? (
              <p className="no-items">No items found.</p>
            ) : (
              items.map(item => (
                <div
                  key={item._id}
                  className="clothing-card"
                  onClick={() => handleSelect(category, item)}
                  style={{
                    border: isSelected(category, item) ? '3px solid green' : '2px solid black',
                    cursor: 'pointer',
                  }}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="clothing-image"
                    />
                  )}
                  <div className="clothing-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-info">
                      <div>{item.min_temp}° - {item.max_temp}°</div>
                      <div>{(item.colors || []).join(', ')}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="view-clothes-container">
      <button onClick={handleSubmit} className="text-button" style={{ marginBottom: '2rem' }}>
        Submit Match
      </button>

      

      <form onSubmit={handleSubmit}>
        {renderItems(clothesData.tops, 'top')}
        {renderItems(clothesData.bottoms, 'bottom')}
        {renderItems(clothesData.outers, 'outer')}
        {renderItems(clothesData.onepieces, 'onepiece')}
      </form>

      {response && (
        <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CreateMatch;
