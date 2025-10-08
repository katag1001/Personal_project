import React, { useEffect, useState } from 'react'; 
import { useGeolocation } from "@uidotdev/usehooks";
import './AutoWeather.css';

const AutoWeather = () => {
  const location = useGeolocation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
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

  const triggerCreateToday = async (min, max, season) => {
    try {
      const response = await fetch('/api/today/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          min_temp_today: min,
          max_temp_today: max,
          season_today: season,
          username: localStorage.getItem('user')  
        }),
      });
      return await response.json();
    } catch (err) {
      console.error('[AutoWeather] Error calling /api/today/create:', err);
      return null;
    }
  };

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      const fetchWeather = async () => {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date && isToday(parsed.date)) {
              setWeather(parsed.weather);
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

            await triggerCreateToday(weatherData.min, weatherData.max, getSeason());
          }
        } catch (err) {
          setError('Failed to fetch weather data.');
          console.error(err);
        }
      };

      fetchWeather();
    }
  }, [location]);

  return (
    <div className="weather">
      {location.loading && (
        <p className="weather-text">Loading location... (please enable location permissions)</p>
      )}
      {location.error && (
        <p className="weather-error">Unable to access location: {location.error.message}</p>
      )}
      {weather ? (
        <>
          <p className="weather-text">{getSeason().charAt(0).toUpperCase() + getSeason().slice(1)}</p>
          <p className="weather-text">{weather.min}°C - {weather.max}°C</p>
        </>
      ) : (
        !error && <p className="weather-text">Loading weather...</p>
      )}
      {error && <p className="weather-error">{error}</p>}
    </div>
  );
};

export default AutoWeather;
