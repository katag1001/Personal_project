import React from 'react';

const UpdateClothesForm = ({ type, formData, onChange, onSubmit, onCancel }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '1rem',
        zIndex: 1000,
        width: '300px',
      }}
    >
      <h3>Update Item</h3>
      <form onSubmit={onSubmit}>
        <label>
          {type}:
          <input
            name={type}
            value={formData[type]}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Colors (comma-separated):
          <input
            name="colors"
            value={formData.colors}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Min Temp:
          <input
            type="number"
            name="min_temp"
            value={formData.min_temp}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Max Temp:
          <input
            type="number"
            name="max_temp"
            value={formData.max_temp}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Styles (comma-separated):
          <input
            name="styles"
            value={formData.styles}
            onChange={onChange}
          />
        </label>
        <br />
        <label>
          Last Worn Date:
          <input
            type="date"
            name="lastWornDate"
            value={formData.lastWornDate}
            onChange={onChange}
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: '10px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateClothesForm;
