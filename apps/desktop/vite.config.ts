import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Quan trọng cho Electron khi build file tĩnh
  server: {
    port: 5174,
    strictPort: true
  }
});
