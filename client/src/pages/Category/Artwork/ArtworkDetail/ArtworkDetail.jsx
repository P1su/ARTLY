import styles from './ArtworkDetail.module.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaStar, FaPhone, FaShare } from 'react-icons/fa6';
import { userInstance } from '../../../../apis/instance';
import LikePopup from '../../Gallery/GalleryDetail/components/LikePopup.jsx';
import { useToastContext } from '../../../../store/ToastProvider.jsx';
import PurchaseModal from './components/PurchaseModal/PurchaseModal.jsx';
import { FaChevronRight } from 'react-icons/fa';
import { useAlert } from '../../../../store/AlertProvider.jsx';

export default function ArtworkDetail({
  showUserActions = true,
  id: propId,
  actionButtons,
}) {
  const STATUS_CONFIG = {
    exhibited: { label: '진행중', className: styles.exhibited },
    scheduled: { label: '예정', className: styles.scheduled },
    ended: { label: '종료', className: styles.ended },
  };

  const { showAlert } = useAlert();

  const { artworkId } = useParams();
  const id = propId || artworkId;
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  const { pathname } = useLocation();
  const isConsole = pathname.includes('console');

  const [artworkData, setArtworkData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikePopup, setShowLikePopup] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const fetchArtworkDetail = async () => {
    if (!id) return;
    try {
      const res = await userInstance.get(`/api/arts/${id}`);
      const { data } = res;
      setArtworkData(data);
      if (typeof data.is_liked === 'boolean') setIsLiked(data.is_liked);
    } catch (error) {
      console.error('작품 상세 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchArtworkDetail();
  }, [id]);

  const handleLike = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
      return;
    }
    try {
      const payload = { liked_id: id, liked_type: 'art' };
      if (isLiked) {
        await userInstance.delete('/api/likes', { data: payload });
        setIsLiked(false);
      } else {
        await userInstance.post('/api/likes', payload);
        setIsLiked(true);
        setShowLikePopup(true);
      }
    } catch (error) {
      console.error('관심 처리 실패:', error);
      addToast({
        title: '오류',
        message: '좋아요 처리에 실패했습니다.',
        type: 'error',
      });
    }
  };

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleShare = () => {
    const name = artworkData?.art_title;
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({ title: `ARTLY: ${name}`, text: `${name} 작품 정보`, url })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => showAlert('링크가 복사되었습니다.'));
    }
  };

  if (!artworkData) return <div>로딩 중...</div>;

  const {
    art_title,
    art_description,
    art_image,
    art_year,
    art_material,
    art_size,
    art_docent,
    art_docent_video,
    gallery_phone,
    artist = {},
    artist_name,
    exhibitions = [],
  } = artworkData;

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const finalArtistName =
    artist?.artist_name || artist_name || 'Unknown Artist';
  const imageUrl =
    artist?.artist_image && !artist?.artist_image.startsWith('http')
      ? `${BASE_URL}/${artist?.artist_image}`
      : artist?.artist_image;
  const relatedArtworks = artist?.artworks || [];

  const filteredRelatedArtworks = relatedArtworks.filter(
    (art) => String(art.id) !== String(id),
  );

  const infoList = [
    { label: '제작연도', content: art_year ? `${art_year} 년` : '정보 없음' },
    { label: '재료', content: art_material || '정보 없음' },
    { label: '크기', content: art_size || '정보 없음' },
  ];

  const buttons = [
    {
      label: '관심있어요',
      icon: <FaStar className={isLiked ? styles.likedIcon : styles.icon} />,
      action: handleLike,
    },
    {
      label: '구매문의',
      icon: <FaPhone className={styles.icon} />,
      action: handlePurchase,
    },
    {
      label: '공유하기',
      icon: <FaShare className={styles.icon} />,
      action: handleShare,
    },
  ];

  return (
    <div className={styles.layout}>
      {showUserActions && (
        <div className={styles.breadcrumb}>
          <span
            className={styles.breadcrumbBack}
            onClick={() => navigate('/artworks')}
          >
            작품
          </span>{' '}
          &gt; {art_title}
        </div>
      )}

      <div className={styles.card}>
        <img src={art_image} alt={art_title} className={styles.mainImage} />

        <section className={styles.titleSection}>
          <h1 className={styles.artworkTitle}>{art_title}</h1>
          <p className={styles.artworkMaterial}>
            {art_material || 'Mixed Media'}
          </p>
        </section>

        {showUserActions && (
          <div className={styles.btnLayout}>
            {buttons.map(({ label, icon, action }) => (
              <button
                key={label}
                className={styles.actionButton}
                onClick={action}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}

        <hr className={styles.divider} />

        <div className={styles.artistSection}>
          <img
            src={imageUrl}
            alt={finalArtistName}
            className={styles.artistImage}
          />
          <span className={styles.artistName}>{finalArtistName}</span>
        </div>

        <div className={styles.infoList}>
          {infoList.map(({ label, content }) => {
            const isEmpty =
              !content ||
              (typeof content === 'string' && content.trim() === '정보 없음');

            return (
              <div className={styles.infoRow} key={label}>
                <span className={styles.infoLabel}>{label}</span>
                <div
                  className={`${styles.infoContent} ${
                    isEmpty ? styles.emptyInfo : ''
                  }`}
                >
                  {content}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.descriptionSection}>
          {art_description ? (
            <div
              className={styles.descriptionParagraph}
              dangerouslySetInnerHTML={{ __html: art_description }}
            />
          ) : (
            <p className={styles.emptyInfo}>작품 설명이 없습니다.</p>
          )}

          {art_docent && (
            <div className={styles.docentBox}>
              <span className={styles.docentLabel}>AI Docent</span>
              <p>{art_docent}</p>

              {/* 도슨트 동영상 url이 있는 경우 재생기 표시*/}
              {art_docent_video && (
                <div className={styles.docentVideoWrapper}>
                  <video
                    className={styles.docentVideo}
                    controls
                    preload='metadata'
                    src={art_docent_video}
                  >
                    브라우저가 비디오 재생을 지원하지 않습니다.
                  </video>
                </div>
              )}
            </div>
          )}
        </div>

        {actionButtons?.info}
      </div>

      {exhibitions && exhibitions.length > 0 && (
        <div className={styles.exhibitionSection}>
          <span className={styles.sectionTitle}>전시 정보</span>
          <div className={styles.exhibitionList}>
            {exhibitions.map((exh) => {
              const statusKey = exh.exhibition_status || 'ended';
              const statusInfo =
                STATUS_CONFIG[statusKey] || STATUS_CONFIG.ended;

              return (
                <div
                  key={exh.id}
                  className={styles.exhibitionItem}
                  onClick={() =>
                    isConsole
                      ? navigate(`/console/exhibitions/${exh.id}`)
                      : navigate(`/exhibitions/${exh.id}`)
                  }
                >
                  <div className={styles.exhibitionInfo}>
                    <span
                      className={`${styles.statusBadge} ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className={styles.exhibitionTitle}>
                        {exh.exhibition_title}
                      </span>
                      {exh.start_date && exh.end_date && (
                        <span className={styles.exhibitionDate}>
                          {exh.start_date} ~ {exh.end_date}
                        </span>
                      )}
                    </div>
                  </div>

                  <FaChevronRight className={styles.arrowIcon} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showUserActions && (
        <div className={styles.recommendSection}>
          <h3 className={styles.sectionTitle}>작가의 다른 작품</h3>
          {filteredRelatedArtworks.length > 0 ? (
            <div className={styles.relatedGrid}>
              {filteredRelatedArtworks.map((art) => (
                <div
                  key={art.id}
                  className={styles.relatedCard}
                  onClick={() => {
                    navigate(`/artworks/${art.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <img
                    src={art.art_image}
                    alt={art.art_title}
                    className={styles.relatedImage}
                  />
                  <div className={styles.relatedInfo}>
                    <h4 className={styles.relatedTitle}>{art.art_title}</h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.card}>
              <p className={styles.emptyContent}>
                작가의 다른 작품이 없습니다.
              </p>
            </div>
          )}

          <button
            className={styles.backButton}
            onClick={() => navigate('/artworks')}
          >
            목록으로
          </button>
        </div>
      )}

      {showLikePopup && (
        <LikePopup onClose={() => setShowLikePopup(false)} type='artworks' />
      )}

      {showPurchaseModal && (
        <PurchaseModal
          phoneNumber={gallery_phone}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </div>
  );
}
