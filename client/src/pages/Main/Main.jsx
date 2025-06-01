import { useEffect, useState } from 'react';
import styles from './Main.module.css';
import { instance } from '../../apis/instance.js';
import MainCarousel from './components/MainCarousel/MainCarousel';
import PopularCarousel from './components/PopularCarousel/PopularCarousel.jsx';
import SpecialCarousel from './components/SpecialCarousel/SpecialCarousel.jsx';
import NowCarousel from './components/NowCarousel/NowCarousel.jsx';
import ArtistCarousel from './components/ArtistCarousel/ArtistCarousel';
import ChatbotWidget from '../../components/ChatbotWidget/ChatbotWidget';

export default function Main() {
  const [exhibitions, setExhibitions] = useState([]);
  const [artists, setArtists] = useState([]);

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
          exhibition_organization,
        }) => ({
          id,
          image,
          title,
          category,
          status,
          startDate,
          endDate,
          organizationName: exhibition_organization?.name,
        }),
      );

      setExhibitions(parsed);
    } catch (error) {
      console.error('전시회 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const getArtistList = async () => {
    try {
      const response = await instance.get('/api/artist');
      const parsed = response.data.map(
        ({ id, name, field, imageUrl }) => ({
          id,
          name,
          field,
          imageUrl,
        }),
      );
      setArtists(parsed);
    } catch (error) {
      console.error('작가 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    getExhibitionList();
    getArtistList();
  }, []);

  return (
    <div className={styles.mainLayout}>
      <MainCarousel items={exhibitions} />

      <PopularCarousel
        title="지금 인기 있는 전시"
        items={exhibitions}
      />

      <SpecialCarousel
        title="놓치지 않아야 할 특별 전시"
        items={exhibitions}
      />   

      <NowCarousel
        title="현재 전시"
        items={exhibitions}
      />         

      <ArtistCarousel
        title="전시중인 작가"
        items={artists}
      />

      <ChatbotWidget />
    </div>
  );
}
