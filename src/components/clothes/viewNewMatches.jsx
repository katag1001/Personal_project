import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import DeleteMatches from '../matches/deleteMatches';
import UpdateMatches from '../matches/updateMatches';
import '../matches/viewMatches.css';
import {URL} from "../../config"; 

const ViewNewMatches = ({ newItemName, newItemType }) => {
  const [matches, setMatches] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [error, setError] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError(null);
        const response = await axios.post(`${URL}/match`, {
          username: localStorage.getItem('user')
        });

        // Filter matches to include the new item
        const relevantMatches = response.data.filter(match => {
          if (newItemType === 'outer') return match.outer === newItemName;
          return match[newItemType] === newItemName;
        });

        setMatches(relevantMatches);

        const itemsToFetch = [];
        relevantMatches.forEach(match => {
          ['top', 'bottom', 'outer', 'onepiece'].forEach(key => {
            const name = match[key];
            if (name) {
              const type = key === 'outer' ? 'outer' : key;
              itemsToFetch.push({ type, name });
            }
          });
        });

        const uniqueItems = [...new Set(itemsToFetch.map(i => `${i.type}_${i.name}`))];

        const fetchItem = async ({ type, name }) => {
          try {
            const res = await axios.post(`${URL}/clothing/${type}/${name}`, {
              username: localStorage.getItem('user')
            });
            return { key: `${type}_${name}`, data: res.data };
          } catch {
            return null;
          }
        };

        const fetchedItems = await Promise.all(
          uniqueItems.map(key => {
            const [type, ...nameParts] = key.split('_');
            const name = nameParts.join('_');
            return fetchItem({ type, name });
          })
        );

        const itemMap = {};
        fetchedItems.forEach(entry => {
          if (entry && entry.data && !entry.data.error) {
            itemMap[entry.key] = entry.data;
          }
        });

        setItemDetails(itemMap);
      } catch {
        setError('Failed to fetch new matches');
      }
    };

    fetchMatches();
  }, [newItemName, newItemType]);

  const handleDeleteSuccess = (id) => {
    setMatches(prev => prev.filter(match => match._id !== id));
  };

  const handleUpdateSuccess = (updatedMatch) => {
    setMatches(prev => prev.map(m => (m._id === updatedMatch._id ? updatedMatch : m)));
  };

  const handleError = (msg) => {
    setError(msg);
  };

  const renderItemImage = (type, name) => {
    if (!name) return null;
    const lookupType = type === 'outer' ? 'outer' : type;
    const item = itemDetails[`${lookupType}_${name}`];

    if (item?.imageUrl) {
      return (
        <div className="match-image-wrapper">
          <img
            src={item.imageUrl}
            alt={`${type}-${name}`}
            className="match-image"
          />
        </div>
      );
    }
    return null;
  };

  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <div className="view-matches-container">
      <h3>New Outfits for {newItemName}</h3>

      {error && <p className="error-text">{error}</p>}
      {matches.length === 0 && !error && (
        <p className="no-matches-text">No new matches found.</p>
      )}

      <div className="matches-grid">
        {matches.filter(match => !match.rejected).map(match => (
          <div key={match._id} className="match-card">
            <div className="match-images">
              {renderItemImage('top', match.top)}
              {renderItemImage('bottom', match.bottom)}
              {renderItemImage('outer', match.outer)}
              {renderItemImage('onepiece', match.onepiece)}
            </div>

            <div className="match-info">
              <div className="item-info">
                <div>{match.min_temp}° - {match.max_temp}°</div>
                <div>
                  {
                    ['spring', 'summer', 'autumn', 'winter']
                      .filter(season => match[season])
                      .map(capitalize)
                      .join(', ') || 'N/A'
                  }
                </div>
              </div>

              <div className="button-row">
                <DeleteMatches
                  matchId={match._id}
                  onDeleteSuccess={handleDeleteSuccess}
                  onError={handleError}
                />
                <button className="text-button" onClick={() => setEditingMatch(match)}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingMatch && (
        <UpdateMatches
          match={editingMatch}
          onClose={() => setEditingMatch(null)}
          onUpdateSuccess={handleUpdateSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default ViewNewMatches;
