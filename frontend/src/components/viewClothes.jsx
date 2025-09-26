import React, { useEffect, useState } from 'react';
import deleteClothes from './deleteClothes';
import updateClothes from './updateClothes';
import UpdateClothesForm from './UpdateClothesForm';

const ViewClothes = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [type, setType] = useState('top');

  const [editItem, setEditItem] = useState(null); // item being edited
  const [formData, setFormData] = useState({}); // form inputs
  const [changedFields, setChangedFields] = useState({}); // track changed inputs

  const clothingTypes = ['top', 'bottom', 'outerwear', 'onepiece'];

  // Fetch items by selected type
  const fetchItems = async () => {
    try {
      setError(null);
      setItems([]);

      const response = await fetch(`/api/clothing/${type}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setItems(data);
      }
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  // Delete handler
  const handleDelete = async (id) => {
    const result = await deleteClothes(type, id);

    if (result.error) {
      setError(result.error);
    } else {
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    }
  };

  // Open update form and initialize states
  const handleUpdateClick = (item) => {
    setEditItem(item);
    setFormData({
      [type]: item[type] || '',
      colors: item.colors.join(', '),
      min_temp: item.min_temp,
      max_temp: item.max_temp,
      styles: item.styles.join(', '),
      lastWornDate: item.lastWornDate ? item.lastWornDate.split('T')[0] : '',
    });
    setChangedFields({});
  };

  // Track form field changes and which fields have changed
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChangedFields((prev) => ({ ...prev, [name]: value }));
  };

  // Submit only changed fields
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};

    for (const key in changedFields) {
      let val = changedFields[key];

      if (key === 'colors' || key === 'styles') {
        updatedData[key] = val.split(',').map((s) => s.trim());
      } else if (key === 'min_temp' || key === 'max_temp') {
        updatedData[key] = Number(val);
      } else if (key === 'lastWornDate') {
        updatedData[key] = val || null;
      } else {
        updatedData[key] = val;
      }
    }

    if (Object.keys(updatedData).length === 0) {
      setEditItem(null); // no changes made, just close popup
      return;
    }

    const result = await updateClothes(type, editItem._id, updatedData);

    if (result.error) {
      setError(result.error);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === result._id ? result : item))
      );
      setEditItem(null); // close popup
    }
  };

  return (
    <>
      <h2>Select Clothing Type</h2>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        {clothingTypes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul>
        {items.length === 0 && !error && <p>No items found.</p>}
        {items.map((item) => (
          <li key={item._id} style={{ marginBottom: '1rem' }}>
            <strong>{item[type]}</strong>
            <p>
              Colors: {item.colors.join(', ')} <br />
              Temp: {item.min_temp}° - {item.max_temp}° <br />
              Type: {item.type} <br />
              Styles: {item.styles.join(', ')} <br />
              Last Worn:{' '}
              {item.lastWornDate
                ? new Date(item.lastWornDate).toLocaleDateString()
                : 'Never'}
            </p>
            <button
              onClick={() => handleDelete(item._id)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Delete
            </button>
            <button
              onClick={() => handleUpdateClick(item)}
              style={{
                backgroundColor: 'orange',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Update
            </button>
          </li>
        ))}
      </ul>

      {editItem && (
        <UpdateClothesForm
          type={type}
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditItem(null)}
        />
      )}
    </>
  );
};

export default ViewClothes;
