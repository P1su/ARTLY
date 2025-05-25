import styles from './Nearby.module.css';
import { useEffect, useState } from 'react';
import useGeoLocation from './hooks/useGeoLocation';
import axios from 'axios';

export default function Nearby() {
  const { lat, lng } = useGeoLocation();
  const [query, setQuery] = useState('');
  console.log(lat, lng);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (!window.naver) {
      return;
    }
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
      zoom: 15,
    });
  });

  const getGeocode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('/v2/geocode', {
        headers: {
          Accept: 'application/json',
          'x-ncp-apigw-api-key-id	': import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
          'x-ncp-apigw-api-key': import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET,
        },
        params: {
          query: query,
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
      alert('불러오는 중 오류가 발생했습니다');
    }
  };

  return (
    <div className={styles.layout}>
      <p>주변 갤러리 찾기 페이지,,,</p>
      <form onSubmit={getGeocode}>
        <input value={query} onChange={handleChange} />
      </form>
      <div id='map' className={styles.galleryWrapper} />
    </div>
  );
}
