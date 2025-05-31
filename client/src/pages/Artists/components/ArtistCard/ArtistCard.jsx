import styles from './ArtistCard.module.css';
import { Link } from 'react-router-dom';

export default function ArtistCard({ artistItem }) {
  const { id, name, field, imageUrl, nation } = artistItem;

  return (
    <Link className={styles.layout} to={`/artists/${id}`}>
      <img
        className={styles.artistImage}
        src={imageUrl}
        alt='작가 대표 이미지'
      />
      <h3 className={styles.artistNameTitle}>{name}</h3>
      <p className={styles.subParagraph}>
        {field} | {nation}
      </p>
    </Link>
  );
}
