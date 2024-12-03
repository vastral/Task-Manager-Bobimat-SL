import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Carpeta donde se generarán los archivos de producción
  },
  server: {
    fs: {
      strict: false, // Permite servir archivos fuera de la raíz del proyecto si es necesario
    },
  },
  base: './', // Asegúrate de que la base esté configurada para rutas relativas
});

