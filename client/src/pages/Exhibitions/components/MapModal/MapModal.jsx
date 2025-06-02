import styles from './MapModal.module.css';
import { FaXmark } from 'react-icons/fa6';
import useMap from '../../../Nearby/hooks/useMap';

export default function MapModal({ item, onClose }) {
  const {
    id,
    exhibition_title: title,
    exhibition_category: category,
    exhibition_poster: poster,
    exhibition_location: location,
    exhibition_start_date: startDate,
    exhibition_end_date: endDate,
    is_liked: isLike,
  } = item;

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <button className={styles.closeButton} onClick={onClose}>
            <FaXmark className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
}
