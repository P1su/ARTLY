import styles from './GalleryDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaStar,
  FaShare,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaLink,
  FaLocationDot,
} from 'react-icons/fa6';
import DetailTabs from '../../../../components/DetailTabs/DetailTabs.jsx';
import { userInstance } from '../../../../apis/instance.js';
import ExhibitionsCards from './components/ExhibitionsCards/ExhibitionsCards.jsx';
import ArtworksCards from '../../../../pages_console/ConsoleDetail/components/ArtworksCards/ArtworksCards.jsx';
import MapModalSimple from './components/MapModalSimple.jsx';
import LikePopup from './components/LikePopup.jsx';
import { useToastContext } from '../../../../store/ToastProvider.jsx';

export default function GalleryDetail({ showUserActions = true, id: propId }) {
  const { galleryId } = useParams();
  const id = propId || galleryId;
  const navigate = useNavigate();

  const { addToast } = useToastContext();

  const [galleryData, setGalleryData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikePopup, setShowLikePopup] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [showMapModal, setShowMapModal] = useState(false);

  const fetchGalleryDetail = async () => {
    if (!id) return;

    try {
      const res = await userInstance.get(`/api/galleries/${id}`);
      const { data } = res;
      setGalleryData(data);
      if (typeof data.is_liked === 'boolean') setIsLiked(data.is_liked);
    } catch (error) {
      console.error('갤러리 상세 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchGalleryDetail();
  }, [id]);

  useEffect(() => {
    if (galleryData && typeof galleryData.is_liked === 'boolean') {
      setIsLiked(galleryData.is_liked);
    }
  }, [galleryData]);

  if (!galleryData) return <div>로딩 중...</div>;

  const handleLike = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
      return;
    }
    try {
      const payload = { liked_id: id, liked_type: 'gallery' };
      if (isLiked) {
        await userInstance.delete('/api/likes', { data: payload });
        setIsLiked(false);
        return;
      } else {
        await userInstance.post('/api/likes', {
          liked_id: id,
          liked_type: 'gallery',
        });
        addToast({
          title: '좋아하는 갤러리로 추가 완료!',
          message: '나의 좋아요 목록은 마이페이지에서 확인할 수 있어요.',
        });
      }

      await userInstance.post('/api/likes', payload);
      setIsLiked(true);
      setShowLikePopup(true);
    } catch (error) {
      console.error('관심 처리 실패:', error);
    }
  };

  const handleShare = () => {
    const name = galleryData.gallery_name;
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: `ARTLY: ${name}`,
          text: `${name} 갤러리 정보를 확인해보세요!`,
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
        alert('링크가 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        alert('링크 복사에 실패했습니다.');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const SNS_ICONS = {
    instagram: FaInstagram,
    twitter: FaTwitter,
    facebook: FaFacebook,
    youtube: FaYoutube,
    default: FaLink,
  };

  const {
    exhibitions = [],
    artworks = [],
    gallery_address: address = '',
    gallery_category: category = '',
    gallery_closed_day: closedDay = '',
    gallery_description: description = '',
    gallery_end_time: endTime = '',
    gallery_start_time: startTime = '',
    gallery_image: image = '',
    gallery_name: name = '',
    gallery_eng_name: nameEn = '',
    gallery_phone: phone = '',
    gallery_email: email = '',
    gallery_homepage: homepage = '',
    gallery_sns: snsArray = [],
    gallery_latitude: lat,
    gallery_longitude: lng,
  } = galleryData;

  const infoList = [
    {
      label: '관람시간',
      content:
        startTime && endTime
          ? `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`
          : '정보 없음',
    },
    { label: '휴관일', content: closedDay || '정보 없음' },
    { label: '전화번호', content: phone || '정보 없음' },
    { label: '주소', content: address || '정보 없음' },
    {
      label: '이메일',
      content: email ? <a href={`mailto:${email}`}>{email}</a> : '정보 없음',
    },
    {
      label: 'SNS',
      content:
        Array.isArray(snsArray) && snsArray.length > 0 ? (
          <div className={styles.inlineSns}>
            {snsArray.map(({ type, url }) => {
              const Icon = SNS_ICONS[type?.toLowerCase()] || SNS_ICONS.default;
              return (
                <a
                  key={`${type}-${url}`}
                  href={url || '#'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.snsLink}
                >
                  <Icon className={styles.snsIcon} />
                </a>
              );
            })}
          </div>
        ) : (
          '정보 없음'
        ),
    },
  ];

  const detailTabs = [
    { key: 'info', label: '정보' },
    { key: 'artworks', label: `작품(${artworks.length || 0})` },
    { key: 'exhibitions', label: `전시(${exhibitions.length || 0})` },
  ];

  const mapId = `gallery-${id}-map`;
  console.log('lat:', lat, 'lng:', lng);
  console.log('showMapModal:', showMapModal);

  return (
    <div className={styles.layout}>
      {showUserActions && (
        <div className={styles.breadcrumb}>
          <span
            className={styles.breadcrumbBack}
            onClick={() => navigate('/galleries')}
          >
            갤러리
          </span>{' '}
          &gt; {name}
        </div>
      )}

      <section className={styles.titleSection}>
        <h1 className={styles.galleryTitle}>{name}</h1>
        <p className={styles.gallerySubTitle}>{nameEn || 'Gallery'}</p>
      </section>

      <div className={styles.card}>
        <img
          className={styles.galleryImage}
          src={image}
          alt='갤러리 대표 이미지'
        />

        {showUserActions && (
          <div className={styles.btnLayout}>
            <button className={styles.likeButton} onClick={handleLike}>
              <FaStar className={isLiked ? styles.likedIcon : styles.icon} />
              관심있어요
            </button>
            <button
              className={styles.likeButton}
              onClick={() => setShowMapModal(true)}
            >
              <FaLocationDot className={styles.icon} />
              위치보기
            </button>
            <button className={styles.likeButton} onClick={handleShare}>
              <FaShare className={styles.icon} />
              공유하기
            </button>
          </div>
        )}

        <div className={styles.tagContainer}>
          {category &&
            category.split(',').map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag.trim()}
              </span>
            ))}
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

          <button
            disabled={!homepage}
            className={styles.homepageButton}
            onClick={() => window.open(homepage, '_blank')}
          >
            {homepage ? '홈페이지' : '홈페이지 정보 없음'}
          </button>
        </section>
      </div>

      <DetailTabs
        tabs={detailTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {activeTab === 'info' &&
          (description ? (
            <div
              className={styles.descriptionParagraph}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className={styles.emptyContent}>현재 등록된 정보가 없습니다.</p>
          ))}

        {activeTab === 'artworks' &&
          (artworks.length > 0 ? (
            <ArtworksCards artworks={artworks} />
          ) : (
            <p className={styles.emptyContent}>등록된 작품이 없습니다.</p>
          ))}

        {activeTab === 'exhibitions' &&
          (exhibitions.length > 0 ? (
            <ExhibitionsCards exhibitions={exhibitions} />
          ) : (
            <p className={styles.emptyContent}>현재 전시가 없습니다.</p>
          ))}
      </DetailTabs>

      {showUserActions && (
        <button
          className={styles.backButton}
          onClick={() => navigate('/galleries')}
        >
          목록으로 돌아가기
        </button>
      )}

      {showMapModal && (
        <MapModalSimple
          lat={lat}
          lng={lng}
          title={name}
          address={address}
          mapId={mapId}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {showLikePopup && <LikePopup onClose={() => setShowLikePopup(false)} />}
    </div>
  );
}
