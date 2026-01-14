import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      legacy({
        targets: ['defaults', 'not IE 11', 'iOS >= 12'],
      }),
    ],
    build: {
      target: 'es2015',
    },
    server: {
      proxy: {
        '/v2': {
          target: 'https://maps.apigw.ntruss.com/map-geocode',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});