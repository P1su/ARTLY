import styles from './Galleries.module.css';
import { mockGalleryList } from './mock/mockGalleryList.js';
import { Link } from 'react-router-dom';
import { instance } from '../../apis/instance.js';
import { useEffect, useState } from 'react';

export default function Galleries() {
  const [galleries, setGalleries] = useState([]);

  const getGalleies = async () => {
    try {
      const response = await instance.get('/api/galleries');
      setGalleries(response.data);
    } catch {
      throw new Error('API 연결 실패');
    }
  };

  useEffect(() => {
    getGalleies();
  }, []);

  console.log(galleries);

  return (
    <div className={styles.layout}>
      {galleries.map(({ id, image, name, galleryAddress, operatingHours }) => (
        <Link
          className={styles.galleryItemContainer}
          key={id}
          to={`/galleries/${id}`}
        >
          <img
            className={styles.galleryItemImage}
            src={image}
            alt='갤러리 대표 이미지'
          />
          <div className={styles.galleryInfoContainer}>
            <span className={styles.titleSpan}>{name}</span>
            <span>{galleryAddress}</span>
            <span>{operatingHours}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
