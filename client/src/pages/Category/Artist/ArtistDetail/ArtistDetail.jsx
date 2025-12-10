import styles from './ArtistDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userInstance } from '../../../../apis/instance.js';
import DetailTabs from '../../../../components/DetailTabs/DetailTabs.jsx';
import ExhibitionsCards from '../../Gallery/GalleryDetail/components/ExhibitionsCards/ExhibitionsCards.jsx';
import { FaHome, FaStar, FaShare } from 'react-icons/fa';
import { useUser } from '../../../../store/UserProvider.jsx';
import { useAlert } from '../../../../store/AlertProvider.jsx';

export default function ArtistDetail() {
  const { user } = useUser();
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artistData, setArtistData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const { showAlert } = useAlert();
  const getArtistDetail = async () => {
    if (!artistId) return;
    try {
      const response = await userInstance.get(`/api/artists/${artistId}`);
      setArtistData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getArtistDetail();
  }, [artistId]);

  if (!artistData) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  const {
    artist_name: name = '작가',
    artist_nation: nation = '',
    artist_category: category = '',
    artist_image: image = '',
    artist_description: description = '',
    artist_homepage: homepage = '',
    is_liked: isLiked,
    is_on_exhibition: isOnExhibition,
    like_count: likeCount,
    exhibitions = [],
    artworks = [],
  } = artistData;

  const sanitizedHomepage = homepage
    ? homepage.startsWith('http')
      ? homepage
      : `https://${homepage}`
    : '';

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
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
      console.error('관심 작가 처리 실패:', error);
    }
  };

  const handleHomepage = () => {
    if (!sanitizedHomepage) return;
    window.open(sanitizedHomepage, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: `ARTLY: ${name}`,
          text: `${name} 작가 정보를 확인해보세요!`,
          url,
        })
        .catch((error) => console.error('공유 실패:', error));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showAlert('링크가 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        showAlert('링크 복사에 실패했습니다.', 'error');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const infoList = [
    { label: '국적', content: nation || '정보 없음' },
    { label: '분야', content: category || '정보 없음' },
    {
      label: '진행 상태',
      content: isOnExhibition ? '전시 중' : '현재 전시 없음',
    },
    {
      label: '관심 작가',
      content: `${likeCount.toLocaleString()}명`,
    },
  ];

  const detailTabs = [
    { key: 'profile', label: '프로필' },
    { key: 'exhibitions', label: `전시 (${exhibitions.length || 0})` },
    { key: 'artworks', label: `작품 (${artworks.length || 0})` },
  ];

  const getExhibitionStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return 'default';
    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);

    if (today < start) return 'scheduled';
    if (today > end) return 'ended';
    return 'exhibited';
  };

  const renderExhibitions = () => {
    if (!exhibitions.length) {
      return <p className={styles.emptyContent}>참여한 전시가 없습니다.</p>;
    }

    const normalizedExhibitions = exhibitions.map((item = {}) => {
      const status = getExhibitionStatus(
        item.exhibition_start_date,
        item.exhibition_end_date,
      );

      return {
        exhibition_id: item.id,
        exhibition_poster: item.exhibition_poster,
        exhibition_title: item.exhibition_title,
        exhibition_status: status,
        exhibition_location:
          item.exhibition_location || item.location || '위치 정보 없음',
        exhibition_start_date: item.exhibition_start_date,
        exhibition_end_date: item.exhibition_end_date,
      };
    });

    return <ExhibitionsCards exhibitions={normalizedExhibitions} />;
  };

  const renderArtworks = () => {
    if (!artworks.length) {
      return <p className={styles.emptyContent}>등록된 작품이 없습니다.</p>;
    }

    return (
      <div className={styles.artworkGrid}>
        {artworks.map(({ id, art_title, art_image, title, imageUrl }) => {
          const artworkTitle = art_title || title || '작품';
          const artworkImage = art_image || imageUrl || '';
          return (
            <div className={styles.artworkCard} key={`${id}-${artworkTitle}`}>
              <img
                className={styles.artworkImage}
                src={artworkImage}
                alt={artworkTitle}
              />
              <p className={styles.artworkTitle}>{artworkTitle}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.layout}>
      <div className={styles.breadcrumb}>
        <span
          className={styles.breadcrumbBack}
          onClick={() => navigate('/artists')}
        >
          작가
        </span>{' '}
        &gt; {name}
      </div>

      <div className={styles.card}>
        <img
          className={styles.artistImage}
          src={image}
          alt={`${name} 대표 이미지`}
        />
        {isOnExhibition && <div className={styles.statusBadge}>전시중</div>}

        <section className={styles.titleSection}>
          <h1 className={styles.artistTitle}>{name}</h1>
          {(nation || category) && (
            <p className={styles.artistSubTitle}>
              {[nation, category].filter(Boolean).join(' | ')}
            </p>
          )}
        </section>

        <div className={styles.btnLayout}>
          <button className={styles.actionButton} onClick={handleLike}>
            <FaStar
              className={`${styles.icon} ${isLiked ? styles.likedIcon : ''}`}
            />
            관심 작가
          </button>
          <button
            className={styles.actionButton}
            disabled={!sanitizedHomepage}
            onClick={handleHomepage}
          >
            <FaHome className={styles.icon} />
            홈페이지
          </button>
          <button className={styles.actionButton} onClick={handleShare}>
            <FaShare className={styles.icon} />
            공유하기
          </button>
        </div>

        <section className={styles.infoList}>
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
        </section>
      </div>

      <DetailTabs
        tabs={detailTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {activeTab === 'profile' &&
          (description ? (
            <div
              className={styles.descriptionParagraph}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className={styles.emptyContent}>등록된 소개가 없습니다.</p>
          ))}

        {activeTab === 'exhibitions' && renderExhibitions()}

        {activeTab === 'artworks' && renderArtworks()}
      </DetailTabs>

      <button
        className={styles.backButton}
        onClick={() => navigate('/artists')}
      >
        목록으로 돌아가기
      </button>
    </div>
  );
}
