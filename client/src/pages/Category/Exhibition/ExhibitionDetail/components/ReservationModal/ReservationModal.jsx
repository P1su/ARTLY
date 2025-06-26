import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
import styles from './ReservationModal.module.css';
import { instance } from '../../../../../../apis/instance';
export default function ReservationModal({
  exhibition: propExhibition,
  onClose,
}) {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState(propExhibition || null);
  const [loading, setLoading] = useState(!propExhibition);
  const [error, setError] = useState(null);

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

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    if (!propExhibition && exhibitionId) {
      const fetchExhibition = async () => {
        try {
          const res = await instance.get(`/api/exhibitions/${exhibitionId}`);
          setExhibition(res.data);
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

  const handleNextStep = async () => {
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

    if (step === 2) {
      try {
        const response = await instance.post('/api/reservations', {
          exhibition_id: Number(exhibitionId),
          number_of_tickets: personCount,
          reservation_datetime: selectedDate,
          visitor_name: reservationInfo.name,
          visitor_phone: reservationInfo.phone,
          visitor_email: reservationInfo.email,
          payment_method: '', // 현재 구현 안 했으므로 null 또는 빈 문자열
          total_price: 0, // 마찬가지로 null 처리
        });

        console.log('예약 완료:', response.data);
      } catch (error) {
        console.error('예약 실패:', error);
        alert('예약 처리 중 문제가 발생했습니다.');
        return;
      }
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const goToMyReservations = () => {
    localStorage.setItem('fromReservationModal', 'true');
    navigate('/mypage');
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!exhibition)
    return <div className={styles.empty}>전시 정보를 찾을 수 없습니다.</div>;

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const completionSummaryItems = [
    {
      label: '전시명',
      value: exhibition ? exhibition.exhibition_title : '',
    },
    { label: '예약일', value: selectedDate },
    { label: '인원', value: `${personCount}명` },
    {
      label: '장소',
      value: exhibition ? exhibition.exhibition_location : '',
    },
    { label: '예약자', value: reservationInfo.name },
    { label: '전화번호', value: reservationInfo.phone },
    { label: '이메일', value: reservationInfo.email },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>관람예약</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* step1 - 예약 날짜 및 인원 선택 파트 */}
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
                {generateCalendarDays().map((day) => {
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
                <span className={styles.infoValue}>
                  {exhibition.exhibition_location}
                </span>
              </div>
            </div>
          </>
        )}

        {/* step2 - 예매 정보 입력 파트 */}
        {step === 2 && (
          <div className={styles.reservationForm}>
            <h3 className={styles.formTitle}>예약 정보 입력</h3>
            {['name', 'phone', 'email'].map((field) => (
              <div key={field} className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {field === 'name'
                    ? '이름'
                    : field === 'phone'
                      ? '전화번호'
                      : '이메일'}
                </label>
                <input
                  className={styles.formInput}
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

            <div className={styles.reservationSummary}>
              <div className={styles.summaryTitle}>예약 정보 확인</div>
              {[
                {
                  label: '전시명',
                  value: exhibition
                    ? exhibition.exhibition_title
                    : '전시회 제목',
                },
                { label: '예약일', value: selectedDate },
                { label: '인원', value: `${personCount}명` },
                {
                  label: '장소',
                  value: exhibition
                    ? exhibition.exhibition_location
                    : '전시 장소',
                },
              ].map((item) => (
                <div className={styles.summaryRow} key={item.label}>
                  <span className={styles.summaryLabel}>{item.label}</span>
                  <span className={styles.summaryValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* step3 - 예매 완료 파트 */}
        {step === 3 && (
          <div className={styles.completionScreen}>
            <div className={styles.completionIcon}>
              <FaCheck />
            </div>
            <div className={styles.completionTitle}>관람 예약 신청 완료</div>
            <div className={styles.completionMessage}>
              신청 내역은 전시관에서 확인 후 최종 승인됩니다.
            </div>
            <div className={styles.reservationSummary}>
              {completionSummaryItems.map((item) => (
                <div className={styles.summaryRow} key={item.label}>
                  <span className={styles.summaryLabel}>{item.label}</span>
                  <span className={styles.summaryValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.buttonsContainer}>
          {step === 1 ? (
            <button className={styles.actionButton} onClick={handleNextStep}>
              예약하기
            </button>
          ) : step === 2 ? (
            <>
              <button className={styles.backButton} onClick={handlePrevStep}>
                이전
              </button>
              <button className={styles.actionButton} onClick={handleNextStep}>
                완료
              </button>
            </>
          ) : (
            <>
              <button className={styles.backButton} onClick={onClose}>
                완료
              </button>
              <button
                className={styles.actionButton}
                onClick={goToMyReservations}
              >
                나의 관람내역
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
