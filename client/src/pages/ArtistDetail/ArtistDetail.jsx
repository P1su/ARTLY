import styles from './ArtistDetail.module.css';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance, userInstance } from '../../apis/instance.js';
import ArtistActivity from './components/ArtistActivity/ArtistActivity';
import { FaGlobe, FaHeart, FaShare } from 'react-icons/fa';

export default function ArtistDetail() {
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState([]);

  const getArtistDetail = async () => {
    try {
      const response = await instance.get(`/api/artists/${artistId}`);

      setArtistData(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getArtistDetail();
  }, []);

  const handleLike = async () => {
    try {
      if (artistData.is_liked === '1') {
        await userInstance.delete('/api/likes', {
          data: {
            liked_id: artistId,
            liked_type: 'artist',
          },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: artistId,
          liked_type: 'artist',
        });
      }

      await getArtistDetail();
    } catch (error) {
      console.error(error);
      alert('좋아요 처리 실패');
    }
  };

  const buttons = [
    {
      label: '관심 작가',
      icon: (
        <FaHeart
          className={`${styles.icon} ${artistData.is_liked === '1' && styles.icHeart}`}
        />
      ),
      action: handleLike,
    },
    {
      label: '홈페이지',
      icon: <FaGlobe className={styles.icon} />,
      action: () => {
        alert('구현 중에 있습니다.');
      },
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
      <section className={styles.infoSection}>
        <img
          className={styles.artistImage}
          src={artistData.imageUrl}
          alt='작가 대표 이미지'
        />
        <h3 className={styles.artistTitle}>{artistData.name}</h3>
        <span className={styles.subSpan}>
          {artistData.nation} | {artistData.field}
        </span>
      </section>
      <div className={styles.buttonContainer}>
        {buttons.map(({ label, icon, action }) => (
          <button className={styles.subButton} key={label} onClick={action}>
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
      <ArtistActivity description={artistData.description} />
      <Link className={styles.backButton} to='/artists'>
        목록으로 돌아가기
      </Link>
    </div>
  );
}
