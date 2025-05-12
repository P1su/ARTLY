import styles from './Galleries.module.css';
import { mockGalleryList } from './mock/mockGalleryList.js';
import { Link } from 'react-router-dom';

export default function Galleries() {
  return (
    <div className={styles.layout}>
      {mockGalleryList.map(
        ({
          galleryId,
          galleryImage,
          galleryName,
          galleryAddress,
          operatingHours,
        }) => (
          <Link
            className={styles.galleryItemContainer}
            key={galleryId}
            to={`/galleries/${galleryId}`}
          >
            <img
              className={styles.galleryItemImage}
              src={galleryImage}
              alt='갤러리 대표 이미지'
            />
            <div className={styles.galleryInfoContainer}>
              <span className={styles.titleSpan}>{galleryName}</span>
              <span>{galleryAddress}</span>
              <span>{operatingHours}</span>
            </div>
          </Link>
        ),
      )}
    </div>
  );
}
