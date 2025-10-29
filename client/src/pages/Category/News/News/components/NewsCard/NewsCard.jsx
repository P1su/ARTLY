import { useNavigate } from 'react-router-dom';
import styles from './NewsCard.module.css';

export default function NewsCard({ newsItem }) {
  const navigate = useNavigate();
  const {
    id,
    announcement_title,
    announcement_start_datetime,
    announcement_end_datetime,
    announcement_organizer,
    announcement_category,
    announcement_status: status,
  } = newsItem;

  // ✅ 카드 내부에 formatDate 정의
  const formatDate = (dateString) =>
    dateString?.split(' ')[0].replace(/-/g, '.');

  const getStatusByDate = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return '예정';
    if (now > endDate) return '종료';
    return '진행중';
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'ongoing':
        return '진행중';
      case 'scheduled':
        return '예정';
      case 'ended':
        return '종료';
      default:
        return '';
    }
  };

  const handleClick = () => {
    navigate(`/notices/${id}`);
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role='button'
      tabIndex={0}
    >
      {
        <div className={styles.header}>
          <span className={`${styles.badge}`}>{announcement_category}</span>
          <span className={`${styles.badge} ${styles[formatStatus(status)]}`}>
            {formatStatus(status)}
          </span>
        </div>
      }
      <h3 className={styles.title}>{announcement_title}</h3>
      <div className={styles.info}>
        <p className={styles.period}>
          {`${formatDate(announcement_start_datetime)} ~ ${formatDate(announcement_end_datetime)}`}
        </p>
        <p className={styles.organizer}>{announcement_organizer}</p>
      </div>
    </div>
  );
}
