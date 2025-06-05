import mockImage from './mockArtistImage.png';
import mockExhibitionImage from './mockExhibitionImage.png';
import mockArtworkImage from './mockArtworkImage.png';

export const mockArtistDetail = {
  aritstId: 0,
  artistName: '홍길동',
  artistImage: mockImage,
  artistCategory: '동양화',
  educations: [
    '2020 서울대학교 미술대학 동양화과 졸업',
    '2022 서울대학교 대학원 동양화과 졸업',
  ],
  careers: [
    '2020 서울 갤러리 개인전',
    '2021 홍대 갤러리 개인전',
    '2022 성수 갤러리 개인전',
    '2023 강남 갤러리 개인전',
    '2024 안국 갤러리 개인전',
    '2025 종로 갤러리 개인전',
  ],
  artworks: [
    {
      artworkId: 0,
      artworkImage: mockArtworkImage,
      artworkTitle: '미술작품 1',
      date: 2015,
      field: '조각',
    },
    {
      artworkId: 1,
      artworkImage: mockArtworkImage,
      artworkTitle: '미술작품 2',
      date: 2015,
      field: '조각',
    },
  ],
  exhibitions: [
    {
      exhibitionId: 0,
      exhibitionImage: mockExhibitionImage,
      exhibitionTitle: '전시회 1',
      exhibitionAddress: '동대문 갤러리 / 서울',
      exhibitionDate: '2025-04-28 ~ 2025-05-25',
    },
    {
      exhibitionId: 1,
      exhibitionImage: mockExhibitionImage,
      exhibitionTitle: '전시회 2',
      exhibitionAddress: '동대문 갤러리 / 서울',
      exhibitionDate: '2025-04-28 ~ 2025-05-25',
    },
  ],
};
