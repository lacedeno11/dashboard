// src/App.tsx

import { useState } from 'react';
import './App.css';
import SelectorUI from './SelectorUI';
import DataFetcher from './DataFetcher';
import IndicatorUI from './components/IndicatorUI';
import TableUI from './components/TableUI'; // Nuevo
import ChartUI from './components/ChartUI'; // Nuevo
import { Container, Box, Typography, Grid } from '@mui/material';
import ClimaDashboard from './components/ClimaDashboard';




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

  // Consumir el hook DataFetcher
  const { data, loading, error } = DataFetcher({ coordinates: selectedCoords });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Dashboard del Clima
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Selector de Ciudad */}
        <Grid item xs={12} md={3}>
          <SelectorUI onCityChange={handleCityChange} />
        </Grid>
        {/* Contenedor principal para indicadores, gráfico y tabla */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {/* Renderizado condicional de los datos obtenidos */}
            {loading && (
              <Grid item xs={12}>
                <Typography variant="h6" align="center">Cargando datos...</Typography>
              </Grid>
            )}
            {error && (
              <Grid item xs={12}>
                <Typography variant="h6" color="error" align="center">Error: {error}</Typography>
              </Grid>
            )}
            {data && (
              <>
                {/* Indicadores en una fila */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <IndicatorUI
                        title='Temperatura (2m)'
                        description={data.current.temperature_2m + " " + data.current_units.temperature_2m}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <IndicatorUI
                        title='Temperatura aparente'
                        description={data.current.apparent_temperature + " " + data.current_units.apparent_temperature}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <IndicatorUI
                        title='Velocidad del viento'
                        description={data.current.wind_speed_10m + " " + data.current_units.wind_speed_10m}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <IndicatorUI
                        title='Humedad relativa'
                        description={data.current.relative_humidity_2m + " " + data.current_units.relative_humidity_2m}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Gráfico en fila completa */}
                <Grid item xs={12}>
                  <ChartUI
                    hourlyData={data.hourly}
                    hourlyUnits={data.hourly_units}
                  />
                </Grid>
                {/* Tabla en fila completa */}
                <Grid item xs={12}>
                  <TableUI
                    hourlyData={data.hourly}
                    hourlyUnits={data.hourly_units}
                  />
                </Grid>
              </>
            )}
            {!loading && !error && !data && (
              <Grid item xs={12}>
                <Typography variant="h6" align="center">Selecciona una ciudad para ver el pronóstico.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <ClimaDashboard />
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Datos meteorológicos proporcionados por Open-Meteo.
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
