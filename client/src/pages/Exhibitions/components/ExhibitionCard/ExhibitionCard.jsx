import styles from './ExhibitionCard.module.css';
import { Link } from 'react-router-dom';

export default function ExhibitionCard({ exhibitionItem }) {
  const {
    id,
    exhibition_title: title,
    exhibition_category: category,
    exhibition_poster: poster,
    exhibition_location: location,
    exhibition_start_date: startDate,
    exhibition_end_date: endDate,
  } = exhibitionItem;

  return (
    <Link className={styles.layout} to={`/exhibitions/${id}`}>
      <img
        className={styles.exhibitionImage}
        src={poster || '/placeholder.jpg'}
        alt='전시 대표 이미지'
      />
      <div className={styles.infoContainer}>
        <h3 className={styles.exhibitionTitle}>{title}</h3>
        <p className={styles.subParagraph}>
          {category} | {location || '장소 미정'}
        </p>
        <p className={styles.subParagraph}>
          {startDate} ~ {endDate}
        </p>
      </div>
    </Link>
  );
}
