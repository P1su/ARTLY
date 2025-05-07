import styles from './ArtistActivity.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockArtistDetail } from '../../mock/mockArtistDetail.js';

export default function ArtistActivity() {
  const [activity, setActivity] = useState('artworks');
  const { artworks, exhibitions } = mockArtistDetail;

  const handleActivity = () => {
    activity === 'artworks'
      ? setActivity('exhibitions')
      : setActivity('artworks');
  };

  return (
    <section className={styles.activitySection}>
      <div className={styles.activityTypeContainer}>
        <div
          className={
            activity === 'artworks'
              ? styles.activedActivityTypeBox
              : styles.activityTypeBox
          }
          onClick={handleActivity}
        >
          작품
        </div>
        <div
          className={
            activity === 'exhibitions'
              ? styles.activedActivityTypeBox
              : styles.activityTypeBox
          }
          onClick={handleActivity}
        >
          전시
        </div>
      </div>
      <ul className={styles.activityItemList}>
        {activity === 'artworks'
          ? artworks.map(
              ({
                artworkId,
                artworkImage,
                artworkTitle,
                artworkDescription,
                artworkDetail,
              }) => (
                <div className={styles.activityItemContainer} key={artworkId}>
                  <ActivityDetail
                    image={artworkImage}
                    title={artworkTitle}
                    mainContent={artworkDescription}
                    subContent={artworkDetail}
                  />
                </div>
              ),
            )
          : exhibitions.map(
              ({
                exhibitionId,
                exhibitionImage,
                exhibitionTitle,
                exhibitionAddress,
                exhibitionDate,
              }) => (
                <Link
                  className={styles.activityItemContainer}
                  key={exhibitionId}
                  to={`/exhibitions/${exhibitionId}`}
                >
                  <ActivityDetail
                    image={exhibitionImage}
                    title={exhibitionTitle}
                    mainContent={exhibitionAddress}
                    subContent={exhibitionDate}
                  />
                </Link>
              ),
            )}
      </ul>
    </section>
  );
}

function ActivityDetail({ image, title, mainContent, subContent }) {
  return (
    <>
      <img className={styles.activityImage} src={image} />
      <span className={styles.titleSpan}>{title}</span>
      <span>{mainContent}</span>
      <span>{subContent}</span>
    </>
  );
}
