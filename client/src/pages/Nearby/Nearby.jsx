import styles from './Nearby.module.css';
import { useState, useEffect } from 'react';
import useGeoLocation from './hooks/useGeoLocation';
import useMap from './hooks/useMap';
import { mapInstance, userInstance } from '../../apis/instance.js';
import NearbyGalleries from './components/NearbyGalleries/NearbyGalleries';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import { useAlert } from '../../store/AlertProvider.jsx';

export default function Nearby() {
  const { coords, setCoords } = useGeoLocation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { lat, lng } = coords;
  const [query, setQuery] = useState('');

  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useMap({ lat, lng, id: 'nearby-map', results, zoomLevel: 12 });

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
      showAlert('올바른 주소값을 입력해주세요');
    }
  };

  const getNaerbyGalleries = async () => {
    try {
      setIsLoading(true);

      const response = await userInstance.get('/api/galleries', {
        params: {
          latitude: lat,
          longitude: lng,
          distance: 5000,
        },
      });

      setResults(response.data);
    } catch (error) {
      console.error(error);
      showAlert('주변 갤러리를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNaerbyGalleries();
  }, [lat, lng]);

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>주변 갤러리 찾기</h1>
      <form className={styles.searchForm} onSubmit={getGeocode}>
        <input
          className={styles.searchInput}
          value={query}
          onChange={handleChange}
          placeholder='주소를 입력해주세요(시,군/구/동 단위)'
        />
      </form>
      <div id='nearby-map' className={styles.galleryWrapper} />
      {isLoading && <LoadingSpinner />}
      <NearbyGalleries results={results} onEvent={getNaerbyGalleries} />
    </div>
  );
}
