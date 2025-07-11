// src/App.tsx

import { useState } from 'react';
import './App.css';
import SelectorUI from './SelectorUI';
import DataFetcher from './DataFetcher';

// Definimos el tipo para las coordenadas
type Coordinates = {
  latitude: number;
  longitude: number;
};

function App() {
  // Estado para guardar las coordenadas de la ciudad seleccionada
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(null);

  // Función que se pasará al componente hijo para actualizar el estado del padre
  const handleCityChange = (coords: Coordinates) => {
    setSelectedCoords(coords);
  };

  return (
    <>
      <h1>Dashboard del Clima</h1>
      <div className="card">
        {/* El componente hijo recibe la función para notificar al padre */}
        <SelectorUI onCityChange={handleCityChange} />

        {/* El componente de datos recibe el estado actual para hacer la petición */}
        <DataFetcher coordinates={selectedCoords} />
      </div>
      <p className="read-the-docs">
        Datos meteorológicos proporcionados por Open-Meteo.
      </p>
    </>
  );
}

export default App;
