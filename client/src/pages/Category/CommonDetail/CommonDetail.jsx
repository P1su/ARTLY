import styles from './CommonDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../../apis/instance.js';
import {
  FaHeart,
  FaShare,
  FaCalendar,
  FaQrcode,
  FaCheck,
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import GalleryExhibitions from '../Gallery/GalleryDetail/components/GalleryExhibitions/GalleryExhibitions.jsx';

// 지도 모달 컨텐츠 (분리된 컴포넌트)
function MapModalContent({ data, type }) {
  const isGallery = type === 'galleries';
  const mappedData = {
    id: data.id,
    name: isGallery ? data.gallery_name : data.exhibition_name,
    nameEn: isGallery ? data.gallery_name_en : '',
    address: isGallery ? data.gallery_address : data.exhibition_location,
    lat: isGallery ? data.gallery_latitude : data.exhibition_latitude,
    lng: isGallery ? data.gallery_longitude : data.exhibition_longitude,
  };

  useMap({
    lat: mappedData.lat,
    lng: mappedData.lng,
    id: `modal-map-${mappedData.id}`,
    title: mappedData.name,
    location: mappedData.address,
  });

  return (
    <>
      <h3>{mappedData.name}</h3>
      <p>{mappedData.nameEn}</p>
      <div id={`modal-map-${mappedData.id}`} className={styles.galleryMap} />
    </>
  );
}

const GallerySpecifics = ({ data }) => (
  <>
    <div className={styles.tagContainer}>
      {data.gallery_category?.split(',').map((tag) => (
        <span key={tag} className={styles.tag}>
          {tag.trim()}
        </span>
      ))}
    </div>
    <section className={styles.infoList}>
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>관람시간</span>
        <div
          className={styles.infoContent}
        >{`${data.gallery_start_time?.slice(0, 5)} - ${data.gallery_end_time?.slice(0, 5)}`}</div>
      </div>
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>휴관일</span>
        <div className={styles.infoContent}>{data.gallery_closed_day}</div>
      </div>
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>전화번호</span>
        <div className={styles.infoContent}>
          {data.gallery_phone || '정보 없음'}
        </div>
      </div>
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>주소</span>
        <div className={styles.infoContent}>{data.gallery_address}</div>
      </div>
    </section>
  </>
);

const ExhibitionSpecifics = ({ data }) => (
  <section className={styles.infoList}>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>전시기간</span>
      <div
        className={styles.infoContent}
      >{`${data.exhibition_start_date} - ${data.exhibition_end_date}`}</div>
    </div>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>전시장소</span>
      <div className={styles.infoContent}>{data.exhibition_organization}</div>
    </div>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>관람시간</span>
      <div
        className={styles.infoContent}
      >{`${data.exhibition_start_time?.slice(0, 5)} - ${data.exhibition_end_time?.slice(0, 5)}`}</div>
    </div>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>입장료</span>
      <div
        className={styles.infoContent}
      >{`${data.exhibition_price?.toLocaleString()}원`}</div>
    </div>
  </section>
);

const ArtworkSpecifics = ({ data }) => (
  <section className={styles.infoList}>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>제작연도</span>
      <div className={styles.infoContent}>{data.artwork_year}</div>
    </div>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>재료</span>
      <div className={styles.infoContent}>{data.artwork_materials}</div>
    </div>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>크기</span>
      <div className={styles.infoContent}>{data.artwork_size}</div>
    </div>
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>가격</span>
      <div className={styles.infoContent}>
        {Number(data.artwork_price).toLocaleString()}원
      </div>
    </div>
  </section>
);

// --- 메인 컴포넌트 ---
export default function CommonDetail({
  type,
  showUserActions = true,
  id: propId,
}) {
  const params = useParams();
  const id = propId || params.id;
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const isGallery = type === 'galleries';
  const isExhibition = type === 'exhibitions';
  const isArtwork = type === 'artworks';

  const fetchData = async () => {
    const url = `/api/${type}/${id}`;
    try {
      const response = await instance.get(url);
      setData(response.data);
    } catch (error) {
      console.error(`${type} 데이터 로딩 실패:`, error);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id, type]);

  // --- 핸들러 함수들 ---
  const handleLike = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
      return;
    }
    const likedType = type.slice(0, -1); // 'galleries' -> 'gallery'
    try {
      if (data.is_liked) {
        await instance.delete('/api/likes', {
          data: { liked_id: id, liked_type: likedType },
        });
      } else {
        await instance.post('/api/likes', {
          liked_id: id,
          liked_type: likedType,
        });
        setModalType('like');
        setShowModal(true);
      }
      await fetchData(); // 데이터 새로고침
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };
  const handleShowMap = () => {
    setModalType('map');
    setShowModal(true);
  };

  if (!data) return <div>로딩 중...</div>;

  // --- 타입별 데이터 매핑 ---
  const mappedData = {
    title: isGallery
      ? data.gallery_name
      : isExhibition
        ? data.exhibition_title
        : data.artwork_name,
    subTitle: isGallery
      ? data.gallery_name_en
      : isArtwork
        ? data.artist_name
        : null,
    image: isGallery
      ? data.gallery_image
      : isExhibition
        ? data.exhibition_poster
        : data.artwork_image,
    description: isGallery
      ? data.gallery_description
      : isExhibition
        ? data.exhibition_description
        : data.artwork_description,
    isLiked: data.is_liked,
  };

  const actionButtons = isGallery
    ? [
        { label: '관심있어요', icon: <FaHeart />, action: handleLike },
        { label: '위치보기', icon: <FaLocationDot />, action: handleShowMap },
        {
          label: '공유하기',
          icon: <FaShare />,
          action: () => alert('공유하기'),
        },
      ]
    : isExhibition
      ? [
          { label: '관심있어요', icon: <FaHeart />, action: handleLike },
          {
            label: '도슨트',
            icon: <FaQrcode />,
            action: () => navigate('/scan'),
          },
          {
            label: '관람예약',
            icon: <FaCalendar />,
            action: () => alert('관람예약'),
          },
          {
            label: '공유하기',
            icon: <FaShare />,
            action: () => alert('공유하기'),
          },
        ]
      : [
          { label: '좋아요', icon: <FaHeart />, action: handleLike },
          {
            label: '구매문의',
            icon: <FaCheck />,
            action: () => alert('구매문의'),
          },
          {
            label: '공유하기',
            icon: <FaShare />,
            action: () => alert('공유하기'),
          },
        ];

  const hasTabs = isGallery || isExhibition;

  return (
    <div className={styles.layout}>
      <section className={styles.titleSection}>
        <h1 className={styles.galleryTitle}>{mappedData.title}</h1>
        {mappedData.subTitle && (
          <p className={styles.gallerySubTitle}>{mappedData.subTitle}</p>
        )}
      </section>

      <div className={`${styles.card} ${styles.profileCard}`}>
        <img
          className={`${styles.mainImage} ${isGallery ? styles.galleryImage : isExhibition ? styles.exhibitionImage : styles.artworkImage}`}
          src={mappedData.image}
          alt='대표 이미지'
        />
        {showUserActions && (
          <div className={styles.actionButtonContainer}>
            {actionButtons.map(({ label, icon }) => (
              <button className={styles.actionButton} key={label}>
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}

        {/* 타입별로 다른 정보 UI 렌더링 */}
        {isGallery && <GallerySpecifics data={data} />}
        {isExhibition && <ExhibitionSpecifics data={data} />}
        {isArtwork && <ArtworkSpecifics data={data} />}
      </div>

      {/* 갤러리/전시회일 때만 탭 렌더링 */}
      {hasTabs && (
        <nav className={styles.tabNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'info' && styles.activeTab}`}
            onClick={() => setActiveTab('info')}
          >
            정보
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'artworks' && styles.activeTab}`}
            onClick={() => setActiveTab('artworks')}
          >
            작품({data.artworks?.length || 0})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'exhibitions' && styles.activeTab}`}
            onClick={() => setActiveTab('exhibitions')}
          >
            {isGallery
              ? `전시(${data.exhibitions?.length || 0})`
              : `관련 전시(${data.related_exhibitions?.length || 0})`}
          </button>
        </nav>
      )}

      {/* 탭 또는 작품 설명 콘텐츠 */}
      <section className={styles.tabContent}>
        {hasTabs && activeTab === 'info' && (
          <div
            className={styles.descriptionParagraph}
            dangerouslySetInnerHTML={{ __html: mappedData.description }}
          />
        )}
        {isArtwork && (
          <div
            className={styles.descriptionParagraph}
            dangerouslySetInnerHTML={{ __html: mappedData.description }}
          />
        )}

        {hasTabs && activeTab === 'artworks' && (
          <GalleryExhibitions artworks={data.artworks} />
        )}
        {hasTabs &&
          activeTab === 'exhibitions' &&
          (data.exhibitions || data.related_exhibitions?.length > 0 ? (
            <GalleryExhibitions
              exhibitions={
                isGallery ? data.exhibitions : data.related_exhibitions
              }
            />
          ) : (
            <p className={styles.emptyContent}>
              현재 진행중인 전시가 없습니다.
            </p>
          ))}
      </section>

      {/* 모달 */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === 'map' && (isGallery || isExhibition) && (
              <MapModalContent data={data} type={type} />
            )}
            {modalType === 'like' && (
              <div className={styles.likeModal}>
                <FaHeart className={styles.likeIcon} />
                <p className={styles.likeMessage}>
                  관심 목록에 추가되었습니다!
                </p>
                <p className={styles.likeSubMessage}>
                  마이페이지에서 확인할 수 있어요.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showUserActions && (
        <button
          className={styles.backButton}
          onClick={() => navigate(`/${type}`)}
        >
          목록으로 돌아가기
        </button>
      )}
    </div>
  );
}
