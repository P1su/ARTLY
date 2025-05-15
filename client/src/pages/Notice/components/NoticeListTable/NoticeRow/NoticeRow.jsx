import { useNavigate } from 'react-router-dom';
import styles from './NoticeRow.module.css';

export default function NoticeRow({ notice, displayId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/notices/${notice.id}`);
  };

  const badgeClass =
    notice.status === '진행중'
      ? `${styles.badge} ${styles.statusBlue}`
      : `${styles.badge} ${styles.statusGray}`;

  return (
    <tr className={styles.row} onClick={handleClick} role="button" tabIndex={0}>
      <td className={styles.center}>{displayId}</td>
      <td className={styles.center}>
        <span className={badgeClass}>{notice.status}</span>
      </td>
      <td className={styles.title}>{notice.title}</td>
      <td className={styles.center}>{notice.period}</td>
      <td className={styles.center}>{notice.host}</td>
    </tr>
  );
}
