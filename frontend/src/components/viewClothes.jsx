import React, { useEffect, useState } from 'react';


const ViewClothes = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [type, setType] = useState('top');

  const clothingTypes = ['top', 'bottom', 'outerwear', 'onepiece'];

  useEffect(() => {
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

    fetchItems();
  }, [type]);

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
          </li>
        ))}
      </ul>
    </>
  );
};

export default ViewClothes;
