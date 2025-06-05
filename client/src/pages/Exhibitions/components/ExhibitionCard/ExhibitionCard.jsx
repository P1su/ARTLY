import styles from './ExhibitionCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaHeart, FaLocationDot } from 'react-icons/fa6';
import { userInstance } from '../../../../apis/instance.js';
import MapModal from '../MapModal/MapModal';

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
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsOpen((prev) => !prev);
    document.body.style.overflow = 'unset';
  };

  const handleLike = async () => {
    !localStorage.getItem('ACCESS_TOKEN') && navigate('/login');
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
    }
  };

  return (
    <>
      {isOpen && <MapModal item={exhibitionItem} onClose={handleClose} />}
      <Link className={styles.layout} to={`/exhibitions/${id}`}>
        <div className={styles.imageBox}>
          <img
            className={styles.exhibitionImage}
            src={poster || '/placeholder.jpg'}
            alt='전시 대표 이미지'
          />
          <div className={styles.buttonField}>
            <button
              className={styles.iconButton}
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
            <button
              className={styles.iconButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpen();
              }}
            >
              <FaLocationDot className={styles.icLoc} />
            </button>
          </div>
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
    </>
  );
}
