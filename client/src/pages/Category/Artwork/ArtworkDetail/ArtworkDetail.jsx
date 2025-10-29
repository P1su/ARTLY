import styles from './ArtworkDetail.module.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { instance } from '../../../../apis/instance.js';
import { FaHeart, FaQrcode, FaShare } from 'react-icons/fa';

export default function ArtworkDetail({ showUserActions = true, id: propId }) {
  const { artworkId } = useParams();
  const id = propId || artworkId;
  const navigate = useNavigate();

  const [artworkData, setArtworkData] = useState(null);
  useEffect(() => {
    const fetchArtworkDetail = async () => {
      try {
        const res = await instance.get(`/api/arts/${id}`);
        setArtworkData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };
    if (id) fetchArtworkDetail();
  }, [id]);

  if (!artworkData) return <div className={styles.loading}>로딩 중...</div>;

  const handleLike = () => alert('좋아요 기능은 준비 중입니다.');
  const handleShare = () => alert('공유 기능은 준비 중입니다.');
  const handleDocent = () => navigate('/scan');

  const {
    art_title,
    artist_name,
    art_description,
    art_docent,
    art_material,
    art_size,
    art_image,
  } = artworkData;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.logo}>ARTLY</h1>
      </header>

      {/* 대표 이미지 + 제목 */}
      <div className={styles.artworkCard}>
        <img src={art_image} alt={art_title} className={styles.mainImage} />
        <h2 className={styles.title}>{art_title}</h2>
        <p className={styles.subtitle}>{artist_name}</p>

        {showUserActions && (
          <div className={styles.actionButtons}>
            <button onClick={handleLike}>
              <FaHeart />
              <span>좋아요</span>
            </button>
            <button>
              <FaQrcode onClick={handleDocent} />
              <span>도슨트</span>
            </button>
            <button onClick={handleShare}>
              <FaShare />
              <span>공유하기</span>
            </button>
          </div>
        )}
      </div>

      {/* 작품 설명 */}
      <div className={styles.infoCard}>
        <div className={styles.artistSection}>
          <p className={styles.artistName}>{artist_name}</p>
          <ul className={styles.detailList}>
            {art_material && <li>재료: {art_material}</li>}
            {art_size && <li>크기: {art_size}</li>}
          </ul>
          <p className={styles.description}>{art_description}</p>
          {art_docent && (
            <p className={styles.docent}>
              <strong>AI 도슨트:</strong> {art_docent}
            </p>
          )}
        </div>
      </div>

      {/* 추천 작품 */}
      {/* <div className={styles.relatedSection}>
        <h3 className={styles.sectionTitle}>추천 작품</h3>
        <div className={styles.relatedGrid}>
          {recommended.map((art) => (
            <div key={art.id} className={styles.relatedCard}>
              <img
                src={art.img}
                alt={art.title}
                className={styles.relatedImage}
              />
              <div className={styles.relatedInfo}>
                <h4 className={styles.relatedTitle}>{art.title}</h4>
                <p className={styles.relatedSub}>{art.material}</p>
                <p className={styles.relatedMeta}>
                  {art.size} | {art.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <Link className={styles.backButton} to='/artworks'>
        목록으로
      </Link>
    </div>
  );
}
