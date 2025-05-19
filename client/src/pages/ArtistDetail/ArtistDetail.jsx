import styles from './ArtistDetail.module.css';
import { mockArtistDetail } from './mock/mockArtistDetail.js';
import BtnFavorite from '../ExhibitionDetail/components/BtnFavorite/BtnFavorite'; //추후 확장 및 수정 예정
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import ArtistActivity from './components/ArtistActivity/ArtistActivity';

export default function ArtistDetail() {
  const { educations, careers } = mockArtistDetail;
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
        <span className={styles.titleSpan}>{artistData.name}</span>
        <span className={styles.subSpan}>{artistData.nation}</span>
        <span className={styles.subSpan}>{artistData.field}</span>
        <BtnFavorite />
      </section>
      <p className={styles.descriptionParagraph}>{artistData.description}</p>
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
      <ArtistActivity />
    </div>
  );
}
