import styles from './GalleryDetail.module.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance, userInstance } from '../../apis/instance.js';
import {
  FaPhoneFlip,
  FaLocationDot,
  FaClock,
  FaGlobe,
  FaHeart,
} from 'react-icons/fa6';
import GalleryExhibitions from './components/GalleryExhibitions/GalleryExhibitions';
import useMap from '../Nearby/hooks/useMap';

export default function GalleryDetail() {
  const { galleryId } = useParams();
  const [galleryData, setGalleryData] = useState({});
  const navigate = useNavigate();

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

  const handleLike = async () => {
    !localStorage.getItem('ACCESS_TOKEN') && navigate('/login');

    try {
      if (galleryData.is_liked === true) {
        await userInstance.delete('/api/likes', {
          data: {
            liked_id: galleryId,
            liked_type: 'gallery',
          },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: galleryId,
          liked_type: 'gallery',
        });
      }

      await getGalleryDetail();
    } catch (error) {
      console.error(error);
    }
  };

  const {
    id,
    exhibitions,
    gallery_address: address,
    gallery_category: category,
    gallery_closed_day: closedDay,
    gallery_description: description,
    gallery_end_time: endTime,
    gallery_start_time: startTime,
    gallery_image: image,
    gallery_name: name,
    gallery_latitude: lat,
    gallery_longitude: lng,
  } = galleryData;

  const infoItems = [
    {
      label: 'location',
      icon: <FaLocationDot className={styles.icon} />,
      content: address,
    },
    {
      label: 'contact',
      icon: <FaPhoneFlip className={styles.icon} />,
      content: '',
    },
    {
      label: 'site',
      icon: <FaGlobe className={styles.icon} />,
      content: address,
    },
    {
      label: 'operatingHours',
      icon: <FaClock className={styles.icon} />,
      content: `${closedDay} 휴관, ${startTime} - ${endTime}`,
    },
  ];

  useMap({ lat, lng, id: `gallery-${id}-map`, title: name, location: address });

  return (
    <div className={styles.layout}>
      <h1 className={styles.galleryTitle}>{name}</h1>
      <section className={styles.infoSection}>
        <div className={styles.imageBox}>
          <img
            className={styles.galleryImage}
            src={image}
            alt='갤러리 대표 이미지'
          />
          <button className={styles.favButton} onClick={handleLike}>
            <FaHeart
              className={`${styles.icHeart} ${galleryData.is_liked === true && styles.isClicked} `}
            />
          </button>
        </div>
        <span className={styles.categorySpan}>{category}</span>
        <p className={styles.descriptionParagraph}>{description}</p>
        {infoItems.map(({ label, icon, content }) => (
          <div className={styles.infoItemContainer} key={label}>
            {icon}
            <p className={styles.infoParagraph}>{content}</p>
          </div>
        ))}
      </section>
      <section className={styles.descriptionSection} />
      {exhibitions && <GalleryExhibitions exhibitions={exhibitions} />}
      <div className={styles.mapContainer}>
        <h3 className={styles.mapTitle}>찾아오시는 길</h3>
        <div id={`gallery-${id}-map`} className={styles.galleryMap} />
      </div>
      <Link className={styles.backButton} to='/galleries'>
        목록으로 돌아가기
      </Link>
    </div>
  );
}
