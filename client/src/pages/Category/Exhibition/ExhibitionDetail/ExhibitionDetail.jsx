import styles from './ExhibitionDetail.module.css';
import { useParams, Link, useNavigate, data } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaQrcode, FaCalendar, FaHeart, FaShare } from 'react-icons/fa';
import ReservationModal from './components/ReservationModal/ReservationModal.jsx';
import GalleryArtworks from '../../../../pages_console/ConsoleDetail/components/GalleryArtworks/GalleryArtworks.jsx';
import GalleryExhibitions from '../../Gallery/GalleryDetail/components/GalleryExhibitions/GalleryExhibitions.jsx';
import { userInstance } from '../../../../apis/instance.js';
import RelatedExhibitions from './components/RelatedExhibitions/RelatedExhibitions.jsx';
import ReservationConfirm from '../../../ReservationConfirm/ReservationConfirm.jsx';
// import ReservationModal from './components/ReservationModal/ReservationModal.jsx';

// 임시 컴포넌트
const ExhibitionArtworks = ({ artworks }) => (
  <div className={styles.emptyContent}></div>
);

export default function ExhibitionDetail({
  showUserActions = true,
  id: propId,
}) {
  const { exhibitionId } = useParams();
  const id = propId || exhibitionId;

  const navigate = useNavigate();
  const [exhibitionData, setExhibitionData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const getExhibitionDetail = async () => {
    try {
      const response = await userInstance.get(`/api/exhibitions/${id}`);
      setExhibitionData(response.data);
      console.log('전시회', response.data);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  const getUserLikes = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) return;
    try {
      const res = await userInstance.get('/api/users/me/likes');
      const likeExhibitions = res.data.like_exhibitions || [];
      const liked = likeExhibitions.some((g) => g.id === Number(id));
      setIsLiked(liked);
    } catch (error) {
      console.error('좋아요 상태 조회 실패:', error);
    }
  };
  useEffect(() => {
    if (id) {
      getExhibitionDetail();
      getUserLikes();
    }
  }, [id]);

  const handleLike = async () => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
      return;
    }
    try {
      if (isLiked) {
        await userInstance.delete('/api/likes', {
          data: { liked_id: id, liked_type: 'exhibition' },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: id,
          liked_type: 'exhibition',
        });
      }
      setIsLiked(!isLiked);
      await getExhibitionDetail();
    } catch (error) {
      console.error(error);
    }
  };

  const openReservation = () => {
    navigate(`/reservation/${exhibitionId}`);
  };

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
      content: `${startTime} ~ ${endTime}`,
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
      action: openReservation,
    },
    {
      label: '공유하기',
      icon: <FaShare className={styles.actionIcon} />,
      action: handleShare,
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
      {showUserActions && (
        <>
          <div className={`${styles.card} ${styles.tabCard}`}>
            <h3 className={styles.sectionTitle}>전시 정보</h3>

            {description ? (
              <div
                className={styles.descriptionParagraph}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className={styles.emptyContent}>
                현재 등록된 전시 정보가 없습니다.
              </p>
            )}

            <h3 className={styles.sectionTitle}>관련 전시</h3>
            <RelatedExhibitions exhibitions={relatedExhibitions || []} />
          </div>
          <Link className={styles.backButton} to='/exhibitions'>
            목록으로 돌아가기
          </Link>
        </>
      )}
    </div>
  );
}
