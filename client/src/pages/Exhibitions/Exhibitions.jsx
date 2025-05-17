import styles from './Exhibitions.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';

export default function Exhibitions() {
  const [exhibitionData, setExhibitionaData] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (exhibitionId) => {
    navigate(`/exhibitions/${exhibitionId}`);
  };

  const getExhibitionList = async () => {
    try {
      const response = await instance.get('/api/exhibitions');

      setExhibitionaData(response.data);
    } catch {
      throw new Error('API 연결 실패');
    }
  };

  useEffect(() => {
    getExhibitionList();
  }, []);

  return (
    <div className={styles.layout}>
      <section className={styles.exhibitionListSection}>
        {exhibitionData.map(
          ({
            id,
            exhibition_poster: image,
            exhibition_title: title,
            exhibition_category: category,
            exhibition_start_date: startDate,
            exhibition_end_date: endDate,
          }) => (
            <div
              className={styles.exhibitionItemContainer}
              key={id}
              onClick={() => {
                handleNavigate(id);
              }}
            >
              <img
                className={styles.exhibitionImage}
                src={image}
                alt='전시회 대표 이미지'
              />
              <span className={styles.titleSpan}>{title}</span>
              <span className={styles.subSpan}>{category}</span>
              <span className={styles.subSpan}>
                {startDate} - {endDate}
              </span>
            </div>
          ),
        )}
      </section>
    </div>
  );
}
