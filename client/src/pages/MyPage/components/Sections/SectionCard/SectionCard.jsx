import React from 'react';
import styles from './SectionCard.module.css';

export default function SectionCard({
  item,
  onQR,
  onCancel,
  onGoDetail,
  type,
}) {
  if (!item) return null;

  const renderLike = () => {
    // like 타입 UI 예시 (필요에 맞게 커스터마이징)
    const {
      likeImg = '/default_like_img.jpg',
      likeTitle = '좋아요한 항목',
      likeDescription = '',
    } = item;

    return (
      <div className={styles.likeCardContainer}>
        <img src={likeImg} alt={likeTitle} className={styles.likeImage} />
        <div className={styles.likeContent}>
          <h3 className={styles.likeTitle}>{likeTitle}</h3>
          <p className={styles.likeDescription}>{likeDescription}</p>
        </div>
      </div>
    );
  };

  const renderReservation = () => {
    const {
      exhibition_poster: exhibitionImg,
      exhibition_title: exhibitionTitle = '제목 정보 없음',
      exhibition_location: exhibitionLocation = '장소 정보 없음',
      exhibition_start_date: exhibitionStartDate = '',
      exhibition_end_date: exhibitionEndDate = '',
      exhibition_status: exhibitionStatus = '',
      session_id: sessionId = '예약번호 없음',
      reservation_datetime: reservationDate = '',
    } = item;

    const date =
      exhibitionStartDate && exhibitionEndDate
        ? `${exhibitionStartDate} ~ ${exhibitionEndDate}`
        : reservationDate;

    const statusMap = {
      scheduled: { label: '관람신청', className: styles.scheduled },
      exhibited: { label: '관람완료', className: styles.exhibited },
      closed: { label: '취소', className: styles.closed },
    };

    const statusLabel = statusMap[exhibitionStatus]?.label || '알 수 없음';
    const statusClass = statusMap[exhibitionStatus]?.className || '';

    return (
      <div className={styles.cardContainer}>
        <div className={styles.imgContainer}>
          <img
            src={exhibitionImg}
            alt={exhibitionTitle}
            className={styles.image}
          />
        </div>

        <div className={styles.contents}>
          <h3 className={styles.title}>{exhibitionTitle}</h3>
          <p className={styles.info}>
            {exhibitionLocation}
            <br />
            {date}
            <br />
            예약번호: {sessionId}
          </p>

          <div className={styles.statusContainer}>
            <span className={`${styles.statusValue} ${statusClass}`}>
              {statusLabel}
            </span>

            <div className={styles.action}>
              <button className={styles.btn} onClick={onGoDetail}>
                전시정보
              </button>

              {exhibitionStatus === 'scheduled' && (
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
  };

  const renderCatalog = () => {
    const {
      book_poster: bookImg,
      book_title: bookTitle = '제목 정보 없음',
      gallery = '갤러리 정보 없음',
      city = '도시 정보 없음',
      region = '지역 정보 없음',
      exhibition_start_date: exhibitionStartDate = '',
      exhibition_end_date: exhibitionEndDate = '',
      create_dtm: bookCreatedDate = '',
    } = item;

    const exhibitionPeriod =
      exhibitionStartDate && exhibitionEndDate
        ? `${exhibitionStartDate} ~ ${exhibitionEndDate}`
        : '';

    // 날짜 포맷 (YYYY-MM-DD)
    const formattedDate = bookCreatedDate
      ? new Date(bookCreatedDate).toISOString().slice(0, 10)
      : '';

    return (
      <div className={styles.cardContainer}>
        <div className={styles.imgContainer}>
          <img src={bookImg} alt={bookTitle} className={styles.image} />
        </div>
        <div className={styles.contents}>
          <h3 className={styles.title}>{bookTitle}</h3>
          <p className={styles.info}>
            {gallery} / {city} / {region}
            <br />
            {exhibitionPeriod}
          </p>
          <p className={styles.catalogRegisteredDate}>
            등록일: {formattedDate}
          </p>
        </div>
      </div>
    );
  };

  switch (type) {
    case 'like':
      return renderLike();
    case 'reservation':
      return renderReservation();
    case 'catalog':
      return renderCatalog();

    default:
      return null;
  }
}
