// AutoWeather.jsx
import React, { useEffect, useState } from 'react';
import { useGeolocation } from "@uidotdev/usehooks";

const AutoWeather = ({ setMinTemp, setMaxTemp, setSeason }) => {
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
    if ([8, 9, 10].includes(month)) return "autumn";
    if ([11, 0, 1].includes(month)) return "winter";
    if ([2, 3, 4].includes(month)) return "spring";
    if ([5, 6, 7].includes(month)) return "summer";
    return "unknown";
  };

  useEffect(() => {
    const seasonValue = getSeason();
    setSeason(seasonValue);
  }, [setSeason]);

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      const fetchWeather = async () => {
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date && isToday(parsed.date)) {
              setWeather(parsed.weather);
              setMinTemp(parsed.weather.min);
              setMaxTemp(parsed.weather.max);
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
            setMinTemp(weatherData.min);
            setMaxTemp(weatherData.max);

            localStorage.setItem(STORAGE_KEY, JSON.stringify({
              date: new Date().toISOString(),
              weather: weatherData,
            }));
          }
        } catch (err) {
          console.error("Weather fetch error:", err);
          setError("Failed to fetch weather data.");
        }
      };

      fetchWeather();
    }
  }, [location, setMinTemp, setMaxTemp]);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {location.loading && <p>Loading location...</p>}
      {location.error && <p style={{ color: 'red' }}>Location error: {location.error.message}</p>}
      {weather && (
        <p>
          Auto Weather: {weather.min}°C - {weather.max}°C<br />
          Auto Season: {getSeason()}
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AutoWeather;
