import axios from 'axios';

export const instance = axios.create({
  baseURL: '', // 서버 주소 작성 예정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
