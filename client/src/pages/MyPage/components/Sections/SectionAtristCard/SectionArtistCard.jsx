import React from 'react';
import styles from './SectionArtistCard.module.css';

export default function SectionArtistCard({ item }) {
  return (
    <div className={styles.card}>
      <img src={item.imageUrl} alt={item.name} className={styles.image} />
      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.description}>{item.desc}</div>
      </div>
    </div>
  );
}
