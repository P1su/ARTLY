export const filterCategory = (category) => {
  switch (category) {
    case 'exhibition':
      return {
        label: '전시회',
        link: 'exhibitions',
      };
    case 'gallery':
      return {
        label: '갤러리',
        link: 'galleries',
      };
    case 'artist':
      return {
        label: '작가',
        link: 'artists',
      };
    case 'notice':
      return {
        label: '공고',
        link: 'notices',
      };
    default:
      break;
  }
};
