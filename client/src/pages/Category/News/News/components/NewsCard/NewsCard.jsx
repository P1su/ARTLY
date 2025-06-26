import { useNavigate } from 'react-router-dom';
import styles from './NewsCard.module.css';

export default function NewsCard({ newsItem }) {
  const navigate = useNavigate();
  const { id, title, start_datetime, end_datetime, organizer } = newsItem;

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

  const status = getStatusByDate(start_datetime, end_datetime);

  const handleClick = () => {
    navigate(`/notices/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[status]}`}>{status}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.info}>
        <p className={styles.period}>
          {`${formatDate(start_datetime)} ~ ${formatDate(end_datetime)}`}
        </p>
        <p className={styles.organizer}>{organizer}</p>
      </div>
    </div>
  );
}
