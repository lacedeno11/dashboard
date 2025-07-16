// src/DataFetcher.tsx

import { useState, useEffect } from 'react';
import type { OpenMeteoResponse } from './types/DashboardTypes'; // Import as type. Adjusted path to local.

interface DataFetcherProps {
    coordinates: { latitude: number; longitude: number } | null;
}

interface CachedData {
    data: OpenMeteoResponse;
    timestamp: number;
    coordinates: { latitude: number; longitude: number };
}

const DataFetcher = (props: DataFetcherProps) => {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Configuración de caché: 15 minutos de vigencia
    const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutos
    const CACHE_KEY = 'weather_data_cache';

    // Función para generar clave única basada en coordenadas
    const generateCacheKey = (lat: number, lon: number): string => {
        return `${CACHE_KEY}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
    };

    // Función para verificar si los datos en caché son válidos
    const isCacheValid = (cachedData: CachedData): boolean => {
        const now = Date.now();
        const isWithinTimeLimit = (now - cachedData.timestamp) < CACHE_DURATION_MS;
        return isWithinTimeLimit;
    };

    // Función para obtener datos del localStorage
    const getCachedData = (lat: number, lon: number): CachedData | null => {
        try {
            const cacheKey = generateCacheKey(lat, lon);
            const cachedItem = localStorage.getItem(cacheKey);
            
            if (!cachedItem) {
                return null;
            }

            const cachedData: CachedData = JSON.parse(cachedItem);
            
            // Verificar si las coordenadas coinciden exactamente
            if (cachedData.coordinates.latitude !== lat || cachedData.coordinates.longitude !== lon) {
                return null;
            }

            // Verificar vigencia de los datos
            if (!isCacheValid(cachedData)) {
                // Eliminar datos expirados
                localStorage.removeItem(cacheKey);
                return null;
            }

            return cachedData;
        } catch (error) {
            console.warn('Error al leer datos del localStorage:', error);
            return null;
        }
    };

    // Función para guardar datos en localStorage
    const setCachedData = (weatherData: OpenMeteoResponse, lat: number, lon: number): void => {
        try {
            const cacheKey = generateCacheKey(lat, lon);
            const cachedData: CachedData = {
                data: weatherData,
                timestamp: Date.now(),
                coordinates: { latitude: lat, longitude: lon }
            };

            localStorage.setItem(cacheKey, JSON.stringify(cachedData));
        } catch (error) {
            console.warn('Error al guardar datos en localStorage:', error);
            // Si el localStorage está lleno, intentar limpiar datos antiguos
            try {
                cleanOldCacheEntries();
                localStorage.setItem(generateCacheKey(lat, lon), JSON.stringify({
                    data: weatherData,
                    timestamp: Date.now(),
                    coordinates: { latitude: lat, longitude: lon }
                }));
            } catch (secondError) {
                console.error('No se pudo guardar en localStorage después de limpiar:', secondError);
            }
        }
    };

    // Función para limpiar entradas antiguas del caché
    const cleanOldCacheEntries = (): void => {
        try {
            const keysToRemove: string[] = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CACHE_KEY)) {
                    try {
                        const cachedItem = localStorage.getItem(key);
                        if (cachedItem) {
                            const cachedData: CachedData = JSON.parse(cachedItem);
                            if (!isCacheValid(cachedData)) {
                                keysToRemove.push(key);
                            }
                        }
                    } catch (parseError) {
                        // Si no se puede parsear, marcar para eliminación
                        keysToRemove.push(key);
                    }
                }
            }

            // Eliminar entradas marcadas
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.warn('Error al limpiar caché antiguo:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!props.coordinates) {
                setData(null);
                setLoading(false);
                setError(null);
                return;
            }

            const { latitude, longitude } = props.coordinates;
            
            // EFICIENCIA: Verificar primero si hay datos válidos en caché
            const cachedData = getCachedData(latitude, longitude);
            
            if (cachedData) {
                console.log('Datos cargados desde localStorage (caché válido)');
                setData(cachedData.data);
                setLoading(false);
                setError(null);
                return;
            }

            // Si no hay caché válido, hacer petición a la API
            setLoading(true);
            setError(null);

            try {
                // URL de la API de Open-Meteo con datos horarios y unidades específicas
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm`;

                console.log('Realizando petición a la API (sin caché válido)');
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }

                const result: OpenMeteoResponse = await response.json();
                
                // EFICIENCIA: Guardar respuesta en localStorage para futuras consultas
                setCachedData(result, latitude, longitude);
                
                setData(result);

            } catch (err) {
                // RESILIENCIA: En caso de error, intentar usar datos en caché aunque estén expirados
                const expiredCachedData = getCachedDataIgnoringExpiration(latitude, longitude);
                
                if (expiredCachedData) {
                    console.log('Error en API, usando datos expirados del caché como respaldo');
                    setData(expiredCachedData.data);
                    setError('Mostrando datos anteriores (sin conexión)');
                } else {
                    // Si no hay datos en caché, mostrar error
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Ocurrió un error desconocido durante la obtención de datos.");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [props.coordinates]);

    // Función auxiliar para obtener datos del caché ignorando la expiración (para resiliencia)
    const getCachedDataIgnoringExpiration = (lat: number, lon: number): CachedData | null => {
        try {
            const cacheKey = generateCacheKey(lat, lon);
            const cachedItem = localStorage.getItem(cacheKey);
            
            if (!cachedItem) {
                return null;
            }

            const cachedData: CachedData = JSON.parse(cachedItem);
            
            // Solo verificar que las coordenadas coincidan, ignorar la vigencia
            if (cachedData.coordinates.latitude !== lat || cachedData.coordinates.longitude !== lon) {
                return null;
            }

            return cachedData;
        } catch (error) {
            console.warn('Error al leer datos expirados del localStorage:', error);
            return null;
        }
    };

    return { data, loading, error };
};

export default DataFetcher;
