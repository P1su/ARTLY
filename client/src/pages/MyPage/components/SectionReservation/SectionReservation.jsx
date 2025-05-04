import React from 'react';
import styles from './SectionReservation.module.css';
import SectionTitle from '../../../../components/SectionTitle/SectionTitle';
import SectionCardList from '../../../../components/SectionCardList/SectionCardList';

export default function SectionReservation({ items }) {
  return (
    <section className={styles.layout}>
      <SectionTitle title='예매한 전시' />
      <SectionCardList items={items} type='reservation' />
    </section>
  );
}
