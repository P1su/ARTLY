import styles from './ArtistActivity.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockArtistDetail } from '../../mock/mockArtistDetail.js';

export default function ArtistActivity({ description }) {
  const [activity, setActivity] = useState('artworks');
  const { educations, careers, artworks, exhibitions } = mockArtistDetail;
  console.log(artworks);
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
            <section className={styles.descriptionSection}>
              <span className={styles.titleSpan}>학력</span>
              {educations.map((education) => (
                <span key={education}>{education}</span>
              ))}
            </section>
            <section className={styles.descriptionSection}>
              <span className={styles.titleSpan}>이력</span>
              {careers.map((career) => (
                <span key={career}>{career}</span>
              ))}
            </section>
          </div>
        ) : activity === 'artworks' ? (
          artworks.length === 0 ? (
            <div>작업한 작품이 없습니다</div>
          ) : (
            artworks.map(
              ({ artworkId, artworkImage, artworkTitle, date, field }) => (
                <div className={styles.activityItemContainer} key={artworkId}>
                  <img className={styles.artworkImage} src={artworkImage} />
                  <h3 className={styles.activityItemTitle}>{artworkTitle}</h3>
                  <span className={styles.activityItemSpan}>
                    {date} | {field}
                  </span>
                </div>
              ),
            )
          )
        ) : exhibitions.length === 0 ? (
          <div>참여 중인 전시회가 없습니다</div>
        ) : (
          exhibitions.map(
            ({
              exhibitionId,
              exhibitionImage,
              exhibitionTitle,
              exhibitionDate,
            }) => (
              <Link
                className={styles.activityItemContainer}
                key={exhibitionId}
                to={`/exhibitions/${exhibitionId}`}
              >
                <img
                  className={styles.activityImage}
                  src={exhibitionImage}
                  alt='대표 이미지'
                />
                <div className={styles.activityItemInfoBox}>
                  <h3 className={styles.activityItemTitle}>
                    {exhibitionTitle}
                  </h3>
                  <span className={styles.activityItemSpan}>
                    | {exhibitionDate}
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
