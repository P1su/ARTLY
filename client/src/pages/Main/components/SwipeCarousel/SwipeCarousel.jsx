import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './SwipeCarousel.module.css';
import { Link } from 'react-router-dom';
import { instance } from '../../../../apis/instance.js';

export default function SwipeCarousel({ title, category, value }) {
  const [items, setItems] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (
      swiperRef.current &&
      prevRef.current &&
      nextRef.current &&
      swiperRef.current.params?.navigation
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;

      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  useEffect(() => {
    const getExhibitionList = async () => {
      try {
        const response = await instance.get('/api/exhibitions', {
          params: {
            status: 'exhibited',
            [category]: value,
          },
        });
        const parsed = response.data.map(
          ({
            id,
            exhibition_poster: image,
            exhibition_title: title,
            exhibition_category: category,
            exhibition_status: status,
            exhibition_start_date: startDate,
            exhibition_end_date: endDate,
          }) => ({
            id,
            image,
            title,
            category,
            status,
            startDate,
            endDate,
          }),
        );

        setItems(parsed);
      } catch (error) {
        console.error('전시회 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    getExhibitionList();
  }, []);

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselHeader}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <Link to='/exhibitions' className={styles.moreButton}>
          더보기
        </Link>
      </div>

      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView='auto'
        centeredSlides
        loop={items.length > 2}
        spaceBetween={20}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        className={styles.carouselViewport}
      >
        {items ? (
          items.map((item) => (
            <SwiperSlide key={item.id} className={styles.carouselSlide}>
              <Link to={`/exhibitions/${item.id}`} className={styles.slideCard}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.carouselImage}
                />
                <div className={styles.cardText}>
                  <h3>《{item.title}》</h3>
                  <p>{/*item.organizationName*/}</p>
                  <p>
                    {item.startDate} ~ {item.endDate}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <div>진행 중인 전시가 없습니다</div>
        )}
      </Swiper>

      <button ref={prevRef} className={styles.prevButton}>
        &#8249;
      </button>
      <button ref={nextRef} className={styles.nextButton}>
        &#8250;
      </button>
    </div>
  );
}
