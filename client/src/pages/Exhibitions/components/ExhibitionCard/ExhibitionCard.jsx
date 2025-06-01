import styles from './ExhibitionCard.module.css';
import { Link } from 'react-router-dom';

export default function ExhibitionCard({ exhibitionItem }) {
  const {
    id,
    exhibition_title,
    exhibition_category,
    exhibition_poster,
    exhibition_location,
    exhibition_start_date,
    exhibition_end_date,
  } = exhibitionItem;

  return (
    <Link className={styles.layout} to={`/exhibitions/${id}`}>
      <img
        className={styles.exhibitionImage}
        src={exhibition_poster || '/placeholder.jpg'}
        alt='전시 대표 이미지'
      />
      <h3 className={styles.exhibitionTitle}>{exhibition_title}</h3>
      <p className={styles.subParagraph}>
        {exhibition_category} | {exhibition_location || '장소 미정'}
      </p>
      <p className={styles.subParagraph}>
        {exhibition_start_date} ~ {exhibition_end_date}
      </p>
    </Link>
  );
}
