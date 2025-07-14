// src/DataFetcher.tsx

import { useState, useEffect } from 'react';
import type { OpenMeteoResponse } from './types/DashboardTypes'; // Import as type. Adjusted path to local.

interface DataFetcherProps {
    coordinates: { latitude: number; longitude: number } | null;
}

const DataFetcher = (props: DataFetcherProps) => {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!props.coordinates) {
                setData(null);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const { latitude, longitude } = props.coordinates;
                // URL de la API de Open-Meteo con datos horarios y unidades específicas
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }

                const result: OpenMeteoResponse = await response.json();
                setData(result);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error desconocido durante la obtención de datos.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [props.coordinates]);

    return { data, loading, error };
};

export default DataFetcher;
