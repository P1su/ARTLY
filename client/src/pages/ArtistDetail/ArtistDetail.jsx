import styles from './ArtistDetail.module.css';
import { mockArtistDetail } from './mock/mockArtistDetail.js';
import BtnFavorite from '../ExhibitionDetail/components/BtnFavorite/BtnFavorite'; //추후 확장 및 수정 예정
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import ArtistActivity from './components/ArtistActivity/ArtistActivity';

export default function ArtistDetail() {
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState([]);

  const getArtistDetail = async () => {
    try {
      const response = await instance.get(`/api/artists/${artistId}`);

      setArtistData(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getArtistDetail();
  }, []);

  return (
    <div className={styles.layout}>
      <section className={styles.infoSection}>
        <img
          className={styles.artistImage}
          src={artistData.imageUrl}
          alt='작가 대표 이미지'
        />
        <h3 className={styles.artistTitle}>{artistData.name}</h3>
        <span className={styles.subSpan}>
          {artistData.nation} | {artistData.field}
        </span>
      </section>
      <div>
        <button>으아</button>
      </div>
      <ArtistActivity description={artistData.description} />
      <Link className={styles.backButton} to='/artists'>
        목록으로 돌아가기
      </Link>
    </div>
  );
}
