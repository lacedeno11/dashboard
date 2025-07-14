// src/components/ChartUI.tsx

import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

interface ChartUIProps {
    // We will define props here later when passing actual data
    hourlyData?: { time: string[], temperature_2m: number[], wind_speed_10m: number[] };
    hourlyUnits?: { temperature_2m: string, wind_speed_10m: string };
}

export default function ChartUI(props: ChartUIProps) {
    const { hourlyData, hourlyUnits } = props;

    // Filter data for the next 24 hours for better chart readability
    const chartTime = hourlyData?.time.slice(0, 24).map(t => new Date(t).getHours() + 'h') || [];
    const chartTemperature = hourlyData?.temperature_2m.slice(0, 24) || [];
    const chartWindSpeed = hourlyData?.wind_speed_10m.slice(0, 24) || [];

    if (!hourlyData || chartTime.length === 0) {
        return (
            <Box sx={{ height: 400, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Gráfico de Pronóstico Horario
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    No hay datos de pronóstico horario para mostrar en el gráfico.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Gráfico de Pronóstico Horario (Próx. 24h)
            </Typography>
            <LineChart
                xAxis={[{
                    scaleType: 'band',
                    data: chartTime,
                    label: 'Hora',
                    tickLabelStyle: { angle: 45, textAnchor: 'start' }
                }]}
                series={[
                    {
                        data: chartTemperature,
                        label: `Temp. (${hourlyUnits?.temperature_2m || '°C'})`,
                        valueFormatter: (value: number) => `${value} ${hourlyUnits?.temperature_2m || '°C'}`
                    },
                    {
                        data: chartWindSpeed,
                        label: `Viento (${hourlyUnits?.wind_speed_10m || 'km/h'})`,
                        valueFormatter: (value: number) => `${value} ${hourlyUnits?.wind_speed_10m || 'km/h'}`
                    }
                ]}
                height={300}
                margin={{ left: 60, right: 60, top: 40, bottom: 80 }}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'top', horizontal: 'middle' },
                        padding: 0
                    },
                }}
            />
        </Box>
    );
}
