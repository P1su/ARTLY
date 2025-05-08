import { useEffect, useRef, useState } from 'react';
import styles from './MainCarousel.module.css';

export default function MainCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef(null);
  const sliderRef = useRef(null);
  const slideCount = items.length;

  const extendedItems = [...items, items[0]]; 

  useEffect(() => {
    resetAutoPlay();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex === slideCount) {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }
    };

    const sliderNode = sliderRef.current;
    sliderNode.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      sliderNode.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [currentIndex, slideCount]);

  const resetAutoPlay = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.sliderWrapper}>
        <div
          ref={sliderRef}
          className={styles.slider}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {extendedItems.map((item, i) => (
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
            className={`${styles.dot} ${i === currentIndex % slideCount ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
