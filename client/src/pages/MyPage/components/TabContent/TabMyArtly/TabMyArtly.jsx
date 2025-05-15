import React from 'react';
import styles from './TabMyArtly.module.css';

import SectionCalendar from '../../Sections/SectionCalendar/SectionCalendar';
import dummyImg from '../../../mock/dummyImg.png';
import SectionTitle from '../../SectionTitle/SectionTitle';
import SectionCardList from '../../SectionCardList/SectionCardList';

const dummyReservations = [
  {
    id: 0,
    imageUrl: dummyImg,
    title: '예매한 전시 1',
    location: '서울시 강남구',
    date: '2025.05.01 - 2025.05.15',
    status: '전시 중',
  },
  {
    id: 1,
    imageUrl: dummyImg,
    title: '예매한 전시 2',
    location: '서울시 강남구',
    date: '2025.05.01 - 2025.05.15',
    status: '전시 전',
  },
];

const dummyViewed = [
  {
    id: 11,
    imageUrl: dummyImg,
    title: '관람한 전시 1',
    location: '서울시 종로구',
    date: '2025.04.01 - 2025.04.30',
    status: '전시 중',
  },
  {
    id: 12,
    imageUrl: dummyImg,
    title: '관람한 전시 2',
    location: '서울시 종로구',
    date: '2025.04.01 - 2025.04.30',
    status: '마감',
  },
  {
    id: 13,
    imageUrl: dummyImg,
    title: '관람한 전시 2',
    location: '서울시 종로구',
    date: '2025.04.01 - 2025.04.30',
    status: '전시 전',
  },
];

export default function TabMyArtly() {
  return (
    <div>
      <section>
        <SectionTitle title='예약한 전시' />
        <SectionCardList items={dummyReservations} type='reservation' />
      </section>
      <section>
        <SectionTitle title='관람한 전시' />
        <SectionCardList items={dummyViewed} type='viewed' />
      </section>
      <section>
        <SectionTitle title='전시 캘린더' />
        <SectionCalendar items={dummyReservations} />
      </section>
    </div>
  );
}
