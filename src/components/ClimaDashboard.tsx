import { consultarClima } from "../utils/CohereAssistant";
import { useState } from "react";

export default function ClimaDashboard() {
  const [ubicacion, setUbicacion] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [humedad, setHumedad] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarConsulta = async () => {
    setCargando(true);
    setError('');
    setRespuesta('');

    try {
      const temp = parseFloat(temperatura);
      const hum = parseFloat(humedad);
      if (isNaN(temp) || isNaN(hum)) {
        throw new Error('La temperatura y la humedad deben ser números válidos.');
      }

      const resultado = await consultarClima(ubicacion, temp, hum);
      setRespuesta(resultado);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-xl bg-white max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Asistente del Clima</h2>
      <input
        type="text"
        placeholder="Ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Temperatura (°C)"
        value={temperatura}
        onChange={(e) => setTemperatura(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Humedad (%)"
        value={humedad}
        onChange={(e) => setHumedad(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={manejarConsulta}
        disabled={cargando}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {cargando ? 'Consultando...' : 'Consultar'}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {respuesta && (
        <div className="bg-gray-100 p-4 rounded mt-4 whitespace-pre-line">
          {respuesta}
        </div>
      )}
    </div>
  );
}