import React from 'react';
import styles from './SectionCard.module.css';
import { useNavigate } from 'react-router-dom';

export default function SectionCard({ item, type }) {
  const navigate = useNavigate();

  if (!item) {
    return null;
  }

  const {
    id,
    exhibition_poster: img,
    exhibition_title: title = '제목 정보 없음',
    exhibition_location: location = '장소 정보 없음',
    exhibition_start_date: startDate = '',
    exhibition_end_date: endDate = '',
    exhibition_status: statusValue,
    session_id: reservationSessionId,
  } = item;

  const date =
    startDate && endDate ? `${startDate} ~ ${endDate}` : '날짜 정보 없음';

  const status =
    statusValue === 'scheduled'
      ? '전시 전'
      : statusValue === 'exhibited'
        ? '전시 중'
        : '마감';

  const handleNavigateDetail = () => {
    navigate(`/reservation/detail/${reservationSessionId}`, { state: item });
  };

  const handleNavigateExhibition = () => {
    navigate(`/exhibitions/${id}`, { state: item });
  };

  return (
    <div className={styles.cardContainer} onClick={handleNavigateExhibition}>
      <img src={img} alt={title} className={styles.image} />
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.location}>{location}</div>
        <div className={styles.date}>{date}</div>
        <div
          className={`${styles.btn} ${
            status === '마감'
              ? styles.closed
              : status === '전시 전'
                ? styles.upcoming
                : styles.ongoing
          }`}
        >
          {status}
        </div>

        {type === 'reservation' && (
          <button
            onClick={handleNavigateDetail}
            className={`${styles.btn} ${styles.confirmBtn}`}
          >
            예매 확인
          </button>
        )}
      </div>
    </div>
  );
}
