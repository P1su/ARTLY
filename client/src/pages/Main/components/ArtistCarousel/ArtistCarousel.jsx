import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ArtistCarousel.module.css';
import { instance } from '../../../../apis/instance.js';

export default function ArtistCarousel({ title }) {
  const [artists, setArtists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [isSliding, setIsSliding] = useState(false);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const updateSlidesToShow = () => {
    setSlidesToShow(4);
  };

  useEffect(() => {
    const getArtistList = async () => {
      try {
        const response = await instance.get('/api/artist', {
          params: {
            //category: 'onExhibition',
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

      if (currentIndex >= artists.length - slidesToShow) {
        carouselRef.current.style.transform = `translateX(-${width}px)`;
        setCurrentIndex(1);
      } else if (currentIndex === 0) {
        const resetIndex = artists.length - slidesToShow - 1;
        carouselRef.current.style.transform = `translateX(-${width * resetIndex}px)`;
        setCurrentIndex(resetIndex);
      }

      setIsSliding(false);
    };

    const node = carouselRef.current;
    node.addEventListener('transitionend', handleTransitionEnd);
    return () => node.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, artists.length, slidesToShow]);

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

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.titleContainer}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <Link to='/artists' className={styles.moreButton}>
          더보기
        </Link>
      </div>
      <div
        className={styles.carouselViewport}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.carouselTrack} ref={carouselRef}>
          {artists.map((item) => (
            <Link
              to={`/artists/${item?.id}`}
              key={`${item?.artist_name}-${item?.id}`}
              className={styles.carouselSlide}
            >
              <img
                src={item?.artist_image || '/default.jpg'}
                alt={
                  item?.artist_name
                    ? `${item.artist_name} 이미지`
                    : '작가 이미지'
                }
                className={styles.artistImage}
              />
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
          ))}
        </div>
      </div>

      <button
        className={styles.prevButton}
        onClick={() => !isSliding && prevSlide()}
      >
        &#8249;
      </button>
      <button
        className={styles.nextButton}
        onClick={() => !isSliding && nextSlide()}
      >
        &#8250;
      </button>
    </div>
  );
}
