import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'; // Swiper 임포트
import { Navigation } from 'swiper/modules'; // 네비게이션 모듈
import 'swiper/css';
import 'swiper/css/navigation';

import styles from './ArtistCarousel.module.css';
import { instance } from '../../../../apis/instance.js';
import Img from '../../../../components/Img/Img.jsx';

export default function ArtistCarousel({ title }) {
  const [artists, setArtists] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const handleSwiperInit = (swiper) => {
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  };

  useEffect(() => {
    const getArtistList = async () => {
      try {
        const response = await instance.get('/api/artist', {
          params: {
            category: 'onExhibition',
          },
        });
        const parsed = response.data
          .map(({ id, artist_name, artist_category, artist_image }) => ({
            id,
            artist_name,
            artist_category,
            artist_image,
          }))
          .slice(0, 10);
        setArtists(parsed);
      } catch (error) {
        console.error('작가 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    getArtistList();
  }, []);

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.titleContainer}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <Link to='/artists' className={styles.moreButton}>
          더보기
        </Link>
      </div>

      {artists.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          onInit={handleSwiperInit}
          spaceBetween={20}
          slidesPerView={4}
          loop={artists.length > 4}
          className={styles.carouselViewport}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {artists.map((item) => (
            <SwiperSlide key={`${item?.id}`} className={styles.slideItem}>
              <Link to={`/artists/${item?.id}`} className={styles.carouselLink}>
                <div className={styles.imageContainer}>
                  <Img
                    src={item?.artist_image || '/default.jpg'}
                    alt={item?.artist_name || '작가 이미지'}
                    className={styles.artistImage}
                  />
                </div>
                <div className={styles.artistText}>
                  <h3 className={styles.name}>
                    {item?.artist_name && item.artist_name.trim() !== ''
                      ? item.artist_name
                      : '이름 없음'}
                  </h3>
                  <p className={styles.field}>
                    {item?.artist_category && item.artist_category.trim() !== ''
                      ? item.artist_category
                      : '장르 없음'}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem',
            color: '#999',
            fontSize: '1.4rem',
          }}
        >
          등록된 작가가 없습니다.
        </div>
      )}

      <button ref={prevRef} className={styles.prevButton}>
        &#8249;
      </button>
      <button ref={nextRef} className={styles.nextButton}>
        &#8250;
      </button>
    </div>
  );
}
