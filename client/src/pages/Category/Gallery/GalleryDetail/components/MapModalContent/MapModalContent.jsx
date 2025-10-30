import useMap from '../../../../../Nearby/hooks/useMap';
import styles from './MapModalContent.module.css';

export default function MapModalContent({ galleryData }) {
  const {
    id,
    gallery_name: name,
    gallery_address: address,
    gallery_latitude: lat,
    gallery_longitude: lng,
  } = galleryData;

  // useMap Hook은 이 컴포넌트가 렌더링될 때만 안전하게 호출됩니다.
  useMap({ lat, lng, id: `gallery-${id}-map`, title: name, location: address });

  return (
    <>
      <h3>{name}</h3>
      <p>{galleryData.gallery_name_en || 'Gallery Name'}</p>
      <div id={`gallery-${id}-map`} className={styles.galleryMap} />
    </>
  );
}
