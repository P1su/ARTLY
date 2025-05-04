import React from 'react';
import SectionTitle from '../../../../components/SectionTitle/SectionTitle';
import styles from './SectionCalendar.module.css';

export default function SectionCalendar() {
  const schedules = [
    { date: '2025/04/07', title: 'A 전시회' },
    { date: '2025/04/09', title: 'B 전시회' },
    { date: '2025/04/24', title: 'C 전시회' },
  ];

  return (
    <div className={styles.calendarLayout}>
      <SectionTitle title='전시 캘린더' />
      <div className={styles.calendar}>
        {/* 캘린더 라이브러리 활용 예정*/}
        <p>캘린더 컴포넌트</p>
      </div>
      <div className={styles.scheduleList}>
        <h3>&lt; 나의 전시회 일정 &gt;</h3>
        {schedules.map((schedule) => (
          <div key={schedule.date} className={styles.scheduledItem}>
            - {schedule.date} : {schedule.title}
          </div>
        ))}
      </div>
    </div>
  );
}
