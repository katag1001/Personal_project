import React, { useState } from 'react'; 
import axios from 'axios';
import UploadImages from './uploadPics';
import ViewNewMatches from './viewNewMatches';
import colorOptions from '../../constants/colorOptions';

const styleOptions = ["plain", "patterned"];

const CreateClothes = () => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    min_temp: '',
    max_temp: '',
    colors: [],
    styles: '',
    type: 'top',
    spring: false,
    summer: false,
    autumn: false,
    winter: false,
    username: localStorage.getItem('user')
  });

  const [message, setMessage] = useState('');
  const [justCreatedItem, setJustCreatedItem] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, multiple, options } = e.target;

    if (multiple) {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData(prev => ({
        ...prev,
        [name]: selected
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        min_temp: Number(formData.min_temp),
        max_temp: Number(formData.max_temp),
        colors: formData.colors,
        styles: [formData.styles],
      };

      const res = await axios.post('/api/clothing', payload);

      if (res.data.error) {
        setMessage(`Error: ${res.data.error}`);
        setJustCreatedItem(null);
      } else {
        setMessage(`Item created: ${res.data.name}`);
        setJustCreatedItem({ name: res.data.name, type: res.data.type });

        // ✅ Reset the form here
        setFormData({
          name: '',
          imageUrl: '',
          min_temp: '',
          max_temp: '',
          colors: [],
          styles: '',
          type: 'top',
          spring: false,
          summer: false,
          autumn: false,
          winter: false,
          username: localStorage.getItem('user'),
        });
      }
    } catch (err) {
      console.error(err);
      setMessage('Error submitting form');
      setJustCreatedItem(null);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Add Clothing Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name: <input name="name" value={formData.name} onChange={handleChange} required />
        </label><br />

        <div>
          Image URL: <UploadImages setFormData={setFormData} formData={formData} />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Clothing"
              style={{ maxWidth: '100px', display: 'block', marginTop: '10px' }}
            />
          )}
        </div><br />

        <label>
          Min Temp: <input name="min_temp" type="number" value={formData.min_temp} onChange={handleChange} required />
        </label><br />

        <label>
          Max Temp: <input name="max_temp" type="number" value={formData.max_temp} onChange={handleChange} required />
        </label><br />

        <label>
          Colors:
          <select name="colors" multiple value={formData.colors} onChange={handleChange}>
            {colorOptions.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </label><br />

        <label>
          Style:
          <select name="styles" value={formData.styles} onChange={handleChange} required>
            <option value="">Select a style</option>
            {styleOptions.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
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

      {justCreatedItem && (
        <div style={{ marginTop: '2rem' }}>
          <ViewNewMatches
            newItemName={justCreatedItem.name}
            newItemType={justCreatedItem.type}
          />
        </div>
      )}
    </div>
  );
};

export default CreateClothes;
