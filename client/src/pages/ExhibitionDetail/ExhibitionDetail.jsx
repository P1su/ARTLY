import styles from './ExhibitionDetail.module.css';
import { useParams } from 'react-router-dom';
import { mockData } from './mock/exhibitionDetail.js';
import BtnFavorite from './components/BtnFavorite/BtnFavorite';

export default function ExhibitionDetail() {
  const { exhibitionId } = useParams();
  console.log(exhibitionId);

  const { galleryInfo } = mockData;
  return (
    <div className={styles.layout}>
      <section className={styles.titleSection}>
        <img
          className={styles.exhibitionImage}
          src={mockData.image}
          alt='전시회 대표 이미지'
        />
        <span className={styles.titleSpan}>{mockData.title}</span>
        <span>{mockData.category}</span>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <span>기간</span>
          <span>{mockData.date}</span>
        </div>
        <div className={styles.infoContainer}>
          <span>시간</span>
          <span>{mockData.time}</span>
        </div>
        <div className={styles.infoContainer}>
          <span>장소</span>
          <span>{mockData.place}</span>
        </div>
        <div className={styles.infoContainer}>
          <span>주소</span>
          <span>{mockData.address}</span>
        </div>
        <div className={styles.infoContainer}>
          <span>관람료</span>
          <span>{mockData.price}</span>
        </div>
        <span>작가</span>
        <ul className={styles.artistList}>
          {mockData.artists.map(({ artistImage, artistId, artistName }) => (
            <li className={styles.artistItem} key={artistId}>
              <img className={styles.artistImage} src={artistImage} />
              <span>{artistName}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.contentSection}>
        <span className={styles.titleSpan}>전시회 소개</span>
        <hr className={styles.divider} />
        <p className={styles.contentParagraph}> {mockData.content}</p>
      </section>

      <section className={styles.buttonSection}>
        <BtnFavorite />
      </section>

      <footer className={styles.footer}>
        <span>{galleryInfo.galleryName}</span>
        <div>
          <span>전화번호: </span>
          <span>{galleryInfo.tel}</span>
        </div>
        <div>
          <span>대표자: </span>
          <span>{galleryInfo.director}</span>
        </div>
        <div>
          <span>문의: </span>
          <span>{galleryInfo.contact}</span>
        </div>
      </footer>
    </div>
  );
}
