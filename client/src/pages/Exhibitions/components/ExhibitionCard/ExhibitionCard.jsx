import styles from './ExhibitionCard.module.css';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa6';
import { userInstance } from '../../../../apis/instance.js';

export default function ExhibitionCard({ exhibitionItem, onEvent }) {
  const {
    id,
    exhibition_title: title,
    exhibition_category: category,
    exhibition_poster: poster,
    exhibition_location: location,
    exhibition_start_date: startDate,
    exhibition_end_date: endDate,
    is_liked: isLike,
  } = exhibitionItem;

  const handleLike = async () => {
    try {
      if (isLike === true) {
        await userInstance.delete('/api/likes', {
          data: {
            liked_id: id,
            liked_type: 'exhibition',
          },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: id,
          liked_type: 'exhibition',
        });
      }

      await onEvent();
    } catch (error) {
      console.error(error);
      alert('좋아요 처리 실패');
    }
  };

  return (
    <Link className={styles.layout} to={`/exhibitions/${id}`}>
      <div className={styles.imageBox}>
        <img
          className={styles.exhibitionImage}
          src={poster || '/placeholder.jpg'}
          alt='전시 대표 이미지'
        />
        <button
          className={styles.favButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLike();
          }}
        >
          <FaHeart
            className={`${styles.icHeart} ${isLike === true && styles.isClicked} `}
          />
        </button>
        <button>지도</button>
      </div>
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
