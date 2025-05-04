import React from 'react';
import styles from './SectionCard.module.css';

export default function SectionCard({ item, type }) {
  const { imageUrl, title, location, date, status } = item;
  console.log(type);
  return (
    <div className={styles.cardContainer}>
      <img src={imageUrl} alt={title} className={styles.image} />
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

        {type === 'reservation' ? (
          <button className={`${styles.btn} ${styles.confirmBtn}`}>
            예매 확인
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
