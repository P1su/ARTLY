import React from 'react';
import styles from './SectionCatalog.module.css';
import { useNavigate } from 'react-router-dom';

export default function SectionCatalog({ items }) {
  const navigate = useNavigate();

  const handleNavigate = (bookId) => {
    navigate(`/catalog/${bookId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {items.map((item) => {
          const {
            book_id: bookId,
            book_poster: bookImg,
            book_title: title,
          } = item;

          return (
            <div key={bookId} className={styles.card}>
              <img src={bookImg} alt={title} className={styles.image} />
              <div className={styles.info}>
                <div className={styles.exhibitionTitle}>{title}</div>
                <button
                  className={styles.button}
                  onClick={() => handleNavigate(bookId)}
                >
                  보기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
