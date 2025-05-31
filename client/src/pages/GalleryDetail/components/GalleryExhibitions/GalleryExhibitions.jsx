import styles from './GalleryExhibitions.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function GalleryExhibitions({ exhibitions }) {
  const [isDisplay, setIsDisplay] = useState('exhibited');
  const filteredExhibitions = exhibitions.filter(
    (item) => item.status === isDisplay,
  );

  return (
    <section className={styles.exhibitionSection}>
      <div className={styles.exhibitionTypeContainer}>
        <button
          className={`${styles.typeButton} ${isDisplay === 'exhibited' && styles.clickedType}`}
          onClick={() => {
            setIsDisplay('exhibited');
          }}
        >
          진행중인 전시
        </button>
        <button
          className={`${styles.typeButton} ${isDisplay === '' && styles.clickedType}`}
          onClick={() => {
            setIsDisplay('');
          }}
        >
          예정된 전시
        </button>
      </div>
      <div className={styles.listContainer}>
        {!filteredExhibitions || filteredExhibitions.length === 0 ? (
          <span className={styles.emptySpan}>
            {isDisplay === 'exhibited'
              ? '진행중인 전시회가 없습니다'
              : ' 예정된 전시회가 없습니다'}
          </span>
        ) : (
          <div className={styles.exhibitionItemList}>
            {filteredExhibitions.map(({ id, poster, title }) => (
              <Link
                className={styles.exhibitionItemContainer}
                key={id}
                to={`/exhibitions/${id}`}
              >
                <img
                  className={styles.exhibitionImage}
                  src={poster}
                  alt='전시회 대표 이미지'
                />
                <div className={styles.titleBox}>{title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
