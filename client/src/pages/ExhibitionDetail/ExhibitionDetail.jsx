import styles from './ExhibitionDetail.module.css';
import { useParams } from 'react-router-dom';
import { mockData } from './mock/exhibitionDetail.js';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import BtnFavorite from './components/BtnFavorite/BtnFavorite';
import BtnShare from './components/BtnShare/BtnShare';
import StickyMenu from './components/StikcyMenu/StickyMenu';

export default function ExhibitionDetail() {
  const { exhibitionId } = useParams();
  const [exhibitionDetail, setExhibitionDetail] = useState([]);

  const getExhibitionDetail = async () => {
    try {
      const response = await instance.get(`/api/exhibitions/${exhibitionId}`);

      setExhibitionDetail(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getExhibitionDetail();
  }, []);

  const {
    id,
    exhibition_category: category,
    exhibition_end_date: endDate,
    exhibition_location: exhibitionLocation,
    exhibition_poster: poster,
    exhibition_price: price,
    exhibition_start_date: startDate,
    exhibition_tag: tag,
    exhibition_title: title,
    exhibition_start_time: startTime,
    exhibition_end_time: endTime,
    gallery_id: gallaryId,
  } = exhibitionDetail;

  const { galleryInfo } = mockData;

  return (
    <div className={styles.layout}>
      <StickyMenu id={id} />
      <section className={styles.titleSection}>
        <img
          className={styles.exhibitionImage}
          src={poster}
          alt='전시회 대표 이미지'
        />
        <span className={styles.titleSpan}>{title}</span>
        <span>{category}</span>
        <span>{tag}</span>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <span>기간</span>
          <span>
            {startDate} - {endDate}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>시간</span>
          <span>
            {startTime} - {endTime}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>주소</span>
          <span>{exhibitionLocation}</span>
        </div>
        <div className={styles.infoContainer}>
          <span>관람료</span>
          <span>{price}원</span>
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
        <BtnShare />
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
