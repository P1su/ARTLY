import styles from './ExhibitionDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import BtnFavorite from './components/BtnFavorite/BtnFavorite';
import BtnShare from './components/BtnShare/BtnShare';
import StickyMenu from './components/StikcyMenu/StickyMenu';

export default function ExhibitionDetail() {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [exhibitionDetail, setExhibitionDetail] = useState(null);

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
  };  

  const getExhibitionDetail = async () => {
    try {
      const response = await instance.get(`/api/exhibitions/${exhibitionId}`);
      setExhibitionDetail(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getExhibitionDetail();
  }, []);

  if (!exhibitionDetail) return null;

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
    gallery_info: galleryInfo,
    artists,
    exhibition_description: description,
  } = exhibitionDetail;

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
          <span>전시기간</span>
          <span>
            {startDate} - {endDate}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>관람시간</span>
          <span>
            {startTime} - {endTime}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>주소</span>
          <span>{exhibitionLocation}</span>
        </div>
        <div className={styles.infoContainer}>
          <span>입장료</span>
          <span>{price}원</span>
        </div>

        {Array.isArray(artists) && (
          <>
            <span>작가</span>
            <ul className={styles.artistList}>
              {artists.map(({ artist_id: artistId, artist_name: artistName, artist_image: artistImage }) => (
                <li className={styles.artistItem} key={artistId}>
                  <img className={styles.artistImage} src={artistImage} alt={`${artistName} 이미지`} />
                  <span>{artistName}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className={styles.iconSection}>
        <div className={styles.iconBox} onClick={handleLikeToggle}>
          <img
            src={liked ? '/icons/like.svg' : '/icons/notlike.svg'}
            alt='좋아요'
            className={styles.iconImage}
          />
          <span>좋아요</span>
        </div>
        <div className={styles.iconBox}>
          <img src='/icons/reserve.svg' alt='관람예약' className={styles.iconImage} />
          <span>관람예약</span>
        </div>
        <div className={styles.iconBox}>
          <img src='/icons/share.svg' alt='공유하기' className={styles.iconImage} />
          <span>공유하기</span>
        </div>
        <div className={styles.iconBox} onClick={() => navigate('/scan')}>
          <img src='/icons/headphone.svg' alt='도슨트' className={styles.iconImage} />
          <span>도슨트</span>
        </div>
      </section>


      <section className={styles.contentSection}>
        <span className={styles.titleSpan}>전시회 소개</span>
        <hr className={styles.divider} />
        <p className={styles.contentParagraph}>{description}</p>
      </section>

      <section className={styles.buttonSection}>
        <BtnFavorite />
        <BtnShare />
      </section>

      {galleryInfo && (
        <footer className={styles.footer}>
          <span>{galleryInfo.gallery_name}</span>
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
      )}
    </div>
  );
}
