import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './/Reservation.module.css';
import exhibitionImg from './mock/exhibitionImg.png';

export default function ReservationPage() {
  const dummyExhibitions = [
    {
      id: '0',
      title: '어둠 속의 대화',
      imageUrl: exhibitionImg,
      location: '북촌 어둠속의 대화',
      dateRange: '2025.03.15 ~ 2025.06.21',
      duration: '100분',
    },
  ];

  const { exhibitionId } = useParams();
  const exhibition = dummyExhibitions.find(
    (exhibitions) => exhibitions.id === exhibitionId,
  );

  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [activeTab, setActiveTab] = useState('상세정보');

  const handleReservation = () => {
    const dummyReservationId = Date.now();
    navigate(`/purchase/${dummyReservationId}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.layout}>
      {exhibition ? (
        <div className={styles.exhibitionInfo}>
          <img
            src={exhibition.imageUrl}
            alt={exhibition.title}
            className={styles.exhibitionImage}
          />
          <h2 className={styles.exhibitionTitle}>{exhibition.title}</h2>
          <p className={styles.exhibitionDetail}>
            장소: {exhibition.location}
            <br />
            일시: {exhibition.dateRange}
            <br />
            관람 시간: {exhibition.duration}
          </p>
        </div>
      ) : (
        <p>전시 정보를 불러올 수 없습니다.</p>
      )}

      <div className={styles.formContainer}>
        <h2>- 예매하기 -</h2>

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
          max='100'
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          className={styles.input}
        />

        <button onClick={handleReservation} className={styles.button}>
          예매하기
        </button>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === '상세정보' ? styles.activeTab : ''}`}
          onClick={() => handleTabClick('상세정보')}
        >
          상세정보
        </button>
        <button
          className={`${styles.tab} ${activeTab === '주의사항' ? styles.activeTab : ''}`}
          onClick={() => handleTabClick('주의사항')}
        >
          주의사항
        </button>
        <button
          className={`${styles.tab} ${activeTab === '판매정보' ? styles.activeTab : ''}`}
          onClick={() => handleTabClick('판매정보')}
        >
          판매정보
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === '상세정보' && (
          <div>
            <p>상세정보 내용</p>
          </div>
        )}
        {activeTab === '주의사항' && (
          <div>
            <p>주의사항 내용</p>
          </div>
        )}
        {activeTab === '판매정보' && (
          <div>
            <p>판매정보 내용</p>
          </div>
        )}
      </div>
    </div>
  );
}
