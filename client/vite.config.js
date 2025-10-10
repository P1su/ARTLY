import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// 프록시 해결하면 원상 복구

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
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
