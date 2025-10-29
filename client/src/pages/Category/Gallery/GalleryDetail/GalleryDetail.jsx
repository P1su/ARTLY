import styles from './GalleryDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../../../apis/instance.js';
import { FaHeart, FaShare } from 'react-icons/fa6';
import MapModalContent from './components/MapModalContent/MapModalContent.jsx';
import DetailTabs from '../../../../components/DetailTabs/DetailTabs.jsx';
import GalleryExhibitions from './components/GalleryExhibitions/GalleryExhibitions.jsx';
import useMap from '../../../Nearby/hooks/useMap.jsx';

export default function GalleryDetail({ showUserActions = true, id: propId }) {
  const { galleryId } = useParams();
  const id = propId || galleryId;
  const navigate = useNavigate();

  const [galleryData, setGalleryData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('ongoing');

  useMap({
    lat: galleryData?.gallery_latitude,
    lng: galleryData?.gallery_longitude,
    id: `gallery-${galleryId}-map`,
    title: galleryData?.gallery_name,
    location: galleryData?.gallery_address,
  });

  const fetchGalleryDetail = async () => {
    try {
      const response = await instance.get(`/api/galleries/${id}`);
      setGalleryData(response.data);
      console.log('갤러리', response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserLikes = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) return;
    try {
      const res = await instance.get('/api/users/me/likes');
      const likedGalleries = res.data.like_galleries || [];
      const liked = likedGalleries.some((g) => g.id === Number(id));
      setIsLiked(liked);
    } catch (error) {
      console.error('좋아요 상태 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGalleryDetail();
      fetchUserLikes();
    }
  }, [id]);

  if (!galleryData) return <div>로딩 중...</div>;

  const handleLike = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
      return;
    }
    try {
      if (isLiked) {
        await instance.delete('/api/likes', {
          data: { liked_id: id, liked_type: 'gallery' },
        });
      } else {
        await instance.post('/api/likes', {
          liked_id: id,
          liked_type: 'gallery',
        });
      }
      setIsLiked(!isLiked);
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

  const inputItems = [
    { label: '관람시간', content: `${startTime} - ${endTime}` },
    { label: '휴관일', content: closedDay },
    { label: '전화번호', content: phone || '정보 없음' },
    { label: '주소', content: address },
    {
      label: '이메일',
      content: email ? <a href={`mailto:${email}`}>{email}</a> : '정보 없음',
    },
  ];

  const galleryPageTabs = [
    { key: 'ongoing', label: '현재 전시' },
    { key: 'upcoming', label: '예정 전시' },
  ];

  return (
    <div className={styles.layout}>
      {showUserActions && (
        <div className={styles.breadcrumb}>갤러리 &gt; {name}</div>
      )}

      <section className={styles.titleSection}>
        <h1 className={styles.galleryTitle}>{name}</h1>
        <p className={styles.gallerySubTitle}>{nameEn || 'Gallery Name'}</p>
      </section>

      <div className={styles.card}>
        <img
          className={styles.galleryImage}
          src={image}
          alt='갤러리 대표 이미지'
        />

        <div className={styles.containerLayout}>
          <div className={styles.tagContainer}>
            {category?.split(',').map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag.trim()}
              </span>
            ))}
          </div>
          {showUserActions && (
            <div className={styles.btnLayout}>
              <button className={styles.likeButton} onClick={handleLike}>
                <FaHeart className={isLiked ? styles.likedIcon : styles.icon} />
                좋아요
              </button>
              <button className={styles.likeButton} onClick={handleShare}>
                <FaShare className={styles.icon} />
                공유하기
              </button>
            </div>
          )}
        </div>

        <section className={styles.infoList}>
          {inputItems.map(({ label, content }) => (
            <div className={styles.infoRow} key={label}>
              <span className={styles.infoLabel}>{label}</span>
              <div className={styles.infoContent}>{content}</div>
            </div>
          ))}

          <button
            disabled={!homepage}
            className={styles.homepageButton}
            onClick={() => window.open(homepage, '_blank')}
          >
            {homepage ? '홈페이지' : '홈페이지 정보 없음'}
          </button>
        </section>
      </div>

      {showUserActions && (
        <>
          <div
            className={styles.descriptionParagraph}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />

          <DetailTabs
            tabs={galleryPageTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            <GalleryExhibitions
              exhibitions={exhibitions?.filter((ex) => {
                if (activeTab === 'ongoing')
                  return ex.exhibition_status === 'exhibited';
                if (activeTab === 'upcoming')
                  return ex.exhibition_status === 'scheduled';
                return true; // 혹시 다른 탭이 추가될 경우 대비
              })}
            />
          </DetailTabs>

          <div className={styles.mapSection}>
            <p className={styles.sectionTitle}>찾아오시는 길</p>
            <div id={`gallery-${galleryId}-map`} className={styles.map}></div>
          </div>
          <button
            className={styles.backButton}
            onClick={() => navigate('/galleries')}
          >
            목록으로 돌아가기
          </button>
        </>
      )}
    </div>
  );
}
