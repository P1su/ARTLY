import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // 네이버 지도 API 프록시
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
