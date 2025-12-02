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

  const handleSwiperInit = (swiper) => {
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  };

  useEffect(() => {
    const getExhibitionList = async () => {
      try {
        const params = { status: 'exhibited' };
        if (category && value) {
          params[category] = value;
        }

        const response = await instance.get('/api/exhibitions', { params });

        const parsed = response.data.map(
          ({
            id,
            exhibition_poster: image,
            exhibition_title: title,
            exhibition_category: category,
            exhibition_status: status,
            exhibition_start_date: startDate,
            exhibition_end_date: endDate,
            exhibition_organization: organization,
            exhibition_location: location,
          }) => ({
            id,
            image,
            title,
            category,
            status,
            startDate,
            endDate,
            organizationName:
              typeof organization === 'object'
                ? organization?.name
                : organization || location,
          }),
        );

        setItems(parsed);
      } catch (error) {
        console.error('전시회 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    getExhibitionList();
  }, [category, value]);

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselHeader}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <Link to='/exhibitions' className={styles.moreButton}>
          더보기
        </Link>
      </div>

      {items.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          onInit={handleSwiperInit}
          slidesPerView={'auto'}
          centeredSlides={false}
          spaceBetween={20}
          loop={items.length > 3}
          className={styles.carouselViewport}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className={styles.carouselSlide}>
              <Link to={`/exhibitions/${item.id}`} className={styles.slideCard}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.carouselImage}
                />
                <div className={styles.cardText}>
                  <h3>《{item.title}》</h3>
                  <p>{item.organizationName}</p>
                  <p>
                    {item.startDate} ~ {item.endDate}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={styles.emptyBox}>해당하는 전시가 없습니다.</div>
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
