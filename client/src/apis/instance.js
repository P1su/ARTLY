import axios from 'axios';
import Cookies from 'js-cookie';

const JWT_Token = 'ACCESS_TOKEN';

//기본 API 요청용 (인증 없음)
export const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//네이버 지도 API
export const mapInstance = axios.create({
  baseURL: '',
  headers: {
    Accept: 'application/json',
    'x-ncp-apigw-api-key-id	': import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
    'x-ncp-apigw-api-key': import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET,
  },
  withCredentials: true,
});

/*인증 필요한 API용 (JWT 토큰 자동 첨부)
인터셉터로 매 요청마다 쿠키에서 토큰을 꺼내 'Authorization' 헤더에 자동 추가.
*/
export const userInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

userInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(JWT_Token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
