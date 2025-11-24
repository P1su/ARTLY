import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MobileMain.module.css';
import { instance } from '../../../../apis/instance';

const SLIDE_INTERVAL = 4000;
const MAX_SLIDES = 3;

export default function MobileMain() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await instance.get('/api/exhibitions', {
          params: { status: 'exhibited' },
        });

        const parsed = response.data
          ?.map(
            ({
              id,
              exhibition_poster: image,
              exhibition_title: title,
              exhibition_start_date: startDate,
              exhibition_end_date: endDate,
              exhibition_organization: organization,
            }) => ({
              id,
              image,
              title,
              startDate,
              endDate,
              organization,
            }),
          )
          .slice(0, MAX_SLIDES);

        setItems(parsed || []);
        setCurrentIndex(0);
      } catch (error) {
        console.error('모바일 메인 전시 정보 로딩 실패:', error);
      }
    };

    fetchExhibitions();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [items]);

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <div className={styles.mobileMain}>
      <div className={styles.carousel}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div
              key={item?.id}
              className={styles.slide}
              onClick={() => navigate(`/exhibitions/${item?.id}`)}
            >
              <img
                src={item?.image}
                alt={item?.title}
                className={styles.slideImage}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.tagline}>
        그림 너머의 세계로 초대하는 <br />
        감성 가이드, ARTLY
      </div>
    </div>
  );
}
