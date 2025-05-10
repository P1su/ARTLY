import styles from './GalleryDetail.module.css';
import { useParams } from 'react-router-dom';
import { mockGalleryDetail } from './mock/mockGalleryDetail.js';
import GalleryExhibitions from './components/GalleryExhibitions/GalleryExhibitions';

export default function GalleryDetail() {
  const { galleryId } = useParams();
  console.log(galleryId);

  return (
    <div className={styles.layout}>
      <section>
        <img src={mockGalleryDetail.galleryImage} alt='갤러리 대표 이미지' />
        <span>{mockGalleryDetail.galleryName}</span>
        <span>{mockGalleryDetail.galleryAddress}</span>
        <span>{mockGalleryDetail.operatingHours}</span>
      </section>
      <section>
        <span>갤러리 소개</span>
        <p>{mockGalleryDetail.galleryDescription}</p>
      </section>
      <GalleryExhibitions />
    </div>
  );
}
