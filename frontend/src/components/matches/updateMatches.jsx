import React, { useState, useEffect } from 'react';

const UpdateMatches = ({ match, onClose, onUpdateSuccess, onError }) => {
  const [updateData, setUpdateData] = useState({
    spring: false,
    summer: false,
    autumn: false,
    winter: false,
    min_temp: '',
    max_temp: '',
    tags: ''
  });

  useEffect(() => {
    if (match) {
      setUpdateData({
        spring: match.spring,
        summer: match.summer,
        autumn: match.autumn,
        winter: match.winter,
        min_temp: match.min_temp,
        max_temp: match.max_temp,
        tags: (match.tags || []).join(', '),
      });
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare update body with only fields user wants to update
    const body = {
      spring: updateData.spring,
      summer: updateData.summer,
      autumn: updateData.autumn,
      winter: updateData.winter,
      min_temp: Number(updateData.min_temp),
      max_temp: Number(updateData.max_temp),
      tags: updateData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const response = await fetch(`/api/match/${match._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.error) {
        onError(data.error);
      } else {
        onUpdateSuccess(data);
        onClose();
      }
    } catch (err) {
      onError('Failed to update match');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', width: '400px' }}>
        <h3>Edit Match</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Spring: <input type="checkbox" name="spring" checked={updateData.spring} onChange={handleChange} />
          </label><br />
          <label>
            Summer: <input type="checkbox" name="summer" checked={updateData.summer} onChange={handleChange} />
          </label><br />
          <label>
            Autumn: <input type="checkbox" name="autumn" checked={updateData.autumn} onChange={handleChange} />
          </label><br />
          <label>
            Winter: <input type="checkbox" name="winter" checked={updateData.winter} onChange={handleChange} />
          </label><br />
          <label>
            Min Temp: <input type="number" name="min_temp" value={updateData.min_temp} onChange={handleChange} />
          </label><br />
          <label>
            Max Temp: <input type="number" name="max_temp" value={updateData.max_temp} onChange={handleChange} />
          </label><br />
          <label>
            Tags (comma separated): <input type="text" name="tags" value={updateData.tags} onChange={handleChange} />
          </label><br />

          <button type="submit" style={{ marginTop: '1rem' }}>Save</button>
          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: '1rem', backgroundColor: 'gray', color: 'white' }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMatches;
