import styles from './GalleryCard.module.css';
import { Link } from 'react-router-dom';

export default function GalleryCard({ galleryItem }) {
  const {
    id,
    gallery_name: name,
    gallery_image: image,
    gallery_address: address,
    gallery_start_time: startTime,
    gallery_end_time: endTime,
  } = galleryItem;

  const formatTime = (time) => {
    if (time) {
      const parsedTime = time.slice(0, 5);
      return parsedTime;
    }
  };

  return (
    <div className={styles.layout}>
      <Link className={styles.linkContainer} to={`/galleries/${id}`}>
        <img
          className={styles.galleryImage}
          src={image}
          alt={`${name} 대표 이미지`}
        />
        <div className={styles.infoContainer}>
          <h3 className={styles.galleryTitle}>{name}</h3>
          <p className={styles.addressParagraph}>{address}</p>
          <p className={styles.addressParagraph}>
            {formatTime(startTime)} ~ {formatTime(endTime)}
          </p>
        </div>
      </Link>
    </div>
  );
}
