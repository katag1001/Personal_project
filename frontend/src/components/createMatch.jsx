import React, { useState } from 'react';

const colorOptions = [
  "navy",
  "soft white",
  "warm gray",
  "sage green",
  "dusty rose",
  "mustard",
  "terracotta",
  "cream"
];

const CreateMatch = () => {
  const [formData, setFormData] = useState({
    top: '',
    bottom: '',
    outer: '',
    onepiece: '',
    colors: [],
    min_temp: '',
    max_temp: '',
    spring: false,
    summer: false,
    autumn: false,
    winter: false,
  });

  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'select-multiple') {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      min_temp: Number(formData.min_temp),
      max_temp: Number(formData.max_temp),
      styles: [], // Force empty array
      type: 'match', // Force type to 'match'
      lastWornDate: '1925-09-25', // Set historical date
      top: formData.top || null,
      bottom: formData.bottom || null,
      outer: formData.outer || null,
      onepiece: formData.onepiece || null,
    };

    try {
      const res = await fetch('/api/match/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <div>
      <h2>Create Match</h2>
      <form onSubmit={handleSubmit}>
        <label>Top: <input type="text" name="top" value={formData.top} onChange={handleChange} /></label><br />
        <label>Bottom: <input type="text" name="bottom" value={formData.bottom} onChange={handleChange} /></label><br />
        <label>Outer: <input type="text" name="outer" value={formData.outer} onChange={handleChange} /></label><br />
        <label>Onepiece: <input type="text" name="onepiece" value={formData.onepiece} onChange={handleChange} /></label><br />

        <label>Colors:</label><br />
        <select name="colors" multiple value={formData.colors} onChange={handleChange} size={colorOptions.length}>
          {colorOptions.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select><br /><br />

        <label>Min Temp: <input type="number" name="min_temp" value={formData.min_temp} onChange={handleChange} required /></label><br />
        <label>Max Temp: <input type="number" name="max_temp" value={formData.max_temp} onChange={handleChange} required /></label><br />

        <label>Spring: <input type="checkbox" name="spring" checked={formData.spring} onChange={handleChange} /></label><br />
        <label>Summer: <input type="checkbox" name="summer" checked={formData.summer} onChange={handleChange} /></label><br />
        <label>Autumn: <input type="checkbox" name="autumn" checked={formData.autumn} onChange={handleChange} /></label><br />
        <label>Winter: <input type="checkbox" name="winter" checked={formData.winter} onChange={handleChange} /></label><br /><br />

        {/* Hidden Inputs (optional if you want to be explicit) */}
        <input type="hidden" name="type" value="match" />
        <input type="hidden" name="styles" value="" />
        <input type="hidden" name="lastWornDate" value="1925-09-25" />

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
