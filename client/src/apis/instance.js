import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const mapInstance = axios.create({
  baseURL: '',
  headers: {
    Accept: 'application/json',
    'x-ncp-apigw-api-key-id	': import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
    'x-ncp-apigw-api-key': import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET,
  },
  withCredentials: true,
});

export const userInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
  },
  withCredentials: true,
});

userInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
