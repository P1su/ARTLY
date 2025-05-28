import styles from './GalleryCard.module.css';
import { Link } from 'react-router-dom';

export default function GalleryCard({ results }) {
  const { id, name, image } = results;
  return (
    <Link className={styles.layout} to={`/galleries/${id}`}>
      <img
        className={styles.galleryImage}
        src={image}
        alt={`${name} 대표 이미지`}
      />
      <div className={styles.infoContainer}>
        <h3 className={styles.galleryTitle}>{name}</h3>
      </div>
    </Link>
  );
}
