import React from 'react';
import styles from './ReservationComplete.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ReservationComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    exhibition = {},
    date,
    time,
    people,
    total,
    email,
    phone,
    name,
    payment,
  } = state || {};

  const handleComplete = () => navigate('/');

  return (
    <div className={styles.layout}>
      <h2 className={styles.completeMessage}>
        ✅ 전시 예매가 정상적으로 완료되었습니다.
      </h2>

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>예매 내용</h3>
        <div className={styles.ticketInfo}>
          <img
            src={exhibition.imageUrl}
            alt='전시 포스터'
            className={styles.poster}
          />
          <div className={styles.details}>
            <p>
              <strong>전시명</strong>: {exhibition.title}
            </p>
            <p>
              <strong>장소</strong>: {exhibition.location}
            </p>
            <p>
              <strong>일시</strong>: {exhibition.dateRange}
            </p>
            <p>
              <strong>예매자</strong>: {name}
            </p>
            <p>
              <strong>이메일</strong>: {email}
            </p>

            <p>
              <strong>매수</strong>: 성인 {people.adults}, 청소년 {people.teens}
              , 유아 {people.children}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>결제 정보</h3>
        <p>
          <strong>- 결제 금액</strong>: {total.toLocaleString()}
        </p>
        <p>
          <strong>- 할인 금액</strong>: 1,000원
        </p>
      </section>

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>결제 상세 정보</h3>
        <p>
          <strong>결제 방법</strong>: {payment}
        </p>
        <p>
          <strong>결제 금액</strong>: {(total - 1000).toLocaleString()}원
        </p>
      </section>
      <button className={styles.completeButton} onClick={handleComplete}>
        닫기
      </button>
    </div>
  );
}
