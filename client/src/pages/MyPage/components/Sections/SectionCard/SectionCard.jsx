import React from 'react';
import styles from './SectionCard.module.css';
import { useNavigate } from 'react-router-dom';

export default function SectionCard({ item, type }) {
  const navigate = useNavigate();
  const {
    exhibition_poster,
    exhibition_title,
    exhibition_location,
    exhibition_start_date,
    exhibition_end_date,
    exhibition_status,
  } = item;

  const imageUrl = `${import.meta.env.VITE_SERVER_URL}/images/${exhibition_poster}`;
  const date = `${exhibition_start_date} ~ ${exhibition_end_date}`;
  const status =
    exhibition_status === 'scheduled'
      ? '전시 전'
      : exhibition_status === 'exhibited'
        ? '전시 중'
        : '마감';

  const reservationId = item.session_id;
  const handleNavigate = () => {
    navigate(`/reservation/detail/${reservationId}`, { state: item });
  };

  return (
    <div className={styles.cardContainer}>
      <img src={imageUrl} alt={exhibition_title} className={styles.image} />
      <div className={styles.info}>
        <div className={styles.title}>{exhibition_title}</div>
        <div className={styles.location}>{exhibition_location}</div>
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
            onClick={handleNavigate}
            className={`${styles.btn} ${styles.confirmBtn}`}
          >
            예매 확인
          </button>
        )}
      </div>
    </div>
  );
}
