export const filterResults = (results, category) => {
  switch (category) {
    case 'exhibition':
      return results?.map((item) => ({
        id: item.id,
        thumbnail: item.exhibition_poster,
        title: item.exhibition_title,
      }));
    case 'gallery':
      return results?.map((item) => ({
        id: item.id,
        thumbnail: item.gallery_image,
        title: item.gallery_name,
      }));
    case 'artist':
      return results?.map((item) => ({
        id: item.id,
        thumbnail: item.artist_image,
        title: item.artist_name,
      }));
    case 'notice':
      return results?.map((item) => ({
        id: item.id,
        thumbnail: item.announcement_poster,
        title: item.announcement_title,
      }));
    default:
      break;
  }
};
