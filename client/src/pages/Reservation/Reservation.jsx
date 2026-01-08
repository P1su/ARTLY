import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import styles from './Reservation.module.css';
import { userInstance } from '../../apis/instance';
import Img from '../../components/Img/Img';
import { useAlert } from '../../store/AlertProvider';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

export default function Reservation() {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [personCount, setPersonCount] = useState(1);
  const [reservationInfo, setReservationInfo] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    gallery: '',
    price: 0,
    state: '관람신청',
  });

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    if (exhibitionId) {
      const fetchExhibition = async () => {
        try {
          const res = await userInstance.get(
            `/api/exhibitions/${exhibitionId}`,
          );
          setExhibition(res.data);
        } catch {
          setError('전시 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchExhibition();
    }
  }, [exhibitionId]);

  useEffect(() => {
    if (exhibition) {
      setReservationInfo((prev) => ({
        ...prev,
        gallery: exhibition.exhibition_location?.name || '',
        price: exhibition.exhibition_price,
      }));
    }
  }, [exhibition]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await userInstance.get('/api/users/me');
        const userData = res.data;
        console.log(userData);
        setReservationInfo((prev) => ({
          ...prev,
          name: userData.user_name || '',
          phone: userData.user_phone || '',
          email: userData.user_email || '',
        }));
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const getClosedWeekdays = (closedString) => {
    if (!closedString) return [];

    const dayMap = {
      일요일: 0,
      월요일: 1,
      화요일: 2,
      수요일: 3,
      목요일: 4,
      금요일: 5,
      토요일: 6,
    };

    return closedString
      .split(',')
      .map((s) => dayMap[s.trim()])
      .filter((n) => n !== undefined);
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    const startDate = exhibition?.exhibition_start_date
      ? new Date(exhibition.exhibition_start_date)
      : null;
    const endDate = exhibition?.exhibition_end_date
      ? new Date(exhibition.exhibition_end_date)
      : null;
    const closedWeekdays = exhibition
      ? getClosedWeekdays(exhibition.exhibition_closed_day)
      : [];

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Array.from({ length: firstDayOfMonth }).forEach(() => {
      days.push({ day: '', disabled: true });
    });

    Array.from({ length: daysInMonth }).forEach((_, idx) => {
      const i = idx + 1;
      const date = new Date(currentYear, currentMonth, i);
      date.setHours(0, 0, 0, 0);

      const isToday = date.getTime() === today.getTime();

      let isDisabled = false;
      let isClosedDay = false;

      // 과거 날짜 불가
      if (date < today) isDisabled = true;

      // 전시 기간 외 불가 (시작일 전 or 종료일 후)
      if (startDate && date < startDate) isDisabled = true;
      if (endDate && date > endDate) isDisabled = true;

      // 휴관일 불가 (요일 체크)
      if (closedWeekdays.includes(date.getDay())) {
        isDisabled = true;
        isClosedDay = true;
      }
      days.push({
        day: i,
        date,
        disabled: isDisabled,
        isToday,
        isClosedDay,
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
      showAlert('날짜를 선택해주세요.');
      return;
    }

    if (
      step === 2 &&
      (!reservationInfo.name ||
        !reservationInfo.phone ||
        !reservationInfo.email)
    ) {
      showAlert('예약자 정보를 모두 입력해주세요.');
      return;
    }

    if (step === 2) {
      try {
        const response = await userInstance.post('/api/reservations', {
          exhibition_id: Number(exhibitionId),
          number_of_tickets: personCount,
          reservation_datetime: selectedDate,
          visitor_name: reservationInfo.name,
          visitor_phone: reservationInfo.phone,
          visitor_email: reservationInfo.email,
          payment_method: '', // 제거 예정
          total_price: exhibition.exhibition_price * personCount,
        });

        console.log('예약 완료:', response.data);
      } catch (error) {
        console.error('예약 실패:', error);
        showAlert('예약 처리 중 문제가 발생했습니다.');
        return;
      }
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const goToMyReservations = () => {
    navigate('/mypage', {
      state: { activeTab: 'MY관람' },
    });
  };

  if (loading) return <LoadingSpinner />;
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
      value: exhibition ? exhibition.exhibition_location?.name || '' : '',
    },
    { label: '예약자', value: reservationInfo.name },
    { label: '전화번호', value: reservationInfo.phone },
    { label: '이메일', value: reservationInfo.email },
    {
      label: '예상 가격',
      value: `${(exhibition.exhibition_price || 0).toLocaleString()}원 (방문 후 결제)`,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <span
          className={styles.breadcrumbBack}
          onClick={() => navigate(`/exhibitions/${exhibitionId}`)}
        >
          전시회
        </span>{' '}
        &gt; 관람예약
      </div>
      {/* step1 - 예약 날짜 및 인원 선택 파트 */}
      {step === 1 && (
        <>
          <div className={styles.exhibitionInfo}>
            <strong>{exhibition.exhibition_title}</strong>
            <p>{exhibition.exhibition_organization?.name || ''}</p>
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
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendDot} ${styles.dotRed}`} />
                  <span>휴관</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendDot} ${styles.dotBlue}`} />
                  <span>오늘</span>
                </div>
              </div>
            </div>

            <div className={styles.weekdaysRow}>
              {days.map((day, index) => (
                <div
                  key={day}
                  className={`${styles.weekdayCell} ${
                    index === 0 || index === 6 ? styles.weekend : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.calendarGrid}>
              {generateCalendarDays().map((day, index) => {
                const uniqueKey = day.day
                  ? `${currentYear}-${currentMonth}-${day.day}`
                  : `empty-${index}`;
                return (
                  <div
                    key={uniqueKey}
                    className={`${styles.dateCell} ${
                      day.disabled ? styles.disabled : ''
                    } ${day.isToday ? styles.today : ''} ${
                      selectedDate &&
                      day.day &&
                      selectedDate ===
                        `${currentYear}.${String(currentMonth + 1).padStart(2, '0')}.${String(day.day).padStart(2, '0')}`
                        ? styles.selected
                        : ''
                    }`}
                    onClick={() => handleDateSelect(day)}
                  >
                    <span className={styles.dateNumber}>{day.day}</span>
                    {day.day && (
                      <>
                        {day.isClosedDay && (
                          <div className={styles.closedDot} />
                        )}

                        {!day.isClosedDay && day.isToday && (
                          <div className={styles.todayDot} />
                        )}
                      </>
                    )}
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
                {exhibition.exhibition_location?.name || '장소 미정'}
              </span>
            </div>
          </div>
        </>
      )}

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
                value: exhibition ? exhibition.exhibition_title : '전시회 제목',
              },
              { label: '예약일', value: selectedDate },
              { label: '인원', value: `${personCount}명` },
              {
                label: '장소',
                value: exhibition
                  ? exhibition.exhibition_location?.name || '전시 장소'
                  : '전시 장소',
              },
              {
                label: '예상 가격',
                value: `${(exhibition.exhibition_price || 0).toLocaleString()}원`,
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

      {step === 3 && (
        <div className={styles.completionScreen}>
          <div className={styles.completionIcon}>
            <FaCheck />
          </div>
          <div className={styles.completionTitle}>관람 예약 신청 완료</div>
          <div className={styles.completionMessage}>
            {reservationInfo.name}님의 관람 예약이 완료되었습니다.
          </div>
          <div className={styles.reservationSummary}>
            <Img
              className={styles.summaryImage}
              src={exhibition.exhibition_poster}
            />
            {completionSummaryItems.map((item) => (
              <div className={styles.summaryRow} key={item.label}>
                {item.label === '전시명' ? (
                  <h2 className={styles.summaryTitle2}>{item.value}</h2>
                ) : (
                  <>
                    <span className={styles.summaryLabel}>{item.label}</span>
                    <span className={styles.summaryValue}>{item.value}</span>
                  </>
                )}
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
            <button
              className={styles.backButton}
              onClick={() => navigate('/exhibitions')}
            >
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
  );
}
