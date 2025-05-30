import styles from './Galleries.module.css';
import { Link } from 'react-router-dom';
import { instance } from '../../apis/instance.js';
import { useEffect, useState } from 'react';
import ListHeader from '../../components/List/ListHeader/ListHeader';
import DropdownContainer from '../../components/List/DropdownContainer/DropdownContainer';
import { galleryFilter } from '../../utils/filters/galleryFilter.js';

export default function Galleries() {
  const [galleries, setGalleries] = useState([]);

  const getGalleies = async () => {
    try {
      const response = await instance.get('/api/galleries');

      setGalleries(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getGalleies();
  }, []);

  console.log(galleries);

  return (
    <div className={styles.layout}>
      <ListHeader title='갤러리' placeholder='갤러리명 검색' />
      <DropdownContainer filterList={galleryFilter} />
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
