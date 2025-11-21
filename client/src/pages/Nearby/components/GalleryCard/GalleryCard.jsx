import styles from './GalleryCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import IcFav from './../../../../assets/svg/IcFav';
import IcUnFav from './../../../../assets/svg/IcUnFav';
import { userInstance } from './../../../../apis/instance';
import { useUser } from '../../../../store/UserProvider.jsx';

export default function GalleryCard({ galleryItem, onEvent }) {
  const { user } = useUser();
  const {
    id,
    gallery_name: name,
    gallery_image: image,
    gallery_address: address,
    gallery_start_time: startTime,
    gallery_end_time: endTime,
    is_liked: isLike,
  } = galleryItem;

  const formatTime = (time) => {
    if (time) {
      const parsedTime = time.slice(0, 5);
      return parsedTime;
    }
  };

  const navigate = useNavigate();

  const handleLike = async () => {
    !user && navigate('/login');
    try {
      if (isLike === true) {
        await userInstance.delete('/api/likes', {
          data: {
            liked_id: id,
            liked_type: 'gallery',
          },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: id,
          liked_type: 'gallery',
        });
      }

      await onEvent();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.layout}>
      <Link className={styles.linkContainer} to={`/galleries/${id}`}>
        <img
          className={styles.galleryImage}
          src={image}
          alt={`${name} 대표 이미지`}
        />
        <button
          className={styles.favButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLike();
          }}
        >
          {isLike ? <IcFav /> : <IcUnFav />}
        </button>
        <div className={styles.infoContainer}>
          <h3 className={styles.galleryTitle}>{name}</h3>
          <p className={styles.addressParagraph}>{address}</p>
          <p className={styles.addressParagraph}>
            {formatTime(startTime)} ~ {formatTime(endTime)}
          </p>
        </div>
      </Link>
    </div>
  );
}
