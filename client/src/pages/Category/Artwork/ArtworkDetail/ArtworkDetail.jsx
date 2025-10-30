import styles from './ArtworkDetail.module.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaHeart, FaShare } from 'react-icons/fa';
import { userInstance } from '../../../../apis/instance';

export default function ArtworkDetail({ showUserActions = true, id: propId }) {
  const { artworkId } = useParams();
  const id = propId || artworkId;
  const navigate = useNavigate();

  const [artworkData, setArtworkData] = useState(null);
  useEffect(() => {
    const fetchArtworkDetail = async () => {
      try {
        const res = await userInstance.get(`/api/arts/${id}`);
        setArtworkData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };
    if (id) fetchArtworkDetail();
  }, [id]);

  if (!artworkData) return <div className={styles.loading}>로딩 중...</div>;

  const handleLike = () => alert('작품 좋아요 기능은 api 준비 중입니다.');
  const handlePurchase = () => alert('구매문의 기능은 준비 중입니다.');

  const handleShare = () => {
    const { exhibition_name: name } = exhibitionData;
    const url = window.location.href;
    if (navigator.share) {
      // Web Share API 지원 시
      navigator
        .share({
          title: `ARTLY: ${name}`,
          text: `${name} 갤러리 정보를 확인해보세요!`,
          url: url,
        })
        .catch((error) => console.error('공유 실패:', error));
    } else {
      // 미지원 시 클립보드 복사
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('링크가 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        alert('링크 복사에 실패했습니다.');
      }
      document.body.removeChild(textArea);
    }
  };

  const {
    art_title,
    artist_name,
    art_description,
    art_docent,
    art_material,
    art_size,
    art_image,
    is_liked: isLike,
    recommended,
  } = artworkData;

  const actionButtons = [
    {
      label: '좋아요',
      icon: (
        <FaHeart
          className={`${styles.actionIcon} ${isLike && styles.isClicked}`}
        />
      ),
      action: handleLike,
    },
    {
      label: '구매문의',
      icon: <FaCheckCircle className={styles.actionIcon} />,
      action: handlePurchase,
    },
    {
      label: '공유하기',
      icon: <FaShare className={styles.actionIcon} />,
      action: handleShare,
    },
  ];

  return (
    <div className={styles.layout}>
      <div className={styles.artworkCard}>
        <img src={art_image} alt={art_title} className={styles.mainImage} />
        <h2 className={styles.title}>{art_title}</h2>
        <p className={styles.subtitle}>{artist_name}</p>

        {showUserActions && (
          <div className={styles.actionButtonContainer}>
            {actionButtons.map(({ label, icon, action }) => (
              <button
                className={styles.actionButton}
                key={label}
                onClick={action}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 작품 설명 */}
      {/* 작품 정보 카드 */}
      <div className={styles.infoCard}>
        <div className={styles.artistHeader}>
          <img
            src={
              artworkData.artist_profile_image || '/images/default_artist.png'
            }
            alt={artist_name}
            className={styles.artistImage}
          />
          <span className={styles.artistName}>{artist_name}</span>
        </div>

        <ul className={styles.detailList}>
          <li>
            <span className={styles.label}>제작연도</span>
            <span className={styles.value}>
              {artworkData.art_year || '정보 없음'}
            </span>
          </li>
          <li>
            <span className={styles.label}>재료</span>
            <span className={styles.value}>{art_material || '정보 없음'}</span>
          </li>
          <li>
            <span className={styles.label}>크기</span>
            <span className={styles.value}>{art_size || '정보 없음'}</span>
          </li>
          <li>
            <span className={styles.label}>가격</span>
            <span className={styles.value}>
              {artworkData.art_price
                ? `${artworkData.art_price.toLocaleString()}원`
                : '정보 없음'}
            </span>
          </li>
        </ul>

        <p className={styles.description}>
          {art_description || '작품 설명이 등록되지 않았습니다.'}
        </p>

        {art_docent && (
          <p className={styles.docent}>
            <h3 className={styles.docentTitle}>AI 도슨트</h3>
            <p className={styles.docentDesc}>{art_docent}</p>
          </p>
        )}
      </div>

      {/* 추천 작품 */}
      {showUserActions && (
        <>
          <div className={styles.infoCard}>
            <h3 className={styles.sectionTitle}>추천 작품</h3>
            {!recommended || recommended.length === 0 ? (
              <p className={styles.emptyContent}>연관 추천 작품이 없습니다.</p>
            ) : (
              <>
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
              </>
            )}
          </div>

          <Link className={styles.backButton} to='/artworks'>
            목록으로
          </Link>
        </>
      )}
    </div>
  );
}
