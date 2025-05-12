// src/pages/ReservationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './/Reservation.module.css';

export default function ReservationPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);

  const handleReservation = async () => {
    // 더미 예약 ID 생성 (예: 타임스탬프나 고정값)
    const dummyReservationId = Date.now(); // 또는 '123456'
    navigate(`/purchase/${dummyReservationId}`);
  };

  return (
    <div className={styles.container}>
      <h2>예매하기</h2>

      <label className={styles.label}>관람 날짜 선택</label>
      <input
        type='date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={styles.input}
      />

      <label className={styles.label}>인원 수</label>
      <input
        type='number'
        min='1'
        max='10'
        value={people}
        onChange={(e) => setPeople(e.target.value)}
        className={styles.input}
      />

      <button onClick={handleReservation} className={styles.button}>
        예매하기
      </button>
    </div>
  );
}
