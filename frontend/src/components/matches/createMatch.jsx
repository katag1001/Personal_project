import React, { useEffect, useState } from 'react';
import axios from 'axios';

const colorOptions = [
  "navy", "soft white", "warm gray", "sage green",
  "dusty rose", "mustard", "terracotta", "cream"
];

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

  // Fetch all clothing data on mount
 useEffect(() => {
    const fetchClothes = async () => {
      const user = localStorage.getItem('user')
      try {
        const [tops, bottoms, outers, onepieces] = await Promise.all([
          axios.post('/api/clothing/top',{'username':user}).then(res => res.data),
          axios.post('/api/clothing/bottom',{'username':user}).then(res => res.data),
          axios.post('/api/clothing/outerwear',{'username':user}).then(res => res.data),
          axios.post('/api/clothing/onepiece',{'username':user}).then(res => res.data),
        ]);
        console.log(tops)
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
      .filter(Boolean); // Remove nulls

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
    <div style={{ marginBottom: '20px' }}>
      <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {items.map(item => (
          <div
            key={item.name}
            onClick={() => handleSelect(category, item)}
            style={{
              border: isSelected(category, item) ? '2px solid green' : '1px solid gray',
              padding: '10px',
              cursor: 'pointer',
              width: '120px',
              textAlign: 'center'
            }}
          >
            <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2>Create Match</h2>
      <form onSubmit={handleSubmit}>
        {renderItems(clothesData.tops, 'top')}
        {renderItems(clothesData.bottoms, 'bottom')}
        {renderItems(clothesData.outers, 'outer')}
        {renderItems(clothesData.onepieces, 'onepiece')}

        <button type="submit">Submit Match</button>
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
