import styles from './Artists.module.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { instance } from '../../apis/instance.js';
import ListHeader from '../../components/List/ListHeader/ListHeader';
import DropdownContainer from '../../components/List/DropdownContainer/DropdownContainer';
import { artistFilter } from '../../utils/filters/artisFilter.js';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [isFav, setIsFav] = useState(false);

  const handleFav = () => {
    setIsFav((prev) => !prev);
  };

  const getArtists = async () => {
    try {
      const response = await instance.get('/api/artist');

      setArtists(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getArtists();
  }, []);

  return (
    <div className={styles.layout}>
      <ListHeader
        title='작가'
        placeholder='작가명 또는 국적 검색'
        isFav={isFav}
        onFav={handleFav}
      />
      <DropdownContainer filterList={artistFilter} />

      <section className={styles.artistListSection}>
        {artists.map(({ id, name, field, imageUrl }) => (
          <Link
            className={styles.artistItemContainer}
            key={id}
            to={`/artists/${id}`}
          >
            <img
              className={styles.artistImage}
              src={imageUrl}
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
