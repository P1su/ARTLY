import React from 'react';
import styles from './Main.module.css';
import MainCarousel from './components/MainCarousel/MainCarousel';
import ExhibitionCarousel from './components/ExhibitionCarousel/ExhibitionCarousel';
import {
  mainCarousel,
  weeklyCarousel,
  interestCarousel
} from './data/Carousel'; 


export default function Main() {
  return (
    <div className={styles.mainLayout}>
      <MainCarousel items={mainCarousel} />
      <ExhibitionCarousel title="금주의 전시" items={weeklyCarousel} />
      <ExhibitionCarousel title="관심 있을 전시" items={interestCarousel} />
    </div>
  );
}