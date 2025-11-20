import styles from './GalleryMapModal.module.css';
import { useEffect, useState } from 'react';
import useGeoLocation from '../../../../../Nearby/hooks/useGeoLocation';
import useMap from '../../../../../Nearby/hooks/useMap';
import { userInstance } from '../../../../../../apis/instance';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function GalleryMapModal({ onOpen }) {
  const { coords } = useGeoLocation();
  const { lat, lng } = coords;
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likedOnly, setLikedOnly] = useState(false);
  const navigate = useNavigate();

  const mapInstance = useMap({
    lat,
    lng,
    id: 'gallery-map',
    results,
    zoomLevel: 12,
  });

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !window.naver?.maps) return;

    const getGalleriesInBounds = async () => {
      try {
        setIsLoading(true);
        const bounds = map.getBounds();
        const sw = bounds.getSW();
        const ne = bounds.getNE();

        const params = {
          latitude: ne.lat(),
          longitude: ne.lng(),
        };

        if (likedOnly) {
          params.liked_only = 1;
        }

        const response = await userInstance.get('/api/galleries', { params });
        setResults(response.data);
      } catch (error) {
        console.error('갤러리 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const listener = naver.maps.Event.addListener(
      map,
      'idle',
      getGalleriesInBounds,
    );

    // 초기 로드
    getGalleriesInBounds();

    return () => {
      if (listener) {
        naver.maps.Event.removeListener(listener);
      }
    };
  }, [mapInstance, likedOnly]);

  const handleFav = () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
      return;
    }
    setLikedOnly((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>주변 갤러리 지도</div>
          <button
            className={`${styles.favButton} ${likedOnly && styles.clickedFavButton}`}
            onClick={handleFav}
          >
            <FaStar className={`${likedOnly && styles.clickedIcon}`} />
            관심 갤러리
          </button>
        </div>
        {isLoading && (
          <div className={styles.loadingText}>갤러리 데이터 조회 중...</div>
        )}
        <div className={styles.modalMap} id='gallery-map' />
        <button className={styles.closeButton} onClick={onOpen}>
          닫기
        </button>
      </div>
    </div>
  );
}
