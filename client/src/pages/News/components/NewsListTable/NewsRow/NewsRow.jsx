import { useNavigate } from 'react-router-dom';
import styles from './NewsRow.module.css';

export default function NewsRow({ notice, displayId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/notices/${notice.id}`);
  };

  const getStatusByDate = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return '예정';
    if (now > endDate) return '종료';
    return '진행중';
  };

  const status = getStatusByDate(notice.start_datetime, notice.end_datetime);

  const badgeClass =
    status === '진행중'
      ? `${styles.badge} ${styles.statusOrange}`
      : status === '예정'
      ? `${styles.badge} ${styles.statusBlue}`
      : `${styles.badge} ${styles.statusGray}`;

  const formatDate = (dateString) =>
    dateString?.split(' ')[0].replace(/-/g, '.');

  return (
    <tr className={styles.row} onClick={handleClick} role="button" tabIndex={0}>
      <td className={styles.center}>{displayId}</td>
      <td className={styles.center}>
        <span className={badgeClass}>{status}</span>
      </td>
      <td className={styles.title}>{notice.title}</td>
      <td className={styles.center}>
        {`${formatDate(notice.start_datetime)} ~ ${formatDate(notice.end_datetime)}`}
      </td>
      <td className={styles.center}>{notice.organizer}</td> 
    </tr>
  );
}

