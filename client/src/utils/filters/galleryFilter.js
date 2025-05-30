export const galleryFilter = [
  {
    key: 'status',
    options: [
      { label: '전체', value: '' },
      { label: '현재 전시 중', value: 'active' },
    ],
  },
  {
    key: 'regions',
    options: [
      { label: '전체', value: '' },
      { label: '서울', value: '서울' },
      { label: '경기 인천', value: '경기 인천' },
      { label: '부산 울산 경남', value: '부산 울산 경남' },
      { label: '대전 충청', value: '대전 충청' },
      { label: '전주 광주', value: '전주 광주' },
      { label: '대구 경북', value: '대구 경북' },
      { label: '제주', value: '제주' },
      { label: '강원', value: '강원' },
    ],
  },
  {
    key: 'type',
    options: [
      { label: '전체', value: '' },
      { label: '미술관', value: '미술관' },
      { label: '박물관', value: '박물관' },
      { label: '갤러리', value: '갤러리' },
      { label: '복합문화공간', value: '복합문화공간' },
      { label: '대안공간', value: '대안공간' },
    ],
  },
];
