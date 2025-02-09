import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this to your desired port number
    open: true, // Automatically open browser on server start
    host: true, // Expose to all network interfaces
  },
});
