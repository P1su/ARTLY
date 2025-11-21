import { useEffect } from 'react';
import styles from '../components/MapModalSimple.module.css';
import useMap from '../../../../Nearby/hooks/useMap';

export default function MapModalSimple({
  lat,
  lng,
  title,
  address,
  mapId,
  onClose,
}) {
  useMap({
    lat,
    lng,
    id: mapId,
    title,
    location: address,
  });
  console.log('MapModalSimple 렌더됨!', mapId);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.mapModalBox}>
        <h3 className={styles.mapModalTitle}>{title}</h3>
        <p className={styles.mapModalSubTitle}>{address}</p>

        <div id={mapId} className={styles.mapModalMap} />

        <button className={styles.mapModalClose} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
