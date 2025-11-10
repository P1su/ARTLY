// GalleryDetail.jsx
import styles from './GalleryDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaHeart,
  FaShare,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaLink,
} from 'react-icons/fa6';
import DetailTabs from '../../../../components/DetailTabs/DetailTabs.jsx';
import useMap from '../../../Nearby/hooks/useMap.jsx';
import { userInstance } from '../../../../apis/instance.js';
import ExhibitionsCards from './components/ExhibitionsCards/ExhibitionsCards.jsx';

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
      const res = await userInstance.get(`/api/galleries/${id}`);
      const { data } = res;
      setGalleryData(data);
      if (typeof data.is_liked === 'boolean') setIsLiked(data.is_liked);
      // console.log('갤러리 상세:', data);
    } catch (error) {
      console.error('갤러리 상세 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (!id) return;
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
      } else {
        await userInstance.post('/api/likes', payload);
      }
      setIsLiked((prev) => !prev);
      await fetchGalleryDetail();
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
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
    gallery_address: address = '',
    gallery_category: category = '',
    gallery_closed_day: closedDay = '',
    gallery_description: description = '',
    gallery_end_time: endTime = '',
    gallery_start_time: startTime = '',
    gallery_image: image = '',
    gallery_name: name = '',
    gallery_name_en: nameEn = '',
    gallery_phone: phone = '',
    gallery_email: email = '',
    gallery_homepage: homepage = '',
    gallery_sns: snsArray = [],
  } = galleryData;

  const infoList = [
    {
      label: '관람시간',
      content: startTime && endTime ? `${startTime} - ${endTime}` : '정보 없음',
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

  const galleryTabs = [
    { key: 'ongoing', label: '현재 전시' },
    { key: 'upcoming', label: '예정 전시' },
  ];

  const filteredExhibitions = exhibitions.filter((ex) => {
    if (activeTab === 'ongoing') return ex.exhibition_status === 'exhibited';
    if (activeTab === 'upcoming') return ex.exhibition_status === 'scheduled';
    return true;
  });

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
            {category &&
              category.split(',').map((tag) => (
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
          {infoList.map(({ label, content }) => {
            const isEmpty =
              !content ||
              (typeof content === 'string' && content.trim() === '정보 없음');

            return (
              <div className={styles.infoRow} key={label}>
                <span className={styles.infoLabel}>{label}</span>
                <div
                  className={`${styles.infoContent} ${isEmpty ? styles.emptyInfo : ''}`}
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

      {showUserActions && (
        <>
          <div
            className={styles.descriptionParagraph}
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <DetailTabs
            tabs={galleryTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            <ExhibitionsCards exhibitions={filteredExhibitions} />
          </DetailTabs>

          <div className={styles.mapSection}>
            <p className={styles.sectionTitle}>찾아오시는 길</p>
            <div id={`gallery-${galleryId}-map`} className={styles.map} />
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
