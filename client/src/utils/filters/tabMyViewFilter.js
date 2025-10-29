const tabMyViewFilter = [
  {
    label: '정렬',
    key: 'dateSort',
    options: [
      { label: '최신순', value: 'latest' },
      { label: '오래된순', value: 'oldest' },
    ],
  },
  {
    label: '관람상태',
    key: 'statusFilter',
    options: [
      { label: '전체', value: 'all' },
      { label: '관람신청', value: 'reserved' },
      { label: '관람완료', value: 'used' },
      { label: '취소', value: 'canceled' },
    ],
  },
];
export default tabMyViewFilter;
