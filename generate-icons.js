// Script para generar iconos simples para la PWA
import fs from 'fs';
import { createCanvas } from 'canvas';

// Función para crear un icono simple
function createIcon(size, color, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fondo
  ctx.fillStyle = '#D3D1D1';
  ctx.fillRect(0, 0, size, size);
  
  // Círculo central
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
  ctx.fill();
  
  // Texto
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size/4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PWA', size/2, size/2);
  
  // Guardar como PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Icono creado: ${outputPath}`);
}

// Crear iconos
createIcon(192, '#3498db', 'public/pwa-192x192.png');
createIcon(512, '#3498db', 'public/pwa-512x512.png');
createIcon(192, '#3498db', 'public/pwa-maskable-192x192.png');
createIcon(512, '#3498db', 'public/pwa-maskable-512x512.png');
createIcon(180, '#3498db', 'public/apple-touch-icon.png');
createIcon(32, '#3498db', 'public/favicon-32x32.png');
createIcon(16, '#3498db', 'public/favicon-16x16.png');

console.log('Todos los iconos han sido generados.');