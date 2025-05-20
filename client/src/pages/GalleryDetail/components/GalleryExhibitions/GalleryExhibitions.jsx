import styles from './GalleryExhibitions.module.css';
import { Link } from 'react-router-dom';

export default function GalleryExhibitions({ exhibitions }) {
  return (
    <section className={styles.exhibitionSection}>
      <div className={styles.exhibitionTypeContainer}>진행중인 전시</div>
      {!exhibitions || exhibitions.length === 0 ? (
        <div>진행중인 전시회가 없습니다</div>
      ) : (
        <ul className={styles.exhibitionItemList}>
          {exhibitions.map(
            ({
              id,
              exhibition_poster: poster,
              exhibition_title: title,
              exhibition_start_date: startDate,
              exhibition_end_date: endDate,
            }) => (
              <Link
                className={styles.exhibitionItemContainer}
                key={id}
                to={`/exhibitions/${id}`}
              >
                <img
                  className={styles.exhibitionImage}
                  src={poster}
                  alt='전시회 대표 이미지'
                />
                <span className={styles.titleSpan}>{title}</span>
                <span>
                  {startDate} - {endDate}
                </span>
              </Link>
            ),
          )}
        </ul>
      )}
    </section>
  );
}
