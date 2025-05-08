import { useEffect, useRef, useState } from 'react';
import styles from './MainCarousel.module.css';

export default function MainCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const slideCount = items.length;

  useEffect(() => {
    resetAutoPlay();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  const resetAutoPlay = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 5000);
  };

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.sliderWrapper}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={i} className={styles.carouselItem}>
              <img
                src={item.image}
                alt={item.title || `poster-${i}`}
                className={styles.carouselImage}
              />
              <div>
                <h3>{item.title}</h3>
                <p>{item.period}</p>
                <p>{item.gallery}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`${styles.dot} ${i === currentIndex ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}