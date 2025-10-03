import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import deleteClothes from './deleteClothes';
import updateClothes from './updateClothes';
import UpdateClothesForm from './UpdateClothesForm';
import './viewClothes.css';

const ViewClothes = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [type, setType] = useState('top');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const scrollContainerRef = useRef(null);

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

  // Scroll arrows
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="view-clothes-container">
      <h2 className="title">Select Clothing Type</h2>

      <div className="button-group">
        {clothingTypes.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`text-button ${type === t ? 'active' : ''}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="error-text">Error: {error}</p>}

      <div className="horizontal-scroll-wrapper">
        <button className="scroll-arrow left-arrow" onClick={scrollLeft}>
          ‹
        </button>

        <div className="scroll-container" ref={scrollContainerRef}>
          {items.length === 0 && !error && (
            <p className="no-items">No items found.</p>
          )}

          {items.map((item) => (
          <div key={item._id} className="clothing-card">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name || 'Clothing item'}
              className="clothing-image"
            />
          )}

    <div className="clothing-details">
      <div className="item-name">{item.name}</div>

      <div className="item-info">
        <div>{getSeasons(item)}</div>
        <div>{item.min_temp}° - {item.max_temp}°</div>
      </div>

      <div className="button-row">
        <button
          onClick={() => handleEdit(item)}
          className="text-button"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(item._id)}
          className="text-button"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
))}

        </div>

        <button className="scroll-arrow right-arrow" onClick={scrollRight}>
          ›
        </button>
      </div>

      {editingItem && (
        <UpdateClothesForm
          type={type}
          formData={formData}
          onChange={handleUpdateChange}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default ViewClothes;
