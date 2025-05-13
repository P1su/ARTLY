import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './Reservation.module.css';
import exhibitionImg from './mock/exhibitionImg.png';

export default function Reservation() {
  const navigate = useNavigate();
  const { exhibitionId } = useParams();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [adults, setAdults] = useState(0);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [activeTab, setActiveTab] = useState('상세정보');

  const price = { adult: 5000, teen: 3000, child: 0 };
  const total =
    adults * price.adult + teens * price.teen + children * price.child;

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

  const exhibition = dummyExhibitions.find((ex) => ex.id === exhibitionId);

  const handleReservation = () => {
    const reservationData = {
      exhibition,
      date: selectedDate,
      time: selectedTime,
      people: { adults, teens, children },
    };
    const dummyReservationId = Date.now();
    navigate(`/purchase/${dummyReservationId}`, { state: reservationData });
  };

  const handleBack = () => {
    navigate(`/exhibitions/${exhibitionId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '상세정보':
        return <p>상세정보 내용</p>;
      case '주의사항':
        return <p>주의사항 내용</p>;
      case '판매정보':
        return <p>판매정보 내용</p>;
      default:
        return null;
    }
  };

  const renderCounter = (label, count, setCount) => (
    <div className={styles.counterRow} key={label}>
      <span>{label}</span>
      <div>
        <button onClick={() => setCount(Math.max(0, count - 1))}>-</button>
        <span className={styles.count}>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          &larr;
        </button>
        <p className={styles.title}>예매</p>
      </header>

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
        <section className={styles.selectorSection}>
          <h3>날짜 선택</h3>
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </section>
        <section className={styles.selectorSection}>
          <h3>회차 선택</h3>
          <div className={styles.timeButtonContainer}>
            {['11:00', '13:00', '15:00', '17:00'].map((time) => (
              <button
                key={time}
                className={`${styles.timeBtn} ${selectedTime === time ? styles.active : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.selectorSection}>
          <h3>인원 선택</h3>
          {[
            {
              label: `- 성인 : ${price.adult}원`,
              count: adults,
              setCount: setAdults,
            },
            {
              label: `- 청소년 : ${price.teen}원`,
              count: teens,
              setCount: setTeens,
            },
            {
              label: `- 유아 : ${price.child}원`,
              count: children,
              setCount: setChildren,
            },
          ].map(({ label, count, setCount }) =>
            renderCounter(label, count, setCount),
          )}
        </section>

        <button onClick={handleReservation} className={styles.button}>
          예매하기
        </button>
      </div>

      <section className={styles.totalSection}>
        <h3>요금 정보</h3>
        <p>총 합계: {total.toLocaleString()}원</p>
      </section>

      <div className={styles.tabContainer}>
        {['상세정보', '주의사항', '판매정보'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
