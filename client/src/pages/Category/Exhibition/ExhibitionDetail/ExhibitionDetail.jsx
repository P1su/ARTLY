import styles from './ExhibitionDetail.module.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance, userInstance } from '../../../../apis/instance.js';
import { FaQrcode, FaCalendar, FaHeart, FaShare } from 'react-icons/fa';
import ReservationModal from './components/ReservationModal/ReservationModal.jsx';
import GalleryArtworks from '../../../../pages_console/ConsoleDetail/components/GalleryArtworks/GalleryArtworks.jsx';
import GalleryExhibitions from '../../Gallery/GalleryDetail/components/GalleryExhibitions/GalleryExhibitions.jsx';

// 임시 컴포넌트
const ExhibitionArtworks = ({ artworks }) => (
  <div className={styles.emptyContent}></div>
);
const RelatedExhibitions = ({ exhibitions }) => (
  <div className={styles.emptyContent}>관련 전시 정보가 없습니다.</div>
);

export default function ExhibitionDetail({
  showUserActions = true,
  id: propId,
}) {
  const { exhibitionId } = useParams();
  const id = propId || exhibitionId;

  const navigate = useNavigate();
  const [exhibitionData, setExhibitionData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const getExhibitionDetail = async () => {
      try {
        const response = await instance.get(`/api/exhibitions/${id}`);
        setExhibitionData(response.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };
    if (id) getExhibitionDetail();
  }, [id]);

  const handleLike = async () => {
    /* ... 이전과 동일 ... */
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!exhibitionData) {
    return <div>로딩 중...</div>;
  }

  const {
    exhibition_title: title,
    exhibition_poster: poster,
    exhibition_start_date: startDate,
    exhibition_end_date: endDate,
    exhibition_start_time: startTime,
    exhibition_end_time: endTime,
    exhibition_location: exhibitionLocation,
    exhibition_price: price,
    exhibition_organization: organization,
    exhibition_closed_day: closedDay,
    exhibition_description: description,
    related_exhibitions: relatedExhibitions,
    artworks, // API에 artworks가 있다고 가정
    exhibition_phone: phone, // 전화번호 추가 가정
    exhibition_artist: artist, // 작가 추가 가정
    exhibition_homepage: homepage, // 홈페이지 추가 가정
    is_liked: isLike,
  } = exhibitionData;

  const infos = [
    { label: '전시기간', content: `${startDate} ~ ${endDate}` },
    { label: '전시장소', content: organization },
    {
      label: '관람시간',
      content: `${startTime?.slice(0, 5)} ~ ${endTime?.slice(0, 5)}`,
    },
    { label: '휴관일', content: closedDay },
    { label: '입장료', content: `${price} (원)` },
    { label: '전화번호', content: phone || '정보 없음' },
    { label: '주소', content: exhibitionLocation },
    { label: '작가', content: artist || '정보 없음' },
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
      label: '관람예약',
      icon: <FaCalendar className={styles.actionIcon} />,
      action: openModal,
    },
    {
      label: '공유하기',
      icon: <FaShare className={styles.actionIcon} />,
      action: () => alert('구현 예정'),
    },
    {
      label: '도슨트',
      icon: <FaQrcode className={styles.actionIcon} />,
      action: () => navigate(`/scan`),
    },
  ];

  return (
    <div className={styles.layout}>
      {/* 카드 1: 전시 포스터 및 기본 정보 */}
      <div className={`${styles.card} ${styles.profileCard}`}>
        <img
          className={styles.exhibitionImage}
          src={poster}
          alt='전시회 포스터'
        />
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
        </div>
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

      {/* 카드 2: 상세 정보 목록 */}
      <div className={`${styles.card} ${styles.infoCard}`}>
        <section className={styles.infoList}>
          {infos.map(({ label, content }) => (
            <div className={styles.infoRow} key={label}>
              <span className={styles.infoLabel}>{label}</span>
              <div className={styles.infoContent}>{content}</div>
            </div>
          ))}
        </section>
      </div>

      {/* 카드 3: 탭 및 콘텐츠 */}
      <div className={`${styles.card} ${styles.tabCard}`}>
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
            작품({artworks?.length || 0})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'exhibitions' && styles.activeTab}`}
            onClick={() => setActiveTab('exhibitions')}
          >
            전시({relatedExhibitions?.length || 0})
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
          {activeTab === 'exhibitions' && (
            <RelatedExhibitions exhibitions={relatedExhibitions || []} />
          )}
        </section>
      </div>

      {showUserActions && isModalOpen && (
        <ReservationModal exhibitionId={id} onClose={closeModal} />
      )}

      {showUserActions && (
        <Link className={styles.backButton} to='/exhibitions'>
          목록으로 돌아가기
        </Link>
      )}
    </div>
  );
}
