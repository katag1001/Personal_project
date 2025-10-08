import React, { useState } from 'react';
import './viewMatches.css';
import {URL} from "../../config"; 


const DeleteMatches = ({ matchId, onDeleteSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/match/${matchId}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.error) {
        onError(data.error);
      } else {
        onDeleteSuccess(matchId);
      }
    } catch (err) {
      onError('Failed to delete match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="delete-match-button"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
};

export default DeleteMatches;
