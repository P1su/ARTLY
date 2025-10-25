export const getExhibitionStatus = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) {
    return 'upcoming'; // 전시 예정
  } else if (today > end) {
    return 'ended'; // 전시 종료
  } else {
    return 'ongoing'; // 전시 중
  }
};
