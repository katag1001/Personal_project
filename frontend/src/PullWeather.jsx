import React, { useEffect, useState } from 'react';
import { useGeolocation } from "@uidotdev/usehooks";

export default function TodayClothes() {
  const location = useGeolocation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const STORAGE_KEY = 'weather_cache';

  // Helper to check if the stored date is today
  const isToday = (dateString) => {
    const today = new Date();
    const storedDate = new Date(dateString);
    return (
      today.getFullYear() === storedDate.getFullYear() &&
      today.getMonth() === storedDate.getMonth() &&
      today.getDate() === storedDate.getDate()
    );
  };

  // 👇 Helper to get the current season
  const getSeason = () => {
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

    if ([8, 9, 10].includes(month)) return "autumn";   // Sep, Oct, Nov
    if ([11, 0, 1].includes(month)) return "winter";   // Dec, Jan, Feb
    if ([2, 3, 4].includes(month)) return "spring";    // Mar, Apr, May
    if ([5, 6, 7].includes(month)) return "summer";    // Jun, Jul, Aug

    return "unknown";
  };

  const season = getSeason();

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      const fetchWeather = async () => {
        try {
          // Check localStorage
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date && isToday(parsed.date)) {
              setWeather(parsed.weather);
              return;
            }
          }

          // Fetch fresh data
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
          const response = await fetch(url);
          const data = await response.json();

          if (data && data.daily) {
            const weatherData = {
              min: data.daily.temperature_2m_min[0],
              max: data.daily.temperature_2m_max[0],
            };

            setWeather(weatherData);

            // Save to localStorage
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
  }, [location]);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ marginBottom: '1.5rem' }}>
        {location.loading && <p>Loading location... (please enable location permissions)</p>}
        {location.error && <p style={{ color: 'red' }}>Unable to access location: {location.error.message}</p>}
        {location && location.latitude && location.longitude && (
          <div>
            <p>
              Latitude: <strong>{location.latitude}</strong><br />
              Longitude: <strong>{location.longitude}</strong>
            </p>
            {weather ? (
              <p>
                <strong>Today's Weather:</strong><br />
                Min Temperature: {weather.min}°C<br />
                Max Temperature: {weather.max}°C
              </p>
            ) : (
              !error && <p>Loading weather...</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* 👇 Season display */}
            <p><strong>Season:</strong> {season}</p>
          </div>
        )}
      </section>
    </div>
  );
}
