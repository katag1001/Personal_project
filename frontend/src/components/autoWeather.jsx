import React, { useEffect, useState } from 'react';
import { useGeolocation } from "@uidotdev/usehooks";

const AutoWeather = () => {
  const location = useGeolocation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [message, setMessage] = useState(null);
  const STORAGE_KEY = 'weather_cache';

  const isToday = (dateString) => {
    const today = new Date();
    const storedDate = new Date(dateString);
    return (
      today.getFullYear() === storedDate.getFullYear() &&
      today.getMonth() === storedDate.getMonth() &&
      today.getDate() === storedDate.getDate()
    );
  };

  const getSeason = () => {
    const month = new Date().getMonth();
    if ([2, 3, 4].includes(month)) return "spring";
    if ([5, 6, 7].includes(month)) return "summer";
    if ([8, 9, 10].includes(month)) return "autumn";
    if ([11, 0, 1].includes(month)) return "winter";
    return "unknown";
  };

  const season = getSeason();

  const triggerCreateToday = async (min, max, season) => {
    try {
      console.log('[AutoWeather] Sending weather to backend:', { min, max, season });

      const response = await fetch('/api/today/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          min_temp_today: min,
          max_temp_today: max,
          season_today: season,
        }),
      });

      const result = await response.json();
      console.log('[AutoWeather] Response from /api/today/create:', result);
      return result;
    } catch (err) {
      console.error('[AutoWeather] Error calling backend /api/today/create:', err);
      return null;
    }
  };

  const fetchTodayOutfits = async () => {
    try {
      const response = await fetch('/api/today/get');
      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data)) {
          setOutfits(data);
          setMessage(null);
        } else if (data.message) {
          setOutfits([]);
          setMessage(data.message);
        } else {
          setOutfits([]);
          setMessage('Unexpected response format from outfits API.');
        }
      } else {
        setOutfits([]);
        setMessage(data.message || 'Failed to fetch outfits.');
      }
    } catch (err) {
      setOutfits([]);
      setMessage('Error fetching outfits: ' + err.message);
    }
  };

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      const fetchWeatherAndOutfits = async () => {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date && isToday(parsed.date)) {
              console.log('[AutoWeather] Using cached weather for today.');
              setWeather(parsed.weather);

              // Even if weather is cached, fetch outfits to show current state
              await fetchTodayOutfits();
              return;
            }
          }

          const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
          const response = await fetch(url);
          const data = await response.json();

          if (data && data.daily) {
            const weatherData = {
              min: data.daily.temperature_2m_min[0],
              max: data.daily.temperature_2m_max[0],
            };

            setWeather(weatherData);

            localStorage.setItem(STORAGE_KEY, JSON.stringify({
              date: new Date().toISOString(),
              weather: weatherData,
            }));

            // Wait for createToday to finish before fetching outfits
            const createResult = await triggerCreateToday(weatherData.min, weatherData.max, season);

            if (createResult && createResult.success) {
              await fetchTodayOutfits();
            } else {
              setMessage(createResult?.message || 'Failed to create today outfits.');
            }
          }
        } catch (err) {
          console.error('[AutoWeather] Weather fetch error:', err);
          setError('Failed to fetch weather data.');
        }
      };

      fetchWeatherAndOutfits();
    }
  }, [location]);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ marginBottom: '1.5rem' }}>
        {location.loading && <p>Loading location... (please enable location permissions)</p>}
        {location.error && (
          <p style={{ color: 'red' }}>
            Unable to access location: {location.error.message}
          </p>
        )}

        {location && location.latitude && location.longitude && (
          <div>
            <p>
              <strong>Location:</strong><br />
              Latitude: {location.latitude}<br />
              Longitude: {location.longitude}
            </p>

            {weather ? (
              <p>
                <strong>Today's Weather:</strong><br />
                Min Temp: {weather.min}°C<br />
                Max Temp: {weather.max}°C
              </p>
            ) : (
              !error && <p>Loading weather...</p>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p><strong>Season:</strong> {season}</p>

            <section>
              <h2>Today's Outfits</h2>
              {message && <p>{message}</p>}
              {!message && outfits.length === 0 && <p>No outfits saved for today.</p>}
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {outfits.map((outfit, index) => (
                  <li
                    key={outfit._id || index}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: 8,
                      padding: '1rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    {outfit.image_url && (
                      <img
                        src={outfit.image_url}
                        alt={outfit.name || 'Outfit'}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                      />
                    )}
                    <div>
                      <h3 style={{ margin: 0 }}>{outfit.name || 'Unnamed Outfit'}</h3>
                      <p style={{ margin: '0.2rem 0' }}>
                        Min Temp: {outfit.min_temp}°C | Max Temp: {outfit.max_temp}°C | Rank: {outfit.rank}
                      </p>
                      <p style={{ margin: 0 }}>
                        Seasons: {['spring', 'summer', 'autumn', 'winter']
                          .filter(season => outfit[season])
                          .join(', ')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </section>
    </div>
  );
};

export default AutoWeather;
