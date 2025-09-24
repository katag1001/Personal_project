import React, { useState, useEffect } from 'react';

const App = () => {
  const [items, setItems] = useState({
    tops: [],
    bottoms: [],
    outerwear: [],
    onepieces: [],
    matches: [],
  });
  const [activeTab, setActiveTab] = useState('tops');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Define the colors and styles based on user requirements
  const colorPalettes = [
    ["navy", "soft white", "warm gray", "sage green", "dusty rose"],
    ["navy", "warm gray", "sage green", "mustard", "terracotta"],
    ["warm gray", "sage green", "mustard", "terracotta", "cream"],
    ["sage green", "mustard", "terracotta", "cream", "dusty rose"]
  ];
  const allColors = [...new Set(colorPalettes.flat())];
  const styles = ["plain", "patterned"];

  // Fetch all data from the API endpoints
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = ['top', 'bottom', 'outerwear', 'onepiece'];
      const itemPromises = endpoints.map(type => fetch(`http://localhost:4444/api/clothing/${type}`).then(res => res.json()));
      const matchPromise = fetch('http://localhost:4444/api/match').then(res => res.json());

      const [tops, bottoms, outerwear, onepieces, matches] = await Promise.all([...itemPromises, matchPromise]);

      setItems({
        tops: tops || [],
        bottoms: bottoms || [],
        outerwear: outerwear || [],
        onepieces: onepieces || [],
        matches: matches || [],
      });

      setStatusMessage('');
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setStatusMessage('Failed to load data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission to create a new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      type: formData.get('type'),
      colors: formData.getAll('colors'),
      styles: formData.getAll('styles'),
      min_temp: parseInt(formData.get('min_temp')),
      max_temp: parseInt(formData.get('max_temp')),
      spring: !!formData.get('spring'),
      summer: !!formData.get('summer'),
      autumn: !!formData.get('autumn'),
      winter: !!formData.get('winter'),
    };

    try {
      const response = await fetch('http://localhost:4444/api/clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatusMessage('Item created successfully!');
        form.reset();
        await fetchData(); // Refresh data to show the new item
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.error || 'Failed to create item'}`);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      setStatusMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Render the list of items for the active tab
  const renderItems = () => {
    const activeData = items[activeTab];
    if (!activeData || activeData.length === 0) {
      return <p className="text-center text-gray-500">No items to display.</p>;
    }

    // Determine card content based on tab
    return activeData.map((item) => (
      <div key={item._id} className="bg-white rounded-xl shadow-md p-4 space-y-2">
        {activeTab !== 'matches' ? (
          <>
            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600"><span className="font-semibold">Type:</span> {item.type}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Colors:</span> {item.colors.join(', ')}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Styles:</span> {item.styles.join(', ')}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Temp:</span> {item.min_temp}\u00B0C to {item.max_temp}\u00B0C</p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-800">Match</h3>
            <p className="text-sm text-gray-600"><span className="font-semibold">Top:</span> {item.top || 'N/A'}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Bottom:</span> {item.bottom || 'N/A'}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Outerwear:</span> {item.outer || 'N/A'}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">One-piece:</span> {item.onepiece || 'N/A'}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Temp:</span> {item.min_temp}\u00B0C to {item.max_temp}\u00B0C</p>
          </>
        )}
        <p className="text-sm text-gray-600"><span className="font-semibold">Seasons:</span> {[
          item.spring && 'Spring',
          item.summer && 'Summer',
          item.autumn && 'Autumn',
          item.winter && 'Winter',
        ].filter(Boolean).join(', ')}</p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Clothing & Match App</h1>
          <hr className="border-t-2 border-gray-200 mb-6" />

          {/* Form to Create a New Clothing Item */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Create a New Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <div className="mt-1 flex space-x-4">
                    {['top', 'bottom', 'outerwear', 'onepiece'].map(type => (
                      <label key={type} className="inline-flex items-center">
                        <input type="radio" name="type" value={type} required className="form-radio text-indigo-600" />
                        <span className="ml-2 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Colors */}
                <div>
                  <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors</label>
                  <select id="colors" name="colors" multiple required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border h-24">
                    {allColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
                </div>
                {/* Styles */}
                <div>
                  <label htmlFor="styles" className="block text-sm font-medium text-gray-700">Styles</label>
                  <select id="styles" name="styles" multiple required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                    {styles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Min Temp */}
                <div>
                  <label htmlFor="min_temp" className="block text-sm font-medium text-gray-700">Min Temp (\u00B0C)</label>
                  <input type="number" id="min_temp" name="min_temp" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
                {/* Max Temp */}
                <div>
                  <label htmlFor="max_temp" className="block text-sm font-medium text-gray-700">Max Temp (\u00B0C)</label>
                  <input type="number" id="max_temp" name="max_temp" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
              </div>

              {/* Seasons Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Seasons</label>
                <div className="mt-1 flex space-x-4">
                  {['spring', 'summer', 'autumn', 'winter'].map(season => (
                    <label key={season} className="inline-flex items-center">
                      <input type="checkbox" name={season} value="true" className="form-checkbox rounded text-indigo-600" />
                      <span className="ml-2 capitalize">{season}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                  {loading ? 'Creating...' : 'Create Item'}
                </button>
              </div>
            </form>
            {statusMessage && <p className={`mt-4 text-center text-sm ${statusMessage.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{statusMessage}</p>}
          </div>

          <hr className="border-t-2 border-gray-200 mb-6" />

          {/* Tabbed Navigation and Content */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">View All Items</h2>
            <div className="flex space-x-2 border-b-2 border-gray-200 mb-4 overflow-x-auto">
              {['tops', 'bottoms', 'outerwear', 'onepieces', 'matches'].map(tab => (
                <button
                  key={tab}
                  className={`tab-button flex-shrink-0 px-4 py-2 text-gray-500 transition duration-150 ease-in-out ${activeTab === tab ? 'active border-b-2 border-indigo-600 text-indigo-600 font-semibold' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Display Cards */}
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {renderItems()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
