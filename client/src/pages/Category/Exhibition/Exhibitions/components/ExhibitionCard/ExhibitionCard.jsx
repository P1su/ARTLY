import styles from './ExhibitionCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userInstance } from '../../../../../../apis/instance.js';
import { getExhibitionStatus } from '../../../utils/getExhibitionStatus.js';
import MapModal from '../MapModal/MapModal';
import IcFav from './../../../../../../assets/svg/IcFav';
import IcUnFav from './../../../../../../assets/svg/IcUnFav';
import IcLocation from './../../../../../../assets/svg/IcLocation';

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

  const exhibitionStatus = getExhibitionStatus(startDate, endDate);

  const statusLabel =
    exhibitionStatus === 'ongoing'
      ? '전시 중'
      : exhibitionStatus === 'upcoming'
        ? '전시 예정'
        : '전시 종료';

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
    <div className={styles.exhibitionCardLayout}>
      {isOpen && <MapModal item={exhibitionItem} onClose={handleClose} />}
      <Link className={styles.layout} to={`/exhibitions/${id}`}>
        <div
          className={`${styles.statusContainer} ${exhibitionStatus === 'ongoing' && styles.ongoing}`}
        >
          {statusLabel}
        </div>
        <div className={styles.imageBox}>
          <img
            className={styles.exhibitionImage}
            src={poster || '/placeholder.jpg'}
            alt='전시 대표 이미지'
          />
        </div>
        <button
          className={styles.favButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLike();
          }}
        >
          {isLike ? <IcFav /> : <IcUnFav />}
        </button>
        <button
          className={styles.locButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpen();
          }}
        >
          <IcLocation />
        </button>
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
    </div>
  );
}
