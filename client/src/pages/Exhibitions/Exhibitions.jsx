import styles from './Exhibitions.module.css';
import { mockExhibitionList } from './mock/mockExhibitionList.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

export default function Exhibitions() {
  const navigate = useNavigate();

  const handleNavigate = (exhibitionId) => {
    navigate(`/exhibitions/${exhibitionId}`);
  };

  const getExhibitionList = async () => {
    const response = await axios.get('/api/exhibitions', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log(response);
  };

  useEffect(() => {
    getExhibitionList();
  }, []);

  return (
    <div className={styles.layout}>
      <section className={styles.exhibitionListSection}>
        {mockExhibitionList.map(({ id, image, name, gallery, date }) => (
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
            <span className={styles.titleSpan}>{name}</span>
            <span className={styles.subSpan}>{gallery}</span>
            <span className={styles.subSpan}>{date}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
