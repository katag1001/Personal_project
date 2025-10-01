import React, { useState } from 'react';

const DeleteMatches = ({ matchId, onDeleteSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/match/${matchId}`, { method: 'DELETE' });
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
      style={{
        marginTop: '0.5rem',
        color: 'white',
        backgroundColor: 'red',
        border: 'none',
        padding: '0.5rem 1rem',
        cursor: 'pointer'
      }}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
};

export default DeleteMatches;
