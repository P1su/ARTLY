import styles from './GalleryDetail.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import { mockGalleryDetail } from './mock/mockGalleryDetail.js';
import GalleryExhibitions from './components/GalleryExhibitions/GalleryExhibitions';

export default function GalleryDetail() {
  const { galleryId } = useParams();
  const [galleryData, setGalleryData] = useState({});

  const getGalleryDetail = async () => {
    try {
      const response = await instance.get(`/api/galleries/${galleryId}`);
      setGalleryData(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getGalleryDetail();
  }, []);

  const {
    exhibitions,
    gallery_address: address,
    gallery_category: category,
    gallery_closed_day: closedDay,
    gallery_description: description,
    gallery_end_time: endTime,
    gallery_start_time: startTime,
    gallery_image: image,
    gallery_name: name,
  } = galleryData;

  return (
    <div className={styles.layout}>
      <section className={styles.infoSection}>
        <img
          className={styles.galleryImage}
          src={image}
          alt='갤러리 대표 이미지'
        />
        <span className={styles.titleSpan}>{name}</span>
        <span>
          <strong>주소: </strong>
          {address}
        </span>
        <span>
          <strong>휴관일: </strong>
          {closedDay}
        </span>
        <span>
          <strong>운영 시간: </strong>
          {startTime} - {endTime}
        </span>
      </section>
      <section className={styles.descriptionSection}>
        <span className={styles.descriptionTitleSpan}>갤러리 소개</span>
        <p className={styles.descriptionParagraph}>{description}</p>
      </section>
      <GalleryExhibitions exhibitions={exhibitions} />
    </div>
  );
}
