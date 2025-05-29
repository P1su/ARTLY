import { useEffect, useRef, useState } from 'react';
import styles from './MainCarousel.module.css';

export default function MainCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  return (
    <div className={styles.carouselContainer}>
      <button className={`${styles.arrowButton} ${styles.left}`} onClick={prevSlide}>
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
                <p className={styles.location}>{item?.gallery}</p>
                <p className={styles.date}>
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

      <button className={`${styles.arrowButton} ${styles.right}`} onClick={nextSlide}>
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
