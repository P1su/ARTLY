import styles from './Nearby.module.css';
import { useState } from 'react';
import useGeoLocation from './hooks/useGeoLocation';
import useMap from './hooks/useMap';
import axios from 'axios';

export default function Nearby() {
  const { lat, lng } = useGeoLocation();
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useMap(lat, lng);

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
      <form className={styles.searchForm} onSubmit={getGeocode}>
        <input
          className={styles.searchInput}
          value={query}
          onChange={handleChange}
          placeholder='주소를 입력해주세요'
        />
      </form>
      <div id='map' className={styles.galleryWrapper} />
      <section className={styles.searchResultSection}>
        <h2 className={styles.searchTitle}>주변 갤러리 목록</h2>
        <div>검색 결과가 없습니다.</div>
      </section>
    </div>
  );
}
