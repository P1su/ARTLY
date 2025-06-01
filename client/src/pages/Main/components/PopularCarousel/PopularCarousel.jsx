import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./PopularCarousel.module.css";
import { Link } from "react-router-dom";

export default function PopularCarousel({ title, items }) {
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

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselHeader}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <Link to="/exhibitions" className={styles.moreButton}>
          더보기
        </Link>        
      </div>

      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        centeredSlides={true}
        loop={items.length > 2}
        spaceBetween={20}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
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
                <p>{item.startDate} ~ {item.endDate}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <button ref={prevRef} className={styles.prevButton}>&#8249;</button>
      <button ref={nextRef} className={styles.nextButton}>&#8250;</button>
    </div>
  );
}
