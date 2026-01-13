import styles from './ArtistCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';
import { userInstance } from '../../../../../../apis/instance';
import Img from '../../../../../../components/Img/Img';
import Cookies from 'js-cookie';

export default function ArtistCard({ artistItem, onEvent }) {
  const {
    id,
    artist_name: name,
    artist_category: field,
    artist_image: imageUrl,
    artist_nation: nation,
    is_on_exhibition: isDisplaying,
    is_liked: isLike,
  } = artistItem;
  const navigate = useNavigate();

  const isLiked = isLike === '1' || isLike === true;

  const handleLike = async () => {
    console.log('isLike:', isLike, typeof isLike);
    if (!Cookies.get('ACCESS_TOKEN')) {
      navigate('/login');
      return;  
    }
    
    try {
      if (isLiked) {
        await userInstance.delete('/api/likes', {
          data: {
            liked_id: id,
            liked_type: 'artist',
          },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: id,
          liked_type: 'artist',
        });
      }
  
      await onEvent();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Link className={styles.layout} to={`/artists/${id}`}>
      <Img
        className={styles.artistImage}
        src={imageUrl}
        alt='작가 대표 이미지'
      />
      {isDisplaying === '1' && (
        <div className={styles.statusContainer}>전시중</div>
      )}
      <div className={styles.titleContainer}>
        <h3 className={styles.artistNameTitle}>{name}</h3>
        <button
          className={styles.favButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLike();
          }}
        >
          <FaStar className={isLiked ? styles.likedIcon : styles.icon} />
        </button>
      </div>
      <p className={styles.subParagraph}>{field}</p>
      <p className={styles.subParagraph}>{nation}</p>
    </Link>
  );
}
