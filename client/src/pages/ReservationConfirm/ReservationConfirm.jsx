import styles from './ReservationConfirm.module.css';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userInstance } from '../../apis/instance.js';
import { FaCheck } from 'react-icons/fa';

export default function ReservationConfirm() {
  const { reservationId } = useParams();
  const [reservationData, setReservationData] = useState([]);
  const {
    exhibition_location: location,
    exhibition_title: title,
    exhibition_poster: poster,
    exhibition_id: exhibitionId,
    reservation_total_price: totalPrice,
    reservation_number_of_tickets: ticketNum,
    reservation_datetime: reservationDate,
  } = reservationData;

  const parseDate = (date) => {
    if (date) {
      return date.split(' ')[0];
    }
  };

  const completionSummaryItems = [
    {
      label: '전시명',
      value: reservationData ? title : '',
    },
    {
      label: '장소',
      value: reservationData ? location : '',
    },
    { label: '예약일', value: parseDate(reservationDate) },
    { label: '인원', value: `${ticketNum}명` },
    { label: '가격', value: `${totalPrice}원` },
    /*
    { label: '예약자', value: reservationInfo.name },
    { label: '전화번호', value: reservationInfo.phone },
    { label: '이메일', value: reservationInfo.email },
  */
  ];

  useEffect(() => {
    const getReservation = async () => {
      try {
        const response = await userInstance.get('/api/users/me/exhibitions');

        setReservationData(
          response.data.find((item) => item.id === reservationId),
        );
      } catch (error) {
        console.error(error);
      }
    };

    getReservation();
  }, []);

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>상세 예매 내역</h1>
      <img
        className={styles.posterImage}
        src={poster}
        alt='예약 전시회 이미지'
      />
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
