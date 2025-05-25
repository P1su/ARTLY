import styles from './Nearby.module.css';
import { useEffect } from 'react';
import useGeoLocation from './hooks/useGeoLocation';

export default function Nearby() {
  const { lat, lng } = useGeoLocation();

  console.log(lat, lng);
  useEffect(() => {
    if (!window.naver) {
      return;
    }
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
      zoom: 10,
    });
  });
  return (
    <div className={styles.layout}>
      <p>주변 갤러리 찾기 페이지,,,</p>
      <div id='map' className={styles.galleryWrapper} />
    </div>
  );
}
