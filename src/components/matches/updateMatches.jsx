import React, { useState, useEffect } from 'react';
import './updateMatches.css';
import {URL} from "../../config"; 

const UpdateMatches = ({ match, onClose, onUpdateSuccess, onError }) => {
  const [updateData, setUpdateData] = useState({
    spring: false,
    summer: false,
    autumn: false,
    winter: false,
    min_temp: '',
    max_temp: ''
  });

  useEffect(() => {
    if (match) {
      setUpdateData({
        spring: match.spring,
        summer: match.summer,
        autumn: match.autumn,
        winter: match.winter,
        min_temp: match.min_temp,
        max_temp: match.max_temp
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

    const body = {
      spring: updateData.spring,
      summer: updateData.summer,
      autumn: updateData.autumn,
      winter: updateData.winter,
      min_temp: Number(updateData.min_temp),
      max_temp: Number(updateData.max_temp)
      // Do NOT include tags here
    };

    try {
      const response = await fetch(`${URL}/match/${match._id}`, {
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
    <div className="overlay-wrapper">
      <div className="modal-container">
        <p className="modal-header">Edit Match</p>
        <form className="update-match-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="spring">Spring:</label>
            <input
              type="checkbox"
              id="spring"
              name="spring"
              checked={updateData.spring}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="summer">Summer:</label>
            <input
              type="checkbox"
              id="summer"
              name="summer"
              checked={updateData.summer}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="autumn">Autumn:</label>
            <input
              type="checkbox"
              id="autumn"
              name="autumn"
              checked={updateData.autumn}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="winter">Winter:</label>
            <input
              type="checkbox"
              id="winter"
              name="winter"
              checked={updateData.winter}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="min_temp">Min Temp:</label>
            <input
              type="number"
              id="min_temp"
              name="min_temp"
              value={updateData.min_temp}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="max_temp">Max Temp:</label>
            <input
              type="number"
              id="max_temp"
              name="max_temp"
              value={updateData.max_temp}
              onChange={handleChange}
            />
          </div>

          {match?.tags?.length > 0 && (
            <div className="tags-display">
              <strong>Tags:</strong> {match.tags.join(', ')}
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMatches;
