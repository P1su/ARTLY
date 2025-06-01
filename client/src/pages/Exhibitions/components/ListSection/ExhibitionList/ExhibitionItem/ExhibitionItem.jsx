import styles from './ExhibitionItem.module.css';
import { useNavigate } from 'react-router-dom';

export default function ExhibitionItem({ data, isLiked, toggleLike }) {
  const navigate = useNavigate();

  const {
    id,
    exhibition_poster: image,
    exhibition_title: title,
    exhibition_category: category,
    exhibition_start_date: startDateStr,
    exhibition_end_date: endDateStr,
    exhibition_location: location,
  } = data;

  const now = new Date();
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isEnded = endDate < now;

  const badgeText = isOngoing
    ? '전시중'
    : isEnded
    ? '종료'
    : isUpcoming
    ? '예정'
    : '';

  const badgeClass = isOngoing
    ? styles.badgeOngoing
    : isEnded
    ? styles.badgeEnded
    : styles.badgeUpcoming;

  return (
    <div className={styles.exhibitionItemContainer} onClick={() => navigate(`/exhibitions/${id}`)}>
      <div className={styles.imageWrapper}>
        <img className={styles.exhibitionImage} src={image} alt='전시회 대표 이미지' />

        {badgeText && (
          <span className={`${styles.statusBadge} ${badgeClass}`}>
            {badgeText}
          </span>
        )}

        <span
          className={`${styles.heartIcon} ${isLiked ? styles.active : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(id);
          }}
        >
          ♥
        </span>
      </div>

      <span className={styles.titleSpan}>{title}</span>
      <span className={styles.subSpan}>{category}</span>
      <span className={styles.subSpan}>📍 {location || '알 수 없음'}</span>
      <span className={styles.subSpan}>
        {startDateStr} ~ {endDateStr}
      </span>
    </div>
  );
}
