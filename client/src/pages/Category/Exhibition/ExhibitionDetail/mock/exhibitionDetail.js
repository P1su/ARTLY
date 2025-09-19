import exhibitionImage from './mockExhibitionImage.png';
import artistImage from './artistMockImage.png';

export const mockData = {
  image: exhibitionImage,
  title: '전시회1',
  category: '미술/전시',
  date: '2025.04.28 - 2025.05.25',
  time: '평일 - 10:00 - 18:00\n주말 - 13:00 - 19:00',
  place: '서울국립미술관',
  address: '서울특별시 마포구 강변대로 12345',
  price: '성인 - 10000원\n만 14세 이하 - 8000원',
  content:
    '빛과 시간의 경계" 전시회는 현대 미술과 디지털 아트를 결합한 몰입형 체험 전시입니다.\n관람객은 빛, 소리, 그리고 인터랙티브 기술을 통해 시간의 흐름과 기억의 파편을 탐험하게 됩니다\n참여 작가들은 인공지능, 프로젝션 맵핑, 데이터 시각화를 활용하여 다양한 시공간적 상상을 구현합니다.\n전시 공간은 각기 다른 테마의 방으로 나뉘어, 관람객이 능동적으로 전시에 참여할 수 있도록 설계되었습니다.\n이 전시는 기술과 예술의 경계를 넘나들며 새로운 감각적 경험을 제공합니다.',
  artists: [
    {
      artistId: 0,
      artistName: '피카소',
      artistImage: artistImage,
    },
    {
      artistId: 1,
      artistName: '피카소',
      artistImage: artistImage,
    },
    {
      artistId: 2,
      artistName: '피카소',
      artistImage: artistImage,
    },
  ],
  galleryInfo: {
    galleryName: '서울국립미술관',
    tel: '02-123-4567',
    director: '홍길동',
    contact: 'email@email.com',
  },
};
