import styles from './Artists.module.css';
import { useEffect, useState } from 'react';
import artistImage from './mock/mockArtistImage.png';
import { Link } from 'react-router-dom';
import { instance } from '../../apis/instance.js';

export default function Artists() {
  const [isDisplay, setIsDisplay] = useState(false);
  const [artists, setArtists] = useState([]);

  const handleIsDisplay = () => {
    setIsDisplay((prev) => !prev);

    //isDisplay 값에 따라 데이터 fetch
    console.log('API 연결');
  };

  const getArtists = async () => {
    try {
      const response = await instance.get('/api/artist');
      setArtists(response.data);
    } catch {
      throw new Error('API 연결 실패');
    }
  };

  useEffect(() => {
    getArtists();
  }, []);

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
        {artists.map(({ id, name, field, image }) => (
          <Link
            className={styles.artistItemContainer}
            key={id}
            to={`/artists/${id}`}
          >
            <img
              className={styles.artistImage}
              src={image}
              alt='작가 대표 이미지'
            />
            <span className={styles.titleSpan}>{name}</span>
            <span className={styles.subSpan}>{field}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
