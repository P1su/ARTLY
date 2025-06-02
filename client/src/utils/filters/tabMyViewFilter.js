const tabMyViewFilter = [
  {
    key: 'date',
    options: [
      { label: '최신순', value: 'latest' },
      { label: '오래된순', value: 'oldest' },
    ],
  },
  {
    key: 'status',
    options: [
      { label: '관람전체', value: 'all' },
      { label: '관람신청', value: 'scheduled' },
      { label: '관람중', value: 'exhibited' },
      { label: '관람완료', value: 'closed' },
    ],
  },
];
export default tabMyViewFilter;
