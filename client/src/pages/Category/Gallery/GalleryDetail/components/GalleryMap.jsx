import useMap from '../../../../Nearby/hooks/useMap';
import styles from '../GalleryDetail.module.css';

export default function GalleryMap({ galleryData }) {
  const {
    id,
    gallery_name: name,
    gallery_address: address,
    gallery_latitude: lat,
    gallery_longitude: lng,
  } = galleryData;

  useMap({ lat, lng, id: `gallery-${id}-map`, title: name, location: address });

  return (
    <div className={styles.mapContainer}>
      <h3 className={styles.mapTitle}>찾아오시는 길</h3>
      <div id={`gallery-${id}-map`} className={styles.galleryMap} />
    </div>
  );
}
