import React from 'react';
import styles from './SectionCatalog.module.css';
import dummyImg from '../../../../assets/images/dummyImg.png';
import { useNavigate } from 'react-router-dom';

export default function SectionCatalog({ items }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/catalog');
  };
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className={styles.image}
            />
            <div className={styles.info}>
              <div className={styles.exhibitionTitle}>{item.title}</div>
              <div className={styles.text}>- 위치 - {item.location}</div>
              <div className={styles.text}>- 정보 - {item.info}</div>
              <button className={styles.button} onClick={handleNavigate}>
                보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
