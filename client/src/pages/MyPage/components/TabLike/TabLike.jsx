import React from 'react';
import styles from './TabLike.module.css';
import dummyImg from '../../../../assets/images/dummyImg.png';
import SectionTitle from '../SectionTitle/SectionTitle';
import SectionCardList from '../SectionCardList/SectionCardList';
import SectionArtistCardList from '../SectionArtistCardList/SectionArtistCardList';

const dummyBookmarks = [
  {
    id: 1,
    title: 'Second Life @Jeju',
    location: '비움갤러리제주',
    date: '2025-04-02 ~ 2025-04-20',
    imageUrl: dummyImg,
    status: '전시 중',
  },
  {
    id: 2,
    title: '국립현대미술관 도입의 소장품',
    location: '국립현대미술관청주관',
    date: '2025-04-12 ~ 2025-09-20',
    imageUrl: dummyImg,
    status: '전시 전',
  },
];

const dummyFollowedArtists = [
  {
    id: 1,
    name: '헤르만 니치',
    desc: 'Informal drawing',
    imageUrl: dummyImg,
  },
  {
    id: 2,
    name: '리너스 반 데 벨데',
    desc: 'Damn Claude',
    imageUrl: dummyImg,
  },
  {
    id: 3,
    name: '한선우',
    desc: '《동물》, 《에코》의 전시...',
    imageUrl: dummyImg,
  },
  {
    id: 4,
    name: '리너스 반 데 벨데',
    desc: 'Damn Claude',
    imageUrl: dummyImg,
  },
  {
    id: 5,
    name: '한선우',
    desc: '《동물》, 《에코》의 전시...',
    imageUrl: dummyImg,
  },
];

export default function TabLike() {
  return (
    <div>
      <section>
        <SectionTitle title='북마크 전시' />
        <SectionCardList items={dummyBookmarks} type='bookmark' />
      </section>
      <section>
        <SectionTitle title='팔로우 중인 작가' />
        <SectionArtistCardList items={dummyFollowedArtists} />
      </section>
    </div>
  );
}
