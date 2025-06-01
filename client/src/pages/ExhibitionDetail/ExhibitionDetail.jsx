import styles from './ExhibitionDetail.module.css';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useEffect, useState } from 'react';
import { instance, userInstance } from '../../apis/instance.js';
import { FaQrcode, FaCalendar, FaHeart, FaShare } from 'react-icons/fa';
import BtnFavorite from './components/BtnFavorite/BtnFavorite';
import BtnShare from './components/BtnShare/BtnShare';
import StickyMenu from './components/StikcyMenu/StickyMenu';

export default function ExhibitionDetail() {
  const { exhibitionId } = useParams();
  const navigate = useNavigate(); // 컴포넌트 내부에 추가
  const [ExhibitionData, setExhibitionData] = useState([]);
  const [isLike, setIsLike] = useState('false');

  const getExhibitionDetail = async () => {
    try {
      const response = await instance.get(`/api/exhibitions/${exhibitionId}`);

      setExhibitionData(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getExhibitionDetail();
  }, []);

  const handleLike = () => {
    const postExhibitionLike = async () => {
      try {
        await userInstance.post('/api/likes', {
          liked_id: exhibitionId,
          liked_type: 'exhibition',
        });
      } catch (error) {
        console.error(error);
        alert('좋아요 실패');
      }
    };

    const deleteExhibitionLike = async () => {
      try {
        await userInstance.delete('/api/likes', {
          liked_id: exhibitionId,
          liked_type: 'exhibition',
        });
      } catch (error) {
        console.error(error);
        alert('좋아요 실패');
      }
    };

    if (isLike) {
      deleteExhibitionLike();
      setIsLike(false);
    } else {
      postExhibitionLike();
      setIsLike(true);
    }
  };

  const {
    id,
    exhibition_title: title,
    exhibition_poster: poster,
    exhibition_category: category,
    exhibition_tag: tag,
    exhibition_start_date: startDate,
    exhibition_end_date: endDate,
    exhibition_start_time: startTime,
    exhibition_end_time: endTime,
    exhibition_location: exhibitionLocation,
    exhibition_price: price,
    exhibition_organization: organization,
    exhibition_closed_day: closed_day,
    exhibition_description: description,
    related_exhibitions: relatedExhibitions,
  } = ExhibitionData;

  const buttons = [
    {
      label: '관심 작가',
      icon: (
        <FaHeart className={`${styles.icon} ${isLike && styles.icHeart}`} />
      ),
      action: handleLike,
    },
    {
      label: '관람예약',
      icon: <FaCalendar className={styles.icon} />,
      action: () => navigate(`/reservation/${exhibitionId}`),
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
      <StickyMenu id={exhibitionId} />

      <section className={styles.titleSection}>
        <img
          className={styles.exhibitionImage}
          src={poster}
          alt='전시회 대표 이미지'
        />          
        <span className={styles.titleSpan}>{title}</span>
      </section>

      <div className={styles.buttonContainer}>
        {buttons.map(({ label, icon, action }) => (
          <button className={styles.subButton} key={label} onClick={action}>
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <hr className={styles.divider} />

      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <span>전시기간</span>
          <span>
            {startDate} - {endDate}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>전시장소</span>
          <span>
            {organization}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>관람시간</span>
          <span>
            {startTime} - {endTime}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>휴관일</span>
          <span>
            {closed_day}
          </span>
        </div>
        <div className={styles.infoContainer}>
          <span>입장료</span>
          <span>{price}원</span>
        </div>
        <div className={styles.infoContainer}>
          <span>주소</span>
          <span>{exhibitionLocation}</span>
        </div>
      </section>

      <h2> 전시 정보 </h2>

      <hr className={styles.divider} />

      <div className={styles.infoContainer}>
        <span>
          {description}
        </span>
      </div>

      <h2> 전시 작품 </h2>

      <hr className={styles.divider} />

      <div className={styles.relatedExhibitionGrid}>
        {Array.isArray(relatedExhibitions) && relatedExhibitions.length > 0 ? (
          relatedExhibitions.map((exhibition) => (
            <Link
              to={`/exhibition/${exhibition.id}`}
              key={exhibition.id}
              className={styles.relatedExhibitionCard}
            >
              <img
                src={exhibition.poster}
                alt={exhibition.title}
                className={styles.relatedExhibitionImage}
              />
              <div className={styles.relatedExhibitionInfo}>
                <h4>{exhibition.title}</h4>
                <p className={styles.location}>
                  {exhibition.organization}
                </p>
                <p className={styles.location}>
                  {exhibition.start_date} - {exhibition.end_date}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>관련 전시가 없습니다.</p>
        )}
      </div>


    </div>
  );
}
