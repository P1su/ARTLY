import styles from './ReservationConfirm.module.css';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userInstance } from '../../apis/instance.js';
import { FaCheck } from 'react-icons/fa';
import Img from '../../components/Img/Img.jsx';

export default function ReservationConfirm() {
  const { reservationId } = useParams();
  const [reservationData, setReservationData] = useState(null);
  
  const {
    exhibition_location: location,
    exhibition_title: title,
    exhibition_poster: poster,
    exhibition_id: exhibitionId,
    reservation_total_price: totalPrice,
    reservation_number_of_tickets: ticketNum,
    reservation_datetime: reservationDate,
  } = reservationData || {};

  const fullPosterUrl = poster 
  ? `https://artly.soundgram.co.kr/${poster}` 
  : null;

  const parseDate = (date) => {
    if (date) {
      return date.split(' ')[0];
    }
  };

  const completionSummaryItems = [
    {
      label: '전시명',
      value: title || '',
    },
    {
      label: '장소',
      value: location || '',
    },
    { label: '예약일', value: parseDate(reservationDate) },
    { label: '인원', value: ticketNum ? `${ticketNum}명` : '' },
    { label: '가격', value: totalPrice ? `${totalPrice}원` : '' },
  ];

  useEffect(() => {
    const getReservation = async () => {
      try {
        const response = await userInstance.get('/api/users/me/exhibitions');
        console.log('전시회 목록:', response.data);
        
        const found = response.data.find(
          (item) => String(item.id) === String(reservationId)
        );
        
        console.log('찾은 데이터:', found);
        setReservationData(found);
      } catch (error) {
        console.error('전시회 목록 가져오기 실패:', error);
      }
    };

    getReservation();
  }, [reservationId]);

  if (!reservationData) {
    return (
      <div className={styles.layout}>
        <h1 className={styles.title}>로딩 중...</h1>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>상세 예매 내역</h1>
      {fullPosterUrl && (
        <Img
          className={styles.posterImage}
          src={fullPosterUrl}
          alt='예약 전시회 이미지'
        />
      )}
      <div className={styles.completionIcon}>
        <FaCheck />
      </div>
      <div className={styles.completionTitle}>관람 예약 신청 완료</div>
      <div className={styles.reservationSummary}>
        {completionSummaryItems.map((item) => (
          <div className={styles.summaryRow} key={item.label}>
            <span className={styles.summaryLabel}>{item.label}</span>
            <span className={styles.summaryValue}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.buttonField}>
        <Link className={styles.mypageLink} to='/mypage'>
          마이페이지로
        </Link>
        <Link
          className={styles.exhibitionLink}
          to={`/exhibitions/${exhibitionId}`}
        >
          전시회 보러가기
        </Link>
      </div>
    </div>
  );
}
