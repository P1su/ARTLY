import styles from '../GalleryDetail.module.css';
import { FaStar } from 'react-icons/fa6';

export default function LikePopup({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.likeModalBox}>
        <FaStar className={styles.likeModalStar} />
        <h3 className={styles.likeModalTitle}>관심있는 갤러리로 추가 완료!</h3>
        <p className={styles.likeModalSub}>
          나의 관심 목록은 마이페이지에서 확인할 수 있어요.
        </p>
        <button className={styles.likeModalButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
