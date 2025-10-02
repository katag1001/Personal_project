import React, { useEffect, useState } from 'react';
import axios from 'axios';
import deleteClothes from './deleteClothes';
import updateClothes from './updateClothes';
import UpdateClothesForm from './UpdateClothesForm';

const ViewClothes = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [type, setType] = useState('top');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const clothingTypes = ['top', 'bottom', 'outerwear', 'onepiece'];

  const fetchItems = async () => {
    try {
      setError(null);
      setItems([]);

      const response = await axios.post(`/api/clothing/${type}`, {
        username: localStorage.getItem('user'),
      });

      setItems(response.data);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    const result = await deleteClothes(type, id);
    if (result.error) {
      setError(result.error);
    } else {
      fetchItems();
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setFormData({
      name: item.name || '',
      colors: item.colors || [],
      styles: item.styles || [],
      min_temp: item.min_temp || '',
      max_temp: item.max_temp || '',
      lastWornDate: item.lastWornDate?.split('T')[0] || '',
      spring: item.spring || false,
      summer: item.summer || false,
      autumn: item.autumn || false,
      winter: item.winter || false,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name: formData.name,
      colors: formData.colors,
      styles: formData.styles,
      min_temp: Number(formData.min_temp),
      max_temp: Number(formData.max_temp),
      lastWornDate: formData.lastWornDate,
      spring: formData.spring || false,
      summer: formData.summer || false,
      autumn: formData.autumn || false,
      winter: formData.winter || false,
    };

    const result = await updateClothes(type, editingItem, updatedData);

    if (result.error) {
      setError(result.error);
    } else {
      setEditingItem(null);
      setFormData({});
      fetchItems();
    }
  };

  const getSeasons = (item) => {
    const seasons = [];
    if (item.spring) seasons.push('Spring');
    if (item.summer) seasons.push('Summer');
    if (item.autumn) seasons.push('Autumn');
    if (item.winter) seasons.push('Winter');
    return seasons.length > 0 ? seasons.join(', ') : 'None';
  };

  return (
    <>
      <h2>Select Clothing Type</h2>
      <div style={{ marginBottom: '1rem' }}>
        {clothingTypes.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: type === t ? '#007BFF' : '#e0e0e0',
              color: type === t ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.length === 0 && !error && <p>No items found.</p>}
        {items.map((item) => (
          <li
            key={item._id}
            style={{
              marginBottom: '2rem',
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '300px',
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name || 'Clothing item'}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
            <p>
              <strong>Name:</strong> {item.name}
            </p>
            <p>
              <strong>Seasons:</strong> {getSeasons(item)}
            </p>
            <p>
              <strong>Temperature:</strong> {item.min_temp}° - {item.max_temp}°
            </p>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => handleEdit(item)}
                style={{
                  marginRight: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingItem && (
        <UpdateClothesForm
          type={type}
          formData={formData}
          onChange={handleUpdateChange}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </>
  );
};

export default ViewClothes;
