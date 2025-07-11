// src/DataFetcher.tsx

import React, { useState, useEffect } from 'react';

interface DataFetcherProps {
  coordinates: { latitude: number; longitude: number } | null;
}

interface WeatherData {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
  };
}

const DataFetcher: React.FC<DataFetcherProps> = ({ coordinates }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coordinates) {
      const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        try {
          const { latitude, longitude } = coordinates;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Error al obtener los datos del clima.');
          }
          const data: WeatherData = await response.json();
          setWeatherData(data);

        } catch (err) {
            if (err instanceof Error) {
               setError(err.message);
            } else {
               setError("Ocurrió un error desconocido");
            }
        } finally {
          setLoading(false);
        }
      };

      fetchWeatherData();
    }
  }, [coordinates]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!weatherData) return <p>Selecciona una ciudad para ver el pronóstico.</p>;

  return (
    <div>
      <h2>Pronóstico del tiempo</h2>
      <p><strong>Ubicación:</strong> Latitud {weatherData.latitude}, Longitud {weatherData.longitude}</p>
      <p><strong>Temperatura:</strong> {weatherData.current.temperature_2m}°C</p>
      <p><strong>Velocidad del viento:</strong> {weatherData.current.wind_speed_10m} km/h</p>
    </div>
  );
};

export default DataFetcher;
