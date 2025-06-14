export const newsFilter = [
  {
    key: 'sort',
    options: [
      { label: '최신순', value: 'latest' },
      { label: '마감임박순', value: 'ending' },
    ],
  },
  {
    key: 'category',
    options: [
      { label: '전체', value: '' },
      { label: '공모', value: '공모' },
      { label: '프로그램', value: '프로그램' },
      { label: '채용', value: '채용' },
    ],
  },
  {
    key: 'status',
    options: [
      { label: '진행중', value: 'ongoing' },
      { label: '예정', value: 'scheduled' },
      { label: '종료', value: 'ended' },
    ],
  },
];
