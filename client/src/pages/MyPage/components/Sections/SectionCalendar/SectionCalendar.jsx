import React, { useState } from 'react';
import Calendar from 'react-calendar';
import styles from './SectionCalendar.module.css';
import 'react-calendar/dist/Calendar.css';

export default function SectionCalendar() {
  const [checkedDates, setCheckedDates] = useState(new Set());

  // 날짜를 YYYY-MM-DD 형식 문자열로 변환 (로컬 기준)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const toggleDate = (date) => {
    const dateStr = formatDate(date);
    const newSet = new Set(checkedDates);
    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }
    setCheckedDates(newSet);
  };

  return (
    <div className={styles.calendarLayout}>
      <div className={styles.calendar}>
        <Calendar
          onClickDay={toggleDate}
          value={null}
          tileClassName={({ date }) =>
            checkedDates.has(formatDate(date)) ? styles.checked : null
          }
        />
      </div>

      <div className={styles.scheduleList}>
        <h3>방문 예정 날짜</h3>
        {checkedDates.size > 0 ? (
          Array.from(checkedDates)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((dateStr) => <p key={dateStr}>▪️ {dateStr}</p>)
        ) : (
          <p>체크한 날짜가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
