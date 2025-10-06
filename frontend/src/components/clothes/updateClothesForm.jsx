import React from 'react';
import colorOptions from '../../constants/colorOptions';


const styleOptions = [
  "plain",
  "patterned"
];

const UpdateClothesForm = ({ type, formData, onChange, onSubmit, onCancel }) => {
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
    onChange({ target: { name, value: selected } });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onChange({ target: { name, value: checked } });
  };

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
        borderRadius: '8px'
      }}
    >
      <h3>Update {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      <form onSubmit={onSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            style={{ width: '100%' }}
            required
          />
        </label>
        <br />

        <label>
          Colors:
          <select
            name="colors"
            multiple
            value={formData.colors}
            onChange={handleMultiSelectChange}
            style={{ width: '100%', height: '80px' }}
          >
            {colorOptions.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Styles:
          <select
            name="styles"
            multiple
            value={formData.styles}
            onChange={handleMultiSelectChange}
            style={{ width: '100%', height: '50px' }}
          >
            {styleOptions.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
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
          Last Worn Date:
          <input
            type="date"
            name="lastWornDate"
            value={formData.lastWornDate}
            onChange={onChange}
          />
        </label>
        <br />

        <fieldset style={{ marginTop: '10px' }}>
          <legend>Seasons</legend>
          {['spring', 'summer', 'autumn', 'winter'].map((season) => (
            <label key={season} style={{ display: 'block' }}>
              <input
                type="checkbox"
                name={season}
                checked={formData[season] || false}
                onChange={handleCheckboxChange}
              />
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </label>
          ))}
        </fieldset>

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
