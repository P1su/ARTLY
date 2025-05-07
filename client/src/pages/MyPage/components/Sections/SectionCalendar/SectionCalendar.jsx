import React from 'react';
import styles from './SectionCalendar.module.css';

export default function SectionCalendar({ items }) {
  // 추후 캘린더에서 예약된 item 내용 사용
  const { title, location, date } = items;

  const schedules = [
    { date: '2025/04/07', title: 'A 전시회' },
    { date: '2025/04/09', title: 'B 전시회' },
  ];

  return (
    <div className={styles.calendarLayout}>
      <div className={styles.container}>
        <div className={styles.calendar}>
          {/* 캘린더 라이브러리 활용 예정*/}
          <p>캘린더 컴포넌트</p>
        </div>
        <div className={styles.scheduleList}>
          <h3>&lt; 나의 전시회 일정 &gt;</h3>
          {schedules.map((schedule) => (
            <div key={schedule.date} className={styles.scheduledItem}>
              - {schedule.date} : {schedule.title} {schedule.location}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
