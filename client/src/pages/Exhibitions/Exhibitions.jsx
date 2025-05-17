import styles from './Exhibitions.module.css';
import { mockExhibitionList } from './mock/mockExhibitionList.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { instance } from '../../apis/instance.js';

export default function Exhibitions() {
  const navigate = useNavigate();

  const handleNavigate = (exhibitionId) => {
    navigate(`/exhibitions/${exhibitionId}`);
  };

  const getExhibitionList = async () => {
    const response = await instance.get('/api/exhibitions');
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
