import React from 'react';
import styles from './SectionViewed.module.css';
import SectionTitle from '../../../../components/SectionTitle/SectionTitle';
import SectionCardList from '../../../../components/SectionCardList/SectionCardList';

export default function SectionViewed({ items = [] }) {
  return (
    <section className={styles.layout}>
      <SectionTitle title='관람한 전시' />
      <SectionCardList items={items} type='viewed' />
    </section>
  );
}
