import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Disable source maps
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  }
});
