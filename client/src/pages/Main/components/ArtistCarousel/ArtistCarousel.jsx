import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ArtistCarousel.module.css';

export default function ArtistCarousel({ title, items }) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [isSliding, setIsSliding] = useState(false);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const clonedItems = [items[items.length - 1], ...items, ...items.slice(0, slidesToShow)];

  const updateSlidesToShow = () => {
    setSlidesToShow(4);
  };

  useEffect(() => {
    updateSlidesToShow();
  }, []);

  const slideTo = (index) => {
    if (isSliding) return;
    setIsSliding(true);
    const width = carouselRef.current.offsetWidth / slidesToShow;
    carouselRef.current.style.transition = 'transform 0.4s ease-in-out';
    carouselRef.current.style.transform = `translateX(-${width * index}px)`;
    setCurrentIndex(index);
  };

  const nextSlide = () => slideTo(currentIndex + 1);
  const prevSlide = () => slideTo(currentIndex - 1);

  useEffect(() => {
    const width = carouselRef.current.offsetWidth / slidesToShow;
    carouselRef.current.style.transition = 'none';
    carouselRef.current.style.transform = `translateX(-${width}px)`;
  }, [slidesToShow]);

  useEffect(() => {
    const handleTransitionEnd = () => {
      const width = carouselRef.current.offsetWidth / slidesToShow;
      carouselRef.current.style.transition = 'none';

      if (currentIndex >= clonedItems.length - slidesToShow) {
        carouselRef.current.style.transform = `translateX(-${width}px)`;
        setCurrentIndex(1);
      } else if (currentIndex === 0) {
        const resetIndex = clonedItems.length - slidesToShow - 1;
        carouselRef.current.style.transform = `translateX(-${width * resetIndex}px)`;
        setCurrentIndex(resetIndex);
      }

      setIsSliding(false);
    };

    const node = carouselRef.current;
    node.addEventListener('transitionend', handleTransitionEnd);
    return () => node.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, clonedItems.length, slidesToShow]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  };

  const handleClick = (id) => {
    navigate(`/astists/${id}`);
  };  
  
  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.titleContainer}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <Link to="/artists" className={styles.moreButton}>더보기</Link>
      </div>
      <div
        className={styles.carouselViewport}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.carouselTrack} ref={carouselRef}>
          {clonedItems.map((item, i) => (
            <Link
              to={`/artists/${item?.id}`}
              key={item?.id ?? `clone-${i}`}
              className={styles.carouselSlide}
            >
              <img
                src={item?.image || '/default.jpg'}
                alt={item?.name ? `${item.name} 이미지` : '작가 이미지'}
                className={styles.artistImage}
              />
              <div className={styles.artistText}>
                <h3 className={styles.name}>{item?.name || '이름 없음'}</h3>
                <p className={styles.field}>{item?.field || '장르 없음'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button className={styles.prevButton} onClick={() => !isSliding && prevSlide()}>
        &#8249;
      </button>
      <button className={styles.nextButton} onClick={() => !isSliding && nextSlide()}>
        &#8250;
      </button>
    </div>
  );
}
