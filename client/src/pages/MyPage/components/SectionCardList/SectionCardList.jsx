import React from 'react';
import styles from './SectionCardList.module.css';
import SectionCard from '../Sections/SectionCard/SectionCard';

export default function SectionCardList({ items, type }) {
  return (
    <div className={styles.cardList}>
      {items.map((item) => (
        <SectionCard key={item.id} item={item} type={type} />
      ))}
    </div>
  );
}
