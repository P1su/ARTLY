import React from 'react';
import styles from './SectionCard.module.css';

export default function SectionCard({
  item,
  onQR,
  onCancel,
  onGoDetail,
  onReservation,
  type,
}) {
  if (!item) return null;

  const renderLike = () => {
    const { likeType } = item;

    let image = '';
    let title = '';
    let description = '';
    let imageRound = styles.image;

    if (likeType === 'exhibition') {
      image = item.exhibition_poster;
      title = item.exhibition_title;
      description = `${item.exhibition_location}<br />${item.exhibition_start_date} ~ ${item.exhibition_end_date}`;
    } else if (likeType === 'gallery') {
      image = item.gallery_image;
      title = item.gallery_name;
      description = item.gallery_address;
    } else if (likeType === 'artist') {
      image = item.artist_image;
      title = item.artist_name;
      description = `${item.artist_category} / ${item.artist_nation}`;
      imageRound = styles.artistImage;
    } else {
      return null;
    }

    return (
      <div onClick={onGoDetail} className={styles.cardContainer}>
        <div className={styles.imgContainer}>
          <img
            src={image}
            alt={title}
            className={`${styles.image} ${imageRound}`}
          />
        </div>
        <div className={styles.contents}>
          <h3 className={styles.title}>{title}</h3>
          <p
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    );
  };

  const renderReservation = () => {
    const {
      exhibition_poster: exhibitionImg,
      exhibition_title: exhibitionTitle = '제목 정보 없음',
      exhibition_location: exhibitionLocation = '장소 정보 없음',
      reservation_status: reservationStatus = '',
      id: reservationId = '예약번호 없음',
      reservation_datetime: reservationDate,
    } = item;

    const statusMap = {
      reserved: { label: '관람신청', className: styles.statusReserved },
      used: { label: '관람완료', className: styles.statusCompleted },
      canceled: { label: '취소', className: styles.statusCanceled },
    };

    const statusLabel = statusMap[reservationStatus]?.label || '알 수 없음';
    const statusClass = statusMap[reservationStatus]?.className || '';

    return (
      <div className={styles.cardContainer} onClick={onReservation}>
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
            {reservationDate.split(' ')[0]}
            <br />
            예약번호: {reservationId}
          </p>

          <div className={styles.statusContainer}>
            <span className={statusClass}>{statusLabel}</span>

            <div className={styles.action}>
              <button
                className={styles.btn}
                onClick={(e) => {
                  e.stopPropagation();
                  onGoDetail();
                }}
              >
                {' '}
                전시정보
              </button>

              {reservationStatus === 'reserved' && (
                <>
                  <button
                    className={styles.btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQR(item.exhibition_id);
                    }}
                  >
                    관람확인
                  </button>
                  <button
                    className={styles.cancel}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel();
                    }}
                  >
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
      bookDetail,
      book_poster: bookImg,
      create_dtm: bookCreatedDate = '',
    } = item;

    const {
      book: { book_title: bookTitle = '제목 정보 없음' } = {},
      exhibition: {
        exhibition_location: exhibitionLocation = '전시 장소 정보 없음',
      } = {},
      gallery: { gallery_name: galleryName = '갤러리 정보 없음' } = {},
      exhibition: { exhibition_start_date: exhibitionStartDate = '' } = {},
      exhibition: { exhibition_end_date: exhibitionEndDate = '' } = {},
    } = bookDetail?.book || {};

    const exhibitionPeriod =
      exhibitionStartDate && exhibitionEndDate
        ? `${exhibitionStartDate} ~ ${exhibitionEndDate}`
        : '';

    const formattedDate = bookCreatedDate
      ? new Date(bookCreatedDate).toISOString().slice(0, 10)
      : '';

    return (
      <div onClick={onGoDetail} className={styles.cardContainer}>
        <div className={styles.imgContainer}>
          <img src={bookImg} alt={bookTitle} className={styles.image} />
        </div>
        <div className={styles.contents}>
          <h3 className={styles.title}>{bookTitle}</h3>
          <p className={styles.info}>
            {galleryName} / {exhibitionLocation}
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
