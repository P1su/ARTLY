import styles from './ArtistDetail.module.css';
import { mockArtistDetail } from './mock/mockArtistDetail.js';
import BtnFavorite from '../ExhibitionDetail/components/BtnFavorite/BtnFavorite'; //추후 확장 및 수정 예정
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

export default function ArtistDetail() {
  const { educations, careers, artworks, exhibitions } = mockArtistDetail;
  const [activity, setActivity] = useState('artworks');
  const { artistId } = useParams();
  console.log(artistId);

  const handleActivity = () => {
    activity === 'artworks'
      ? setActivity('exhibitions')
      : setActivity('artworks');
  };

  return (
    <div className={styles.layout}>
      <section className={styles.infoSection}>
        <img src={mockArtistDetail.artistImage} />
        <span className={styles.titleSpan}>{mockArtistDetail.artistName}</span>
        <span className={styles.subSpan}>
          {mockArtistDetail.artistCategory}
        </span>
        <BtnFavorite />
      </section>
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
                    <img className={styles.activityImage} src={artworkImage} />
                    <span className={styles.titleSpan}>{artworkTitle}</span>
                    <span>{artworkDescription}</span>
                    <span>{artworkDetail}</span>
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
                    <img
                      className={styles.activityImage}
                      src={exhibitionImage}
                    />
                    <span className={styles.titleSpan}>{exhibitionTitle}</span>
                    <span>{exhibitionAddress}</span>
                    <span>{exhibitionDate}</span>
                  </Link>
                ),
              )}
        </ul>
      </section>
    </div>
  );
}
