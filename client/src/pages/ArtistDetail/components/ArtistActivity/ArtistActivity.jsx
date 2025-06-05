import styles from './ArtistActivity.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ArtistActivity({ description, artworks, exhibitions }) {
  const [activity, setActivity] = useState('profile');

  const handleActivity = (activityType) => {
    setActivity(activityType);
  };

  return (
    <section className={styles.activitySection}>
      <div className={styles.activityTypeContainer}>
        <button
          className={
            activity === 'profile'
              ? styles.activedActivityTypeBox
              : styles.activityTypeBox
          }
          onClick={() => {
            handleActivity('profile');
          }}
        >
          프로필
        </button>
        <button
          className={
            activity === 'exhibitions'
              ? styles.activedActivityTypeBox
              : styles.activityTypeBox
          }
          onClick={() => {
            handleActivity('exhibitions');
          }}
        >
          전시
        </button>
        <button
          className={
            activity === 'artworks'
              ? styles.activedActivityTypeBox
              : styles.activityTypeBox
          }
          onClick={() => {
            handleActivity('artworks');
          }}
        >
          작품
        </button>
      </div>
      <div className={styles.activityItemList}>
        {activity === 'profile' ? (
          <div>
            <p className={styles.descriptionParagraph}>{description}</p>
          </div>
        ) : activity === 'artworks' ? (
          artworks && artworks.length === 0 ? (
            <div>작업한 작품이 없습니다</div>
          ) : (
            artworks?.map(({ id, imageUrl, title }) => (
              <div className={styles.activityItemContainer} key={id}>
                <img className={styles.artworkImage} src={imageUrl} />
                <h3 className={styles.activityItemTitle}>{title}</h3>
              </div>
            ))
          )
        ) : exhibitions && exhibitions.length === 0 ? (
          <div>참여 중인 전시회가 없습니다</div>
        ) : (
          exhibitions?.map(
            ({
              id,
              exhibition_poster: poster,
              exhibition_title: title,
              exhibition_start_date: startDate,
              exhibition_end_date: endDate,
            }) => (
              <Link
                className={styles.activityItemContainer}
                key={id}
                to={`/exhibitions/${id}`}
              >
                <img
                  className={styles.activityImage}
                  src={poster}
                  alt='대표 이미지'
                />
                <div className={styles.activityItemInfoBox}>
                  <h3 className={styles.activityItemTitle}>{title}</h3>
                  <span className={styles.activityItemSpan}>
                    | {startDate} ~ {endDate}
                  </span>
                </div>
              </Link>
            ),
          )
        )}
      </div>
    </section>
  );
}
