import React from 'react';
import SectionTitle from '../../SectionTitle/SectionTitle';
import dummyImg from '../../../../../assets/images/dummyImg.png';
import SectionCatalog from '../../Sections/SectionCatalog/SectionCatalog';

const dummyCatalogs = [
  {
    id: 1,
    title: '전시회 1',
    location: '서울 00구',
    info: '전시회 정보',
    imageUrl: dummyImg,
  },
  {
    id: 2,
    title: '전시회 2',
    location: '서울 00구',
    info: '전시회 정보',
    imageUrl: dummyImg,
  },
  {
    id: 3,
    title: '전시회 3',
    location: '서울 00구',
    info: '전시회 정보',
    imageUrl: dummyImg,
  },
  {
    id: 4,
    title: '전시회 4',
    location: '서울 00구',
    info: '전시회 정보',
    imageUrl: dummyImg,
  },
];

export default function TabPurchased() {
  return (
    <div>
      <section>
        <SectionTitle title='구매한 도록' />
        <SectionCatalog items={dummyCatalogs} />
      </section>
    </div>
  );
}
