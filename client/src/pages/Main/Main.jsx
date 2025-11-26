import styles from './Main.module.css';
import MainCarousel from './components/MainCarousel/MainCarousel';
import ArtistCarousel from './components/ArtistCarousel/ArtistCarousel';
import SwipeCarousel from './components/SwipeCarousel/SwipeCarousel';
import MobileMain from './components/MobileMain/MobileMain';
import useResponsive from '../../hooks/useResponsive';

export default function Main() {
  const { isMobile } = useResponsive();
  return (
    <div className={styles.mainLayout}>
      {isMobile ? (
        <MobileMain />
      ) : (
        <>
          <MainCarousel />
          <div className={styles.carouselContainer}>
            <SwipeCarousel title='현재 진행 중인 전시' />
            <SwipeCarousel
              title='인기있는 전시'
              category='sort'
              value='popular'
            />
            <ArtistCarousel title='전시 중인 작가' />
          </div>
        </>
      )}
    </div>
  );
}
