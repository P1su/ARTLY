// utils/filters/exhibitionFilter.js

export const exhibitionFilter = [
  {
    key: 'sort',
    options: [
      { label: '최신순', value: 'latest' },
      { label: '오래된순', value: 'ending' },
      { label: '인기순', value: 'popular' },
    ],
  },
  {
    key: 'region',
    options: [
      { label: '전체', value: '' },
      { label: '서울', value: '서울' },
      { label: '부산', value: '부산' },
      { label: '대구', value: '대구' },
      { label: '광주', value: '광주' },
      { label: '대전', value: '대전' },
      { label: '기타', value: '기타' },
    ],
  },
  {
    key: 'category',
    options: [
      { label: '전체', value: '' },
      { label: '사진', value: '사진' },
      { label: '자연미술', value: '자연미술' },
      { label: '건축', value: '건축' },
      { label: '미디어아트', value: '미디어아트' },
      { label: '추상화', value: '추상화' },
      { label: '조각', value: '조각' },
      { label: '설치미술', value: '설치미술' },
      { label: '초상화', value: '초상화' },
      { label: '복합매체', value: '복합매체' },
    ],
  },
  {
    key: 'status',
    options: [
      { label: '현재전시', value: 'exhibited' },
      { label: '종료전시', value: 'ended' },
      { label: '예정전시', value: 'scheduled' },
    ],
  },
];
