import styles from './MapModal.module.css';
import { FaXmark } from 'react-icons/fa6';
import useMap from '../../../../../Nearby/hooks/useMap';

export default function MapModal({ item, onClose }) {
  const {
    id,
    exhibition_title: title,
    exhibition_location: location,
    exhibition_start_date: startDate,
    exhibition_end_date: endDate,
    exhibition_start_time: startTime,
    exhibition_end_time: endTime,
    exhibition_organization: organization,
    exhibition_price: price,
  } = item;

  const infos = [
    {
      key: 'location',
      label: '주소',
      content: location?.name || '정보없음',
    },
    {
      key: 'date',
      label: '전시기간',
      content: startDate && endDate ? `${startDate} ~ ${endDate}` : '정보없음',
    },
    {
      key: 'time',
      label: '관람시간',
      content:
        startTime && endTime
          ? `${startTime.slice(0, 5)} ~ ${endTime.slice(0, 5)}`
          : '정보없음',
    },
    {
      key: 'closedDay',
      label: '휴관일',
      content: organization.closed_day,
    },
    {
      key: 'price',
      label: '관람료',
      content: price !== 0 ? `${price.toLocaleString()}원` : '무료',
    },
  ];

  useMap({
    lat: organization.latitude,
    lng: organization.longitude,
    id: `exhibition-${id}-map`,
    title,
    location: location?.name || '',
  });

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <button className={styles.closeButton} onClick={onClose}>
            <FaXmark className={styles.icon} />
          </button>
        </div>
        <div className={styles.map} id={`exhibition-${id}-map`} />
        <div className={styles.infoContainer}>
          {infos.map(({ key, label, content }) => (
            <div key={key}>
              <span className={styles.infoSpan}>{label}</span>
              <p className={styles.infoParagraph}>{content}</p>
            </div>
          ))}
        </div>
        <div className={styles.buttonField}>
          <button
            className={styles.locateButton}
            onClick={() => {
              alert('구현 중에 있습니다.');
            }}
          >
            길찾기
          </button>
          <button className={styles.button} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
