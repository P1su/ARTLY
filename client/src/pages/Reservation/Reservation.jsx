import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Reservation.module.css';
import exhibitionImg from './mock/exhibitionImg.png';

// mock data
const price = { adult: 5000, teen: 3000, child: 0 };
const times = ['11:00', '13:00', '15:00', '17:00'];
const dummyExhibitions = [
  {
    id: '0',
    title: '어둠 속의 대화',
    imageUrl: exhibitionImg,
    location: '북촌 아트갤러리',
    dateRange: '2025.03.15 ~ 2025.06.21',
    duration: '100분',
  },
];

export default function Reservation() {
  const navigate = useNavigate();
  const { exhibitionId } = useParams();
  const exhibition = dummyExhibitions.find((ex) => ex.id === exhibitionId);

  const [activeTab, setActiveTab] = useState('상세정보');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [people, setPeople] = useState({ adults: 0, teens: 0, children: 0 });

  const total =
    people.adults * price.adult +
    people.teens * price.teen +
    people.children * price.child;

  const handleReservation = () => {
    if (!selectedDate || !selectedTime || total === 0) {
      alert('예매 정보를 모두 선택해주세요.');
      return;
    }

    const reservationData = {
      exhibition,
      date: selectedDate,
      time: selectedTime,
      people,
      total,
    };
    const dummyReservationId = Date.now().toString();
    navigate(`/purchase/${dummyReservationId}`, { state: reservationData });
  };

  const handleBack = () => navigate(`/exhibitions/${exhibitionId}`);

  // 컴포넌트로 분리한 렌더링 함수들
  const renderExhibitionInfo = () => (
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
  );

  const renderDateSelector = () => (
    <section className={styles.selectorSection}>
      <h3>날짜 선택</h3>
      <input
        type='date'
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </section>
  );

  const renderTimeSelector = () => (
    <section className={styles.selectorSection}>
      <h3>회차 선택</h3>
      <div className={styles.timeButtonContainer}>
        {times.map((time) => (
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
  );

  const renderCounter = (label, i) => (
    <div className={styles.counterRow} key={label}>
      <span>{label}</span>
      <div>
        <button
          onClick={() =>
            setPeople((prev) => ({ ...prev, [i]: Math.max(0, prev[i] - 1) }))
          }
        >
          -
        </button>
        <span className={styles.count}>{people[i]}</span>
        <button
          onClick={() => setPeople((prev) => ({ ...prev, [i]: prev[i] + 1 }))}
        >
          +
        </button>
      </div>
    </div>
  );

  const renderPeopleSelector = () => (
    <section className={styles.selectorSection}>
      <h3>인원 선택</h3>
      {[
        { label: `- 성인 : ${price.adult}원`, i: 'adults' },
        { label: `- 청소년 : ${price.teen}원`, i: 'teens' },
        { label: `- 유아 : ${price.child}원`, i: 'children' },
      ].map(({ label, i }) => renderCounter(label, i))}
    </section>
  );

  const renderTotalSection = () => (
    <section className={styles.totalSection}>
      <h4>요금 정보</h4>
      <br />
      <h3>- 총 금액: {total.toLocaleString()}원</h3>
    </section>
  );

  const renderTabs = () => (
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
  );

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

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          &larr;
        </button>
        <span className={styles.title}>전시회 예매</span>
      </header>

      {exhibition ? (
        renderExhibitionInfo()
      ) : (
        <p>전시 정보를 불러올 수 없습니다.</p>
      )}

      <div className={styles.formContainer}>
        {renderDateSelector()}
        {renderTimeSelector()}
        {renderPeopleSelector()}
        <button onClick={handleReservation} className={styles.button}>
          예매하기
        </button>
      </div>

      {renderTotalSection()}
      {renderTabs()}
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
