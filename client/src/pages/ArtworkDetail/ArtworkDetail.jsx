import styles from './ArtworkDetail.module.css';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { instance, userInstance } from '../../apis/instance.js';
import { FaHeart, FaShare } from 'react-icons/fa';

export default function ArtworkDetail() {
  const { artworkId } = useParams();
  const [artworkData, setArtworkData] = useState([]);
  const [isLike, setIsLike] = useState('false');

  useEffect(() => {
    const getArtworkDetail = async () => {
      try {
        const response = await instance.get(`/api/arts/${artworkId}`);

        setArtworkData(response.data);
      } catch (error) {
        throw new Error(error);
      }
    };

    getArtworkDetail();
  }, []);

  const handleLike = () => {
    const postArtistLike = async () => {
      try {
        await userInstance.post('/api/likes', {
          liked_id: artworkId,
          liked_type: 'art',
        });
      } catch (error) {
        console.error(error);
        alert('좋아요 실패');
      }
    };

    const deleteArtistLike = async () => {
      try {
        await userInstance.delete('/api/likes', {
          liked_id: artworkId,
          liked_type: 'art',
        });
      } catch (error) {
        console.error(error);
        alert('좋아요 실패');
      }
    };

    if (isLike) {
      deleteArtistLike();
      setIsLike(false);
    } else {
      postArtistLike();
      setIsLike(true);
    }
  };

  const buttons = [
    {
      label: '관심 작품',
      icon: (
        <FaHeart className={`${styles.icon} ${isLike && styles.icHeart}`} />
      ),
      action: handleLike,
    },
    {
      label: '공유하기',
      icon: <FaShare className={styles.icon} />,
      action: () => {
        alert('구현 중에 있습니다.');
      },
    },
  ];

  return (
    <div className={styles.layout}>
      <img
        className={styles.artworkImage}
        src={artworkData.art_image}
        alt='작가 대표 이미지'
      />
      <div className={styles.buttonContainer}>
        {buttons.map(({ label, icon, action }) => (
          <button className={styles.subButton} key={label} onClick={action}>
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
      <h1 className={styles.artworkTitle}>{artworkData.art_title}</h1>
      <p className={styles.artworkParagraph}>{artworkData.art_description}</p>
      <Link className={styles.backButton} to='/artworks'>
        목록으로 돌아가기
      </Link>
    </div>
  );
}
