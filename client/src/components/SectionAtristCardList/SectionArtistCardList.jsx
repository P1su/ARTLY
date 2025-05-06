import React from 'react';
import styles from './SectionArtistCardList.module.css';

export default function SectionArtistCardList({ item }) {
  return (
    <div className={styles.cardList}>
      {item.map((artist) => (
        <div key={artist.id} className={styles.card}>
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className={styles.image}
          />
          <div className={styles.info}>
            <div className={styles.name}>{artist.name}</div>
            <div className={styles.description}>{artist.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
