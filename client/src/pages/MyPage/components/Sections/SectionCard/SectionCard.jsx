import React from 'react';
import styles from './SectionCard.module.css';

export default function SectionCard({ item, onQR, onCancel, onGoDetail }) {
  if (!item) return null;

  const {
    exhibition_poster: img,
    exhibition_title: title = '제목 정보 없음',
    exhibition_location: location = '장소 정보 없음',
    exhibition_start_date: startDate = '',
    exhibition_end_date: endDate = '',
    exhibition_status: status,
    session_id: reservationId = '예약번호 없음',
    reservation_datetime: reservationDate,
  } = item;

  const date =
    startDate && endDate ? `${startDate} ~ ${endDate}` : reservationDate;

  const statusMap = {
    scheduled: { label: '관람신청', className: styles.scheduled },
    exhibited: { label: '관람완료', className: styles.exhibited },
    closed: { label: '취소', className: styles.closed },
  };

  const statusLabel = statusMap[status]?.label || '알 수 없음';
  const statusClass = statusMap[status]?.className || '';

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imgContainer}>
        <img src={img} alt={title} className={styles.image} />
      </div>

      <div className={styles.contents}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.info}>
          {location}
          <br />
          {date}
          <br />
          예약번호: {reservationId}
        </p>

        <div className={styles.statusContainer}>
          <span className={`${styles.statusValue} ${statusClass}`}>
            {statusLabel}
          </span>

          <div className={styles.action}>
            <button className={styles.btn} onClick={onGoDetail}>
              전시정보
            </button>

            {status === 'scheduled' && (
              <>
                <button className={styles.btn} onClick={onQR}>
                  관람확인
                </button>
                <button className={styles.cancel} onClick={onCancel}>
                  취소
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
