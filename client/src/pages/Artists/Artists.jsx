import styles from './Artists.module.css';
import { useState } from 'react';
import { mockArtistList } from './mock/mockArtistList.js';
import { Link } from 'react-router-dom';

export default function Artists() {
  const [isDisplay, setIsDisplay] = useState(false);

  const handleIsDisplay = () => {
    setIsDisplay(!isDisplay);

    //isDisplay 값에 따라 데이터 fetch
    console.log('API 연결');
  };

  return (
    <div className={styles.layout}>
      <section>
        <span
          className={isDisplay ? styles.activedSpan : undefined}
          onClick={handleIsDisplay}
        >
          현재 전시중인 작가
        </span>
        <span> | </span>
        <span
          className={isDisplay ? undefined : styles.activedSpan}
          onClick={handleIsDisplay}
        >
          모든 작가
        </span>
      </section>
      <section className={styles.artistListSection}>
        {mockArtistList.map(
          ({ artistId, artistName, artistImage, artistCategory }) => (
            <Link
              className={styles.artistItemContainer}
              key={artistId}
              to={`/artists/${artistId}`}
            >
              <img
                className={styles.artistImage}
                src={artistImage}
                alt='작가 대표 이미지'
              />
              <span className={styles.titleSpan}>{artistName}</span>
              <span className={styles.subSpan}>{artistCategory}</span>
            </Link>
          ),
        )}
      </section>
    </div>
  );
}
