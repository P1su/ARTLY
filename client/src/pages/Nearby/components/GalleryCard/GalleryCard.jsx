import styles from './GalleryCard.module.css';
import { Link } from 'react-router-dom';

export default function GalleryCard({ galleryItem }) {
  const { id, name, image, address } = galleryItem;
  return (
    <div className={styles.layout}>
      <Link to={`/galleries/${id}`}>
        <img
          className={styles.galleryImage}
          src={image}
          alt={`${name} 대표 이미지`}
        />
        <div className={styles.infoContainer}>
          <h3 className={styles.galleryTitle}>{name}</h3>
          <p className={styles.addressParagraph}>{address}</p>
        </div>
      </Link>
    </div>
  );
}
