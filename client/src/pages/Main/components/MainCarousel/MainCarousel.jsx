import styles from './MainCarousel.module.css';
import { useEffect, useRef, useState } from 'react';
import { instance } from '../../../../apis/instance.js';

export default function MainCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    resetAutoPlay();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, items]);

  const resetAutoPlay = () => {
    clearTimeout(timeoutRef.current);
    if (!items || items.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToSlide = (index) => setCurrentIndex(index);

  useEffect(() => {
    const getExhibitionList = async () => {
      try {
        const response = await instance.get('/api/exhibitions', {
          params: {
            status: 'exhibited',
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
            exhibition_organization: organization,
          }) => ({
            id,
            image,
            title,
            category,
            status,
            startDate,
            endDate,
            organization,
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
    <div className={styles.carouselContainer}>
      <button
        className={`${styles.arrowButton} ${styles.left}`}
        onClick={prevSlide}
      >
        &#8249;
      </button>

      <div className={styles.sliderWrapper}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item?.id} className={styles.carouselItem}>
              <img
                src={item?.image}
                alt={item?.title || item?.name}
                className={styles.carouselImage}
              />
              <div className={styles.captionBox}>
                <h3 className={styles.title}>{item?.title}</h3>
                <p className={styles.location}>
                  {item?.organization.name}에서{' '}
                  {item?.period || `${item?.startDate} ~ ${item?.endDate}`}
                </p>
                <button
                  className={styles.detailButton}
                  onClick={() => {
                    window.location.href = `/exhibitions/${item?.id}`;
                  }}
                >
                  자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`${styles.arrowButton} ${styles.right}`}
        onClick={nextSlide}
      >
        &#8250;
      </button>

      <div className={styles.dots}>
        {items.map((item, i) => (
          <button
            key={item?.id}
            onClick={() => goToSlide(i)}
            className={`${styles.dot} ${i === currentIndex ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
