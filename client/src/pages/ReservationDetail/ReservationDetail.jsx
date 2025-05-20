import styles from './ReservationDetail.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ReservationDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    imageUrl,
    title,
    location,
    date,
    status,
    people,
    name = '아뜰리',
    email = 'test@email.com',
    phone = '010-1234-5678',
    payment,
    total,
  } = state || {};
  const handleBack = () => navigate(`/mypage`);

  return (
    <div className={styles.layout}>
      <h2 className={styles.title}>예매 상세 내역</h2>

      <div className={styles.card}>
        <img src={imageUrl} alt={title} className={styles.poster} />
        <div className={styles.info}>
          <h3>{title}</h3>
          <p>
            <strong>장소:</strong> {location}
          </p>
          <p>
            <strong>일시:</strong> {date}
          </p>
          <p>
            <strong>상태:</strong> {status}
          </p>
        </div>
      </div>

      <div className={styles.detailBox}>
        <h4 className={styles.detailTitle}>예매자 정보</h4>
        <p>이름: {name}</p>
        <p>이메일: {email}</p>
        <p>전화번호: {phone}</p>
      </div>

      <div className={styles.detailBox}>
        <h4 className={styles.detailTitle}>예매 상세 정보</h4>
        <p>인원: {people}</p>
        <p>결제 수단: {payment}</p>
        <p>결제 금액: {total}원</p>
      </div>
      <button className={styles.button} onClick={handleBack}>
        닫기
      </button>
    </div>
  );
}
