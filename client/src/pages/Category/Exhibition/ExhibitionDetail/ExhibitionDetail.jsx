import styles from './ExhibitionDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaStar,
  FaShare,
  FaHeadphones,
  FaCalendarCheck,
} from 'react-icons/fa6';
import DetailTabs from '../../../../components/DetailTabs/DetailTabs.jsx';
import { userInstance } from '../../../../apis/instance.js';
import RelatedExhibitions from './components/RelatedExhibitions/RelatedExhibitions.jsx';
import InvitationGenerator from './components/InvitationGenerator/InvitationGenerator.jsx';
import ArtworksCards from '../../../../pages_console/ConsoleDetail/components/ArtworksCards/ArtworksCards.jsx';
import LikePopup from '../../Gallery/GalleryDetail/components/LikePopup.jsx';
import { useUser } from '../../../../store/UserProvider.jsx';
import Img from '../../../../components/Img/Img.jsx';

export default function ExhibitionDetail({
  showUserActions = true,
  id: propId,
  actionButtons,
}) {
  const { exhibitionId } = useParams();
  const id = propId || exhibitionId;
  const { user } = useUser();
  const navigate = useNavigate();

  const [exhibitionData, setExhibitionData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikePopup, setShowLikePopup] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const fetchExhibitionDetail = async () => {
    if (!id) return;

    try {
      const res = await userInstance.get(`/api/exhibitions/${id}`);
      const { data } = res;
      setExhibitionData(data);

      if (typeof data.is_liked === 'boolean') {
        setIsLiked(data.is_liked);
      }
    } catch (error) {
      console.error('전시 상세 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchExhibitionDetail();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const payload = { liked_id: id, liked_type: 'exhibition' };

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
    }
  };

  const handleShare = () => {
    const name = exhibitionData?.exhibition_title;
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: `ARTLY: ${name}`,
          text: `${name} 전시 정보를 확인해보세요!`,
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

  const handleDocent = () => {
    navigate('/scan');
  };

  console.log('전시회', exhibitionData);

  if (!exhibitionData) return <div>로딩 중...</div>;

  const {
    exhibition_title: title,
    exhibition_poster: poster,
    exhibition_start_date: startDate,
    exhibition_end_date: endDate,
    exhibition_start_time: startTime,
    exhibition_end_time: endTime,
    exhibition_organization: organization,
    exhibition_location: exhibitionLocation,
    exhibition_price: price,
    exhibition_closed_day: closedDay,
    exhibition_description: description,
    related_exhibitions: relatedExhibitions = [],
    artworks = [],
    exhibition_phone: phone,
    artists = [],
    exhibition_homepage: homepage,
    exhibition_status: status,
  } = exhibitionData;

  const isReservable = status === 'exhibited';

  const infoList = [
    {
      label: '전시기간',
      content: startDate && endDate ? `${startDate} ~ ${endDate}` : '정보 없음',
    },
    { label: '전시장소', content: organization },
    {
      label: '관람시간',
      content:
        startTime && endTime
          ? `${startTime.slice(0, 5)} ~ ${endTime.slice(0, 5)}`
          : '정보 없음',
    },
    { label: '휴관일', content: closedDay || '정보 없음' },
    {
      label: '입장료',
      content: price ? `${price.toLocaleString()}원` : '무료',
    },
    { label: '전화번호', content: phone || '정보 없음' },
    { label: '주소', content: exhibitionLocation || '정보 없음' },
    {
      label: '참여작가',
      content: artists.map((a) => a.artist_name).join(', ') || '정보 없음',
    },
  ];

  const detailTabs = [
    { key: 'info', label: '정보' },
    { key: 'artworks', label: `작품(${artworks.length})` },
    { key: 'exhibitions', label: `전시(${relatedExhibitions.length})` },
  ];

  return (
    <div className={styles.layout}>
      {showUserActions && (
        <div className={styles.breadcrumb}>
          <span
            className={styles.breadcrumbBack}
            onClick={() => navigate('/exhibitions')}
          >
            전시회
          </span>{' '}
          &gt; {title}
        </div>
      )}

      <div className={styles.card}>
        <Img className={styles.posterImage} src={poster} alt='전시회 포스터' />

        <section className={styles.titleSection}>
          <h1 className={styles.exhibitionTitle}>{title}</h1>
        </section>

        {showUserActions && (
          <div className={styles.btnLayout}>
            <button className={styles.likeButton} onClick={handleLike}>
              <FaStar className={isLiked ? styles.likedIcon : styles.icon} />
              관심있어요
            </button>
            <button
              className={`${styles.likeButton} ${
                !isReservable ? styles.disabledButton : ''
              }`}
              disabled={!isReservable}
              onClick={() => navigate(`/reservation/${id}`)}
              title={!isReservable ? '현재 전시 기간이 아닙니다' : ''}
            >
              <FaCalendarCheck className={styles.icon} />
              예약하기
            </button>
            <button className={styles.likeButton} onClick={handleDocent}>
              <FaHeadphones className={styles.icon} />
              도슨트
            </button>
            <button className={styles.likeButton} onClick={handleShare}>
              <FaShare className={styles.icon} />
              공유하기
            </button>
          </div>
        )}

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
            {homepage ? '전시회 홈페이지 방문' : '홈페이지 정보 없음'}
          </button>
        </section>
      </div>

      {/* 탭 영역 */}
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
            <p className={styles.emptyContent}>
              현재 등록된 전시 소개가 없습니다.
            </p>
          ))}

        {activeTab === 'artworks' && (
          <>
            {artworks.length > 0 ? (
              <ArtworksCards artworks={artworks} />
            ) : (
              <p className={styles.emptyContent}>등록된 작품이 없습니다.</p>
            )}
            {actionButtons?.artworks}
          </>
        )}

        {activeTab === 'exhibitions' && (
          <>
            {relatedExhibitions.length > 0 ? (
              <RelatedExhibitions exhibitions={relatedExhibitions} />
            ) : (
              <p className={styles.emptyContent}>관련 전시가 없습니다.</p>
            )}
            {actionButtons?.exhibitions}
          </>
        )}
      </DetailTabs>

      {/* 초대장 문구 생성 섹션 - HEAD 기능 보존 */}
      <div className={`${styles.card} ${styles.tabCard}`}>
        <InvitationGenerator initialTheme={title} initialOthers='' showTitle />
      </div>

      {showUserActions && (
        <button
          className={styles.backButton}
          onClick={() => navigate('/exhibitions')}
        >
          목록으로 돌아가기
        </button>
      )}

      {showLikePopup && <LikePopup onClose={() => setShowLikePopup(false)} />}
    </div>
  );
}
