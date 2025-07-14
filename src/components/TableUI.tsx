// src/components/TableUI.tsx

import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

interface TableUIProps {
    // We will define props here later when passing actual data
    hourlyData?: { time: string[], temperature_2m: number[], wind_speed_10m: number[], relative_humidity_2m: number[], apparent_temperature: number[] };
    hourlyUnits?: { temperature_2m: string, wind_speed_10m: string, relative_humidity_2m: string, apparent_temperature: string };
}

export default function TableUI(props: TableUIProps) {
    const { hourlyData, hourlyUnits } = props;

    // Default empty data for initialization
    let rows: GridRowsProp = [];
    let columns: GridColDef[] = [
        { field: 'time', headerName: 'Hora', width: 150 },
        { field: 'temperature_2m', headerName: 'Temp. (2m)', width: 120, type: 'number' },
        { field: 'wind_speed_10m', headerName: 'Viento (10m)', width: 120, type: 'number' },
        { field: 'relative_humidity_2m', headerName: 'Humedad Rel.', width: 140, type: 'number' },
        { field: 'apparent_temperature', headerName: 'Temp. Aparente', width: 150, type: 'number' },
    ];

    if (hourlyData && hourlyUnits) {
        // Map hourly data to DataGrid rows
        rows = hourlyData.time.map((time, index) => ({
            id: time, // Use time as a unique ID for each row
            time: new Date(time).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
            temperature_2m: hourlyData.temperature_2m[index],
            wind_speed_10m: hourlyData.wind_speed_10m[index],
            relative_humidity_2m: hourlyData.relative_humidity_2m[index],
            apparent_temperature: hourlyData.apparent_temperature[index],
        }));

        // Adjust column headers to include units
        columns = [
            { field: 'time', headerName: 'Hora', width: 150 },
            { field: 'temperature_2m', headerName: `Temp. (2m) (${hourlyUnits.temperature_2m})`, width: 150, type: 'number' },
            { field: 'wind_speed_10m', headerName: `Viento (10m) (${hourlyUnits.wind_speed_10m})`, width: 150, type: 'number' },
            { field: 'relative_humidity_2m', headerName: `Humedad Rel. (${hourlyUnits.relative_humidity_2m})`, width: 150, type: 'number' },
            { field: 'apparent_temperature', headerName: `Temp. Aparente (${hourlyUnits.apparent_temperature})`, width: 160, type: 'number' },
        ];
    }


    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Pronóstico Horario
            </Typography>
            {hourlyData ? (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5 },
                        },
                    }}
                    disableRowSelectionOnClick
                />
            ) : (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    No hay datos de pronóstico horario disponibles.
                </Typography>
            )}
        </Box>
    );
}