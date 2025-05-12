import styles from './GalleryDetail.module.css';
import { useParams } from 'react-router-dom';
import { mockGalleryDetail } from './mock/mockGalleryDetail.js';
import GalleryExhibitions from './components/GalleryExhibitions/GalleryExhibitions';

export default function GalleryDetail() {
  const { galleryId } = useParams();
  console.log(galleryId);

  return (
    <div className={styles.layout}>
      <section className={styles.infoSection}>
        <img
          className={styles.galleryImage}
          src={mockGalleryDetail.galleryImage}
          alt='갤러리 대표 이미지'
        />
        <span className={styles.titleSpan}>
          {mockGalleryDetail.galleryName}
        </span>
        <span>{mockGalleryDetail.galleryAddress}</span>
        <span>{mockGalleryDetail.operatingHours}</span>
      </section>
      <section className={styles.descriptionSection}>
        <span className={styles.descriptionTitleSpan}>갤러리 소개</span>
        <p className={styles.descriptionParagraph}>
          {mockGalleryDetail.galleryDescription}
        </p>
      </section>
      <GalleryExhibitions />
    </div>
  );
}
