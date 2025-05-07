import React from 'react';
import styles from './SectionArtistCardList.module.css';
import SectionArtistCard from '../Sections/SectionAtristCard/SectionArtistCard';

export default function SectionArtistCardList({ items }) {
  return (
    <div className={styles.cardList}>
      {items.map((item) => (
        <SectionArtistCard key={item.id} item={item} />
      ))}
    </div>
  );
}
