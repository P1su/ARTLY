import styles from './Nearby.module.css';
import { useState } from 'react';
import useGeoLocation from './hooks/useGeoLocation';
import useMap from './hooks/useMap';
import { mapInstance } from '../../apis/instance.js';
import NearbyGalleries from './components/NearbyGalleries/NearbyGalleries';

export default function Nearby() {
  const { coords, setCoords } = useGeoLocation();
  const { lat, lng } = coords;
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useMap(lat, lng);

  const getGeocode = async (e) => {
    e.preventDefault();

    try {
      const response = await mapInstance.get('/v2/geocode', {
        params: {
          query: query,
        },
      });
      const newLng = response.data.addresses[0].x;
      const newLat = response.data.addresses[0].y;

      setCoords({
        lat: newLat,
        lng: newLng,
      });
    } catch (error) {
      console.error(error);
      alert('올바른 주소값을 입력해주세요');
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
      <NearbyGalleries lat={lat} lng={lng} />
    </div>
  );
}
