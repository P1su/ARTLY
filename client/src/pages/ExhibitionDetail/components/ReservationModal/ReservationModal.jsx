import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
import styles from './ReservationModal.module.css';
import { instance } from '../../../../apis/instance'; // 경로는 실제 위치에 맞게 조정

export default function ReservationModal({
  exhibition: propExhibition,
  onClose,
}) {
  const { exhibitionId } = useParams();
  const [exhibition, setExhibition] = useState(propExhibition || null);
  const [loading, setLoading] = useState(!propExhibition);
  const [error, setError] = useState(null);

  // 예약 상태
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [personCount, setPersonCount] = useState(1);
  const [reservationInfo, setReservationInfo] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    gallery: '',
    state: '관람신청',
  });

  // 달력 관련
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    if (!propExhibition && exhibitionId) {
      const fetchExhibition = async () => {
        try {
          const res = await instance.get(`/api/exhibitions/${exhibitionId}`);
          setExhibition(res.data);
          console.log(res.data);
        } catch (err) {
          setError('전시 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchExhibition();
    }
  }, [exhibitionId, propExhibition]);

  useEffect(() => {
    if (exhibition) {
      setReservationInfo((prev) => ({
        ...prev,
        gallery: exhibition.exhibition_location,
      }));
    }
  }, [exhibition]);

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    Array.from({ length: firstDayOfMonth }).forEach(() => {
      days.push({ day: '', disabled: true });
    });

    Array.from({ length: daysInMonth }).forEach((_, idx) => {
      const i = idx + 1;
      const date = new Date(currentYear, currentMonth, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      days.push({
        day: i,
        date,
        disabled: isPast,
        isToday,
      });
    });

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleDateSelect = (day) => {
    if (day.disabled) return;
    const formatted = `${currentYear}.${String(currentMonth + 1).padStart(2, '0')}.${String(day.day).padStart(2, '0')}`;
    setSelectedDate(formatted);
    setReservationInfo((prev) => ({ ...prev, date: formatted }));
  };

  const handlePersonCountChange = (inc) => {
    const newCount = personCount + inc;
    if (newCount >= 1 && newCount <= 10) {
      setPersonCount(newCount);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    if (
      step === 2 &&
      (!reservationInfo.name ||
        !reservationInfo.phone ||
        !reservationInfo.email)
    ) {
      alert('예약자 정보를 모두 입력해주세요.');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!exhibition)
    return <div className={styles.empty}>전시 정보를 찾을 수 없습니다.</div>;

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>관람예약</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className={styles.exhibitionInfo}>
              <strong>{exhibition.exhibition_title}</strong>
              <p>{exhibition.exhibition_location}</p>
            </div>

            <div className={styles.calendarContainer}>
              <div className={styles.calendarHeader}>
                <div className={styles.monthNavigator}>
                  <button className={styles.monthButton} onClick={prevMonth}>
                    {'<'}
                  </button>
                  <span
                    className={styles.currentMonth}
                  >{`${currentYear}.${String(currentMonth + 1).padStart(2, '0')}`}</span>
                  <button className={styles.monthButton} onClick={nextMonth}>
                    {'>'}
                  </button>
                </div>
              </div>

              <div className={styles.weekdaysRow}>
                {days.map((day, i) => (
                  <div
                    key={day}
                    className={`${styles.weekdayCell} ${i === 0 || i === 6 ? styles.weekend : ''}`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className={styles.calendarGrid}>
                {generateCalendarDays().map((day, idx) => {
                  const dateKey = day.day
                    ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`
                    : `empty-${Math.random()}`;
                  const isSelected =
                    selectedDate ===
                    `${currentYear}.${String(currentMonth + 1).padStart(2, '0')}.${String(day.day).padStart(2, '0')}`;
                  return (
                    <div
                      key={dateKey}
                      className={`${styles.dateCell} ${day.disabled ? styles.disabled : ''} ${
                        day.isToday ? styles.today : ''
                      } ${isSelected ? styles.selected : ''}`}
                      onClick={() => day.day && handleDateSelect(day)}
                    >
                      {day.day}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.visitorCount}>
              <span className={styles.countLabel}>인원</span>
              <div className={styles.countControls}>
                <button
                  className={styles.countButton}
                  onClick={() => handlePersonCountChange(-1)}
                >
                  -
                </button>
                <span className={styles.countDisplay}>{personCount}명</span>
                <button
                  className={styles.countButton}
                  onClick={() => handlePersonCountChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.reservationInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>예약일</span>
                <span className={styles.infoValue}>
                  {selectedDate || '선택해주세요'}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>인원</span>
                <span className={styles.infoLabel}>{personCount}명</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>장소</span>
                <span className={styles.infoValue}>{exhibition.location}</span>
              </div>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className={styles.reservationForm}>
            <h3>예약 정보 입력</h3>
            {['name', 'phone', 'email'].map((field) => (
              <div key={field} className={styles.formGroup}>
                <label>
                  {field === 'name'
                    ? '이름'
                    : field === 'phone'
                      ? '전화번호'
                      : '이메일'}
                </label>
                <input
                  type={
                    field === 'email'
                      ? 'email'
                      : field === 'phone'
                        ? 'tel'
                        : 'text'
                  }
                  name={field}
                  value={reservationInfo[field]}
                  onChange={handleInputChange}
                  placeholder={
                    field === 'name'
                      ? '예약자 이름'
                      : field === 'phone'
                        ? '010-0000-0000'
                        : 'example@email.com'
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className={styles.completionScreen}>
            <FaCheck />
            <h3>관람 예약 신청 완료</h3>
            <p>신청 내역은 전시관에서 확인 후 최종 승인됩니다.</p>
          </div>
        )}

        {/* Buttons */}
        <div className={styles.buttonsContainer}>
          {step === 1 ? (
            <button className={styles.actionButton} onClick={handleNextStep}>
              예약하기
            </button>
          ) : step === 2 ? (
            <>
              <button className={styles.actionButton} onClick={handlePrevStep}>
                이전
              </button>
              <button className={styles.actionButton} onClick={handleNextStep}>
                완료
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose}>완료</button>
              <button onClick={onClose}>나의 관람내역 보기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
