import styles from './ArtistDetail.module.css';
import { mockArtistDetail } from './mock/mockArtistDetail.js';
import BtnFavorite from '../ExhibitionDetail/components/BtnFavorite/BtnFavorite'; //추후 확장 및 수정 예정
import { useParams } from 'react-router-dom';
import ArtistActivity from './components/ArtistActivity/ArtistActivity';

export default function ArtistDetail() {
  const { educations, careers } = mockArtistDetail;
  const { artistId } = useParams();
  console.log(artistId);

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
      <ArtistActivity />
    </div>
  );
}
