import { CohereClient } from 'cohere-ai';

// Crea una instancia del cliente Cohere
const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

const MAX_CALLS_PER_MINUTE = 5;
let callTimestamps: number[] = [];

function checkRateLimit() {
  const now = Date.now();
  callTimestamps = callTimestamps.filter(t => now - t < 60_000);
  if (callTimestamps.length >= MAX_CALLS_PER_MINUTE) {
    throw new Error("Límite de llamadas a la API alcanzado. Intenta más tarde.");
  }
  callTimestamps.push(now);
}

/**
 * Consulta recomendaciones climáticas usando Cohere Chat API.
 * @param ubicacion Ubicación geográfica
 * @param temperatura Temperatura en °C
 * @param humedad Porcentaje de humedad
 * @returns Respuesta generada por Cohere o mensaje de error
 */
export async function consultarClima(
  ubicacion: string,
  temperatura: number,
  humedad: number
): Promise<string> {
  try {
    checkRateLimit();

    const message = `Soy un asistente del clima. Estoy en ${ubicacion}. La temperatura es de ${temperatura}°C y la humedad es de ${humedad}%. ¿Qué recomendaciones puedes dar?`;

    const response = await cohere.chat({
      model: "command-r-plus", // o "command-r" si no tienes acceso a "plus"
      message,
      temperature: 0.7,
    });

    // La nueva respuesta tiene un `.text` directamente
    return response.text || "No se obtuvo una respuesta válida.";
  } catch (error: any) {

    
    return `Error: ${error.message || "Error desconocido."}`;
  }

}

