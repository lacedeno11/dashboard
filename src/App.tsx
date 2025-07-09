import { Grid } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';

function App() {
return (
<Grid container spacing={5} justifyContent="center" alignItems="center">

{/* Encabezado */}
<Grid size = {{ xs: 12, md: 3}}>Elemento: Encabezado<HeaderUI />
</Grid>

{/* Alerta */}
      <Grid size= {{ xs: 12, md: 3}}container justifyContent="right" alignItems="center">
        <AlertUI config={{ description: "No se preveen lluvias" }} />
      </Grid>
      
{/* Selector */}
<Grid size={{ xs: 12, md: 3 }}>
        <SelectorUI /></Grid>

{/* Indicadores */}
<Grid size={{ xs: 12, md: 9 }}>Elemento: Indicadores</Grid>

{/* Gráfico */}
<Grid>Elemento: Gráfico</Grid>

{/* Tabla */}
<Grid>Elemento: Tabla</Grid>

{/* Información adicional */}
<Grid>Elemento: Información adicional</Grid>

</Grid>
);
}

export default App;
