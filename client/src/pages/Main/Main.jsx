import styles from './Main.module.css';
import MainCarousel from './components/MainCarousel/MainCarousel';
import ArtistCarousel from './components/ArtistCarousel/ArtistCarousel';
import SwipeCarousel from './components/SwipeCarousel/SwipeCarousel';

export default function Main() {
  return (
    <div className={styles.mainLayout}>
      <MainCarousel />
      <SwipeCarousel title='현재 진행 중인 전시' />
      <SwipeCarousel
        title='놓치지 말아야 할 특별 전시'
        category='sort'
        value='latest'
      />
      <SwipeCarousel title='인기있는 전시' category='sort' value='popular' />
      <ArtistCarousel title='전시 중인 작가' />
    </div>
  );
}
