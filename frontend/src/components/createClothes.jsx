import React, { useState } from 'react';
import axios from 'axios';

const CreateClothes = () => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    min_temp: '',
    max_temp: '',
    colors: '',
    styles: '',
    type: 'top',
    spring: false,
    summer: false,
    autumn: false,
    winter: false
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        min_temp: Number(formData.min_temp),
        max_temp: Number(formData.max_temp),
        colors: formData.colors.split(',').map(c => c.trim()),
        styles: formData.styles.split(',').map(s => s.trim()),
      };

      const res = await axios.post('/api/clothing', payload);

      if (res.data.error) {
        setMessage(`Error: ${res.data.error}`);
      } else {
        setMessage(`Item created: ${res.data.name}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error submitting form');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Add Clothing Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name: <input name="name" value={formData.name} onChange={handleChange} required />
        </label><br />
        <label>
          Image URL: <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </label><br />
        <label>
          Min Temp: <input name="min_temp" type="number" value={formData.min_temp} onChange={handleChange} required />
        </label><br />
        <label>
          Max Temp: <input name="max_temp" type="number" value={formData.max_temp} onChange={handleChange} required />
        </label><br />
        <label>
          Colors (comma-separated): <input name="colors" value={formData.colors} onChange={handleChange} required />
        </label><br />
        <label>
          Styles (comma-separated): <input name="styles" value={formData.styles} onChange={handleChange} required />
        </label><br />
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="outerwear">Outerwear</option>
            <option value="onepiece">OnePiece</option>
          </select>
        </label><br />
        <label>
          Spring: <input type="checkbox" name="spring" checked={formData.spring} onChange={handleChange} />
        </label><br />
        <label>
          Summer: <input type="checkbox" name="summer" checked={formData.summer} onChange={handleChange} />
        </label><br />
        <label>
          Autumn: <input type="checkbox" name="autumn" checked={formData.autumn} onChange={handleChange} />
        </label><br />
        <label>
          Winter: <input type="checkbox" name="winter" checked={formData.winter} onChange={handleChange} />
        </label><br />
        <button type="submit">Add Item</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateClothes;
