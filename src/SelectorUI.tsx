// src/SelectorUI.tsx

import React from 'react';

const cities = {
  'Guayaquil': { latitude: -2.1962, longitude: -79.8862 },
  'Quito': { latitude: -0.2298, longitude: -78.5250 },
  'Cuenca': { latitude: -2.9005, longitude: -79.0055 },
};

interface SelectorUIProps {
  onCityChange: (coords: { latitude: number; longitude: number }) => void;
}

const SelectorUI: React.FC<SelectorUIProps> = ({ onCityChange }) => {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = event.target.value;
    const cityData = cities[selectedCity as keyof typeof cities];
    if (cityData) {
      onCityChange(cityData);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="city-selector">Elige una ciudad: </label>
      <select id="city-selector" onChange={handleChange}>
        <option value="">--Selecciona una ciudad--</option>
        {Object.keys(cities).map(city => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectorUI;
