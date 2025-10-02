import styles from './ExhibitionDetail.module.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance, userInstance } from '../../../../apis/instance.js';
import { FaQrcode, FaCalendar, FaHeart, FaShare } from 'react-icons/fa';
import ReservationModal from './components/ReservationModal/ReservationModal.jsx';

export default function ExhibitionDetail({
  showUserActions = true,
  id: propId,
}) {
  const { exhibitionId } = useParams(); // 유저 페이지에서 열릴 때
  const id = propId || exhibitionId;

  const navigate = useNavigate();
  const [exhibitionData, setExhibitionData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getExhibitionDetail = async () => {
    try {
      const response = await instance.get(`/api/exhibitions/${id}`);

      setExhibitionData(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (id) {
      getExhibitionDetail();
    }
  }, [id]);

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
    is_liked: isLike,
  } = exhibitionData;

  const handleLike = async () => {
    !localStorage.getItem('ACCESS_TOKEN') && navigate('/login');
    try {
      if (isLike === true) {
        await userInstance.delete('/api/likes', {
          data: {
            liked_id: id,
            liked_type: 'exhibition',
          },
        });
      } else {
        await userInstance.post('/api/likes', {
          liked_id: id,
          liked_type: 'exhibition',
        });
      }

      await getExhibitionDetail();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const infos = [
    {
      key: 'date',
      label: '기간',
      content: `${startDate} ~ ${endDate}`,
    },
    {
      key: 'time',
      label: '시간',
      content: `${startTime} ~ ${endTime}`,
    },
    {
      key: 'place',
      label: '장소',
      content: organization,
    },
    {
      key: 'location',
      label: '주소',
      content: exhibitionLocation,
    },
    {
      key: 'closed',
      label: '휴관일',
      content: closedDay,
    },
    {
      key: 'price',
      label: '관람료',
      content: `${price} (원)`,
    },
  ];

  const buttons = [
    {
      label: '좋아요',
      icon: (
        <FaHeart className={`${styles.icon} ${isLike && styles.icHeart}`} />
      ),
      action: handleLike,
    },
    {
      label: '관람예약',
      icon: <FaCalendar className={styles.icon} />,
      action: openModal,
    },
    {
      label: '공유하기',
      icon: <FaShare className={styles.icon} />,
      action: () => {
        alert('구현 중에 있습니다.');
      },
    },
    {
      label: '도슨트',
      icon: <FaQrcode className={styles.icon} />,
      action: () => navigate(`/scan`),
    },
  ];

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>{title}</h1>

      <img
        className={styles.exhibitionImage}
        src={poster}
        alt='전시회 대표 이미지'
      />

      {showUserActions && (
        <div className={styles.userActionContainer}>
          {buttons.map(({ label, icon, action }) => (
            <button
              className={styles.userActionButton}
              key={label}
              onClick={action}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}

      {showUserActions && isModalOpen && (
        <ReservationModal // 모달 컴포넌트 렌더링
          exhibitionId={id}
          onClose={closeModal}
        />
      )}

      <hr className={styles.divider} />

      <section className={styles.infoSection}>
        {infos.map(({ key, label, content }) => (
          <div className={styles.infoContainer} key={key}>
            <span className={styles.infoSpan}>{label}</span>
            <p className={styles.infoParagraph}>{content}</p>
          </div>
        ))}
      </section>

      <h2 className={styles.subTitle}> 전시 정보 </h2>
      <p className={styles.subParagraph}>{description}</p>
      <span className={styles.subSpan}>
        ※ 아뜰리에 등록된 이미지와 글의 저작권은 각 작가와 필자에게 있습니다.
      </span>

      {showUserActions && (
        <section>
          <h2 className={styles.subTitle}> 관련 전시 </h2>

          <div className={styles.relatedExhibitionGrid}>
            {relatedExhibitions?.length > 0 ? (
              relatedExhibitions.map((exhibition) => (
                <Link
                  to={`/exhibitions/${exhibition.id}`}
                  key={exhibition.id}
                  className={styles.relatedExhibitionCard}
                >
                  <img
                    src={exhibition.poster}
                    alt={exhibition.title}
                    className={styles.relatedExhibitionImage}
                  />
                  <div className={styles.relatedExhibitionInfo}>
                    <h4 className={styles.relatedExhibitionTitle}>
                      {exhibition.title}
                    </h4>
                    <p className={styles.relatedExhibitionPar}>
                      {exhibition.organization}
                    </p>
                    <p className={styles.relatedExhibitionSubPar}>
                      {exhibition.start_date} - {exhibition.end_date}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>관련 전시가 없습니다.</p>
            )}
          </div>

          <Link className={styles.backButton} to='/exhibitions'>
            목록으로 돌아가기
          </Link>
        </section>
      )}
    </div>
  );
}
