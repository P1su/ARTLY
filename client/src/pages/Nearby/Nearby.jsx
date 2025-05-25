import styles from './Nearby.module.css';
import { useEffect } from 'react';

export default function Nearby() {
  useEffect(() => {
    if (!window.naver) {
      return;
    }
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
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
