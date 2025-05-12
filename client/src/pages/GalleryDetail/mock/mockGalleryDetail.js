import mockImage from './mockGalleryImage.png';
import mockExhibitionImage from './mockExhibitionImage.png';

export const mockGalleryDetail = {
  galleryId: 0,
  galleryImage: mockImage,
  galleryName: '종로 갤러리',
  galleryAddress: '서울시 종로구 항공로 123',
  operatingHours: '10:00 ~ 18:00',
  galleryDescription:
    '도심 속에 숨겨진 예술의 쉼터, ‘아르떼 갤러리’는 현대 미술과 감각적인 전시로 관람객을 맞이합니다.\n다양한 장르의 국내외 작가들을 조명하며 새로운 시각적 경험을 선사합니다.\n자연광이 스며드는 전시 공간은 작품과 관람객 사이의 거리를 자연스럽게 좁혀줍니다.\n정기적으로 열리는 기획전과 작가와의 대화 프로그램은 예술의 깊이를 더해줍니다.\n갤러리 내 아트숍과 카페는 문화적 일상을 누릴 수 있는 여유로운 공간입니다.\n모든 세대가 예술을 즐기고 공감할 수 있도록 열린 문화를 지향합니다.\n‘아르떼 갤러리’에서 일상 속 특별한 예술의 순간을 만나보세요.',
  exhibitions: {
    operating: [
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
        exhibitionTitle: '전시회 1',
        exhibitionAddress: '동대문 갤러리 / 서울',
        exhibitionDate: '2025-04-28 ~ 2025-05-25',
      },
      {
        exhibitionId: 2,
        exhibitionImage: mockExhibitionImage,
        exhibitionTitle: '전시회 1',
        exhibitionAddress: '동대문 갤러리 / 서울',
        exhibitionDate: '2025-04-28 ~ 2025-05-25',
      },
      {
        exhibitionId: 3,
        exhibitionImage: mockExhibitionImage,
        exhibitionTitle: '전시회 1',
        exhibitionAddress: '동대문 갤러리 / 서울',
        exhibitionDate: '2025-04-28 ~ 2025-05-25',
      },
      {
        exhibitionId: 4,
        exhibitionImage: mockExhibitionImage,
        exhibitionTitle: '전시회 1',
        exhibitionAddress: '동대문 갤러리 / 서울',
        exhibitionDate: '2025-04-28 ~ 2025-05-25',
      },
    ],
    scheduled: [
      {
        exhibitionId: 0,
        exhibitionImage: mockExhibitionImage,
        exhibitionTitle: '예정 전시회 1',
        exhibitionAddress: '동대문 갤러리 / 서울',
        exhibitionDate: '2025-04-28 ~ 2025-05-25',
      },
      {
        exhibitionId: 1,
        exhibitionImage: mockExhibitionImage,
        exhibitionTitle: '예정 전시회 2',
        exhibitionAddress: '동대문 갤러리 / 서울',
        exhibitionDate: '2025-04-28 ~ 2025-05-25',
      },
      {
        exhibitionId: 2,
        exhibitionImage: mockExhibitionImage,
        exhibitionTitle: '예정 전시회 3',
        exhibitionAddress: '동대문 갤러리 / 서울',
        exhibitionDate: '2025-04-28 ~ 2025-05-25',
      },
    ],
  },
};
