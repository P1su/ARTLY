import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './MainCarousel.module.css';

export default function MainCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const navigate = useNavigate(); 

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

  const goToSlide = (index) => setCurrentIndex(index);

  const handleClick = (id) => {
    navigate(`/exhibitions/${id}`);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.sliderWrapper}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div
              key={item?.id}
              className={styles.carouselItem}
              onClick={() => handleClick(item?.id)} 
              style={{ cursor: 'pointer' }} 
            >
              <img
                src={item?.image}
                alt={item?.title || item?.name}
                className={styles.carouselImage}
              />
              <div>
                <h3>{item?.title || item.name}</h3>
                <p>{item?.period || item.date}</p>
                <p>{item?.gallery}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
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
