import styles from './GalleryDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance, userInstance } from '../../../../apis/instance.js';
import { FaHeart, FaLocationDot, FaShare } from 'react-icons/fa6';
import GalleryExhibitions from './components/GalleryExhibitions/GalleryExhibitions';
import GalleryArtworks from './components/GalleryArtworks/GalleryArtorks.jsx';
import MapModalContent from './components/MapModalContent/MapModalContent.jsx';

export default function GalleryDetail({ showUserActions = true, id: propId }) {
  const { galleryId } = useParams();
  const id = propId || galleryId;
  const [galleryData, setGalleryData] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  const fetchGalleryDetail = async () => {
    try {
      const response = await instance.get(`/api/galleries/${id}`);
      setGalleryData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowMap = () => {
    setModalType('map');
    setShowModal(true);
  };

  useEffect(() => {
    if (id) fetchGalleryDetail();
  }, [id]);

  if (!galleryData) return <div>로딩 중...</div>;

  const handleLike = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
      return;
    }
    try {
      if (galleryData.is_liked) {
        await userInstance.delete('/api/likes', {
          data: { liked_id: id, liked_type: 'gallery' },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: id,
          liked_type: 'gallery',
        });
        setModalType('like');
        setShowModal(true);
      }
      await fetchGalleryDetail();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = () => {
    const { gallery_name: name } = galleryData;
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
    exhibitions,
    artworks,
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
    gallery_name_en: nameEn,
    gallery_phone: phone,
    gallery_email: email,
    gallery_homepage: homepage,
  } = galleryData;

  const infoItems = [
    { label: '관람시간', content: `${startTime} - ${endTime}` },
    { label: '휴관일', content: closedDay },
    { label: '전화번호', content: phone || '정보 없음' },
    { label: '주소', content: address },
    {
      label: '이메일',
      content: email ? <a href={`mailto:${email}`}>{email}</a> : '정보 없음',
    },
    {
      label: '홈페이지',
      content: homepage ? (
        <a href={homepage} target='_blank' rel='noopener noreferrer'>
          {homepage}
        </a>
      ) : (
        '정보 없음'
      ),
    },
  ];

  return (
    <div className={styles.layout}>
      <section className={styles.titleSection}>
        <h1 className={styles.galleryTitle}>{name}</h1>
        <p className={styles.gallerySubTitle}>{nameEn || 'Gallery Name'}</p>
      </section>

      <div className={`${styles.card} ${styles.profileCard}`}>
        <img
          className={styles.galleryImage}
          src={image}
          alt='갤러리 대표 이미지'
        />

        {showUserActions && (
          <div className={styles.actionButtonContainer}>
            <button className={styles.actionButton} onClick={handleLike}>
              <FaHeart
                className={`${styles.actionIcon} ${
                  galleryData.is_liked && styles.isClicked
                }`}
              />
              관심있어요
            </button>
            <button className={styles.actionButton} onClick={handleShowMap}>
              <FaLocationDot className={styles.actionIcon} />
              위치보기
            </button>
            <button className={styles.actionButton} onClick={handleShare}>
              <FaShare className={styles.actionIcon} />
              공유하기
            </button>
          </div>
        )}

        <div className={styles.tagContainer}>
          {category?.split(',').map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag.trim()}
            </span>
          ))}
        </div>

        <section className={styles.infoList}>
          {infoItems.map(({ label, content }) => (
            <div className={styles.infoRow} key={label}>
              <span className={styles.infoLabel}>{label}</span>
              <div className={styles.infoContent}>{content}</div>
            </div>
          ))}
        </section>
      </div>

      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'info' && styles.activeTab
          }`}
          onClick={() => setActiveTab('info')}
        >
          정보
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'artworks' && styles.activeTab
          }`}
          onClick={() => setActiveTab('artworks')}
        >
          작품({artworks?.length || 0})
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'exhibitions' && styles.activeTab
          }`}
          onClick={() => setActiveTab('exhibitions')}
        >
          전시({exhibitions?.length || 0})
        </button>
      </nav>

      <section className={styles.tabContent}>
        {activeTab === 'info' && (
          <div
            className={styles.descriptionParagraph}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        {activeTab === 'artworks' && <GalleryArtworks artworks={artworks} />}
        {activeTab === 'exhibitions' &&
          (exhibitions?.length > 0 ? (
            <GalleryExhibitions exhibitions={exhibitions} />
          ) : (
            <p className={styles.emptyContent}>
              현재 진행중인 전시가 없습니다.
            </p>
          ))}
      </section>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === 'map' && (
              <MapModalContent galleryData={galleryData} />
            )}

            {modalType === 'like' && (
              <div className={styles.likeModal}>
                <FaHeart className={styles.likeIcon} />
                <p className={styles.likeMessage}>
                  관심있는 갤러리로 추가 완료!
                </p>
                <p className={styles.likeSubMessage}>
                  나의 관심 목록은 마이페이지에서 확인할 수 있어요.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showUserActions && (
        <button
          className={styles.backButton}
          onClick={() => navigate('/galleries')}
        >
          목록으로 돌아가기
        </button>
      )}
    </div>
  );
}
