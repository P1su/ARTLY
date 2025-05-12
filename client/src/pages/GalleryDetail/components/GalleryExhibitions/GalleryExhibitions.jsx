import styles from './GalleryExhibitions.module.css';
import { mockGalleryDetail } from '../../mock/mockGalleryDetail.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GalleryExhibitions() {
  const [type, setType] = useState('operating');
  const { exhibitions } = mockGalleryDetail;

  const handleType = (type) => {
    setType(type);
  };

  return (
    <section className={styles.exhibitionSection}>
      <div className={styles.exhibitionTypeContainer}>
        <button
          className={
            type === 'operating'
              ? styles.activedExhibitionTypeButton
              : styles.exhibitionTypeButton
          }
          onClick={() => {
            handleType('operating');
          }}
        >
          진행 중인 전시
        </button>
        <button
          className={
            type === 'scheduled'
              ? styles.activedExhibitionTypeButton
              : styles.exhibitionTypeButton
          }
          onClick={() => {
            handleType('scheduled');
          }}
        >
          예정 전시
        </button>
      </div>
      <ul className={styles.exhibitionItemList}>
        {exhibitions[type].map(
          ({
            exhibitionId,
            exhibitionImage,
            exhibitionTitle,
            exhibitionAddress,
            exhibitionDate,
          }) => (
            <Link
              className={styles.exhibitionItemContainer}
              key={exhibitionId}
              to={`/exhibitions/${exhibitionId}`}
            >
              <img
                className={styles.exhibitionImage}
                src={exhibitionImage}
                alt='전시회 대표 이미지'
              />
              <span className={styles.titleSpan}>{exhibitionTitle}</span>
              <span>{exhibitionAddress}</span>
              <span>{exhibitionDate}</span>
            </Link>
          ),
        )}
      </ul>
    </section>
  );
}
