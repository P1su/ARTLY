import React from 'react';
import styles from './TabLike.module.css';
import SectionTitle from '../../../../components/SectionTitle/SectionTitle';
import SectionCardList from '../../../../components/SectionCardList/SectionCardList';

export default function TabLike() {
  const bookmarkedExhibitions = [
    {
      id: 1,
      title: 'Second Life @Jeju',
      location: '비움갤러리제주',
      date: '2025-04-02 ~ 2025-04-20',
      imageUrl: '/dummy/jeju.png',
      status: '진행 중',
    },
    {
      id: 2,
      title: '국립현대미술관 도입의 소장품',
      location: '국립현대미술관청주관',
      date: '2025-04-12 ~ 2025-09-20',
      imageUrl: '/dummy/mmca.png',
      status: '진행 전',
    },
  ];

  const followedArtists = [
    {
      id: 1,
      name: '헤르만 니치',
      desc: 'Informal drawing',
      imageUrl: '/dummy/nitsch.png',
    },
    {
      id: 2,
      name: '리너스 반 데 벨데',
      desc: 'Damn Claude',
      imageUrl: '/dummy/claude.png',
    },
    {
      id: 3,
      name: '한선우',
      desc: '《동물》, 《에코》의 전시...',
      imageUrl: '/dummy/seonwoo.png',
    },
  ];

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <SectionTitle title='북마크 전시' />
        <SectionCardList items={bookmarkedExhibitions} type='status' />
      </section>
      <section className={styles.section}>
        <SectionTitle title='팔로우 중인 작가' />
      </section>
    </div>
  );
}
