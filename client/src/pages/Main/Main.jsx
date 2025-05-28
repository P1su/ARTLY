import { useEffect, useState } from 'react';
import styles from './Main.module.css';
import { instance } from '../../apis/instance.js';
import MainCarousel from './components/MainCarousel/MainCarousel';
import ExhibitionCarousel from './components/ExhibitionCarousel/ExhibitionCarousel';
import ChatbotWidget from '../../components/ChatbotWidget/ChatbotWidget';

export default function Main() {
  const [exhibitions, setExhibitions] = useState([]);

  const getExhibitionList = async () => {
    try {
      const response = await instance.get('/api/exhibitions');
      const parsed = response.data.map(
        ({
          id,
          exhibition_poster: image,
          exhibition_title: title,
          exhibition_category: category,
          exhibition_status: status,
          exhibition_start_date: startDate,
          exhibition_end_date: endDate,
        }) => ({
          id,
          image,
          title,
          category,
          status,
          startDate,
          endDate,
        }),
      );

      setExhibitions(parsed);
    } catch (error) {
      console.error('전시회 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    getExhibitionList();
  }, []);

  return (
    <div className={styles.mainLayout}>
      <MainCarousel items={exhibitions} />
      <ExhibitionCarousel title='지금 인기 있는 전시' items={exhibitions} />
      <ExhibitionCarousel
        title='놓치지 않아야 할 특별 전시회'
        items={exhibitions}
      />
      <ChatbotWidget />
    </div>
  );
}
